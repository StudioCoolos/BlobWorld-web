<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import useWebsocketStore from '@/stores/websocket.js'
import useDeviceStore from '@/stores/device.js'
import * as THREE from 'three'
import vertexShader from '@/shaders/key/vertex.glsl'
import fragmentShader from '@/shaders/key/fragment.glsl'

import RAPIER from '@dimforge/rapier2d-compat'
import { Pane } from 'tweakpane'

/**
 * @type {Ref<HTMLCanvasElement>}
 */
const canvas = ref()
const spheresContainer = ref()
/**
 * @type {Ref<CanvasRenderingContext2D>}
 */
let renderer,
	scene,
	camera,
	sdfArray = [],
	material,
	rappierLoaded = false,
	world,
	rigidBodies = {},
	touchSphere = {},
	isCompleted = false

const ctx = ref()
const websocketStore = useWebsocketStore()
const deviceStore = useDeviceStore()
const pane = new Pane()
const params = {
	sphereRadiusMin: 0.09,
	sphereRadiusMax: 0.13,
	physicsSphereRadiusMin: 25,
	physicsSphereRadiusMax: 42,
}
const isPlayer1 = window.location.pathname.includes('player2') ? false : true
// const isPlayer1 = false
const targetZones = []
// deviceStore.setOrientationMode('landscape')

onMounted(() => {
	console.log('monkey ted')
	setupCanvas()
	setupSDFSpheres()
	setupZones()
	RAPIER.init().then(() => {
		rappierLoaded = true
		setupPhysics()
	})
})

onUnmounted(() => {
	// cleanup
})

function setupCanvas() {
	const screenWidth = window.innerWidth
	const screenHeight = window.innerHeight
	const aspectRatio = screenWidth / screenHeight

	const textureLoader = new THREE.TextureLoader()

	// setup a threejs renderer in the canvas with a plane that has a shader material on it
	renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true })
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight, true)

	scene = new THREE.Scene()
	camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 0.1, 100)
	camera.position.z = 1 // Position the camera

	const keyTexture = textureLoader.load('/images/key-outline-2.jpg', () => {
		material.uniforms.uKeyResolution.value.x = keyTexture.image.width
		material.uniforms.uKeyResolution.value.y = keyTexture.image.height
	})

	const geometry = new THREE.PlaneGeometry(2, 2)
	material = new THREE.ShaderMaterial({
		vertexShader,
		fragmentShader,
		defines: {
			IS_PLAYER1: isPlayer1,
		},
		uniforms: {
			uBackground: { value: textureLoader.load('/images/key-background.jpeg') },
			uKeyOutline: { value: keyTexture },
			uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
			uRoundMergeRadius: { value: 0.05 },
			uColor: { value: new THREE.Color(0xffff00) },
			uKeyResolution: { value: new THREE.Vector2() },
			uSpheres: {
				value: {
					0: { center: new THREE.Vector2(), radius: 0 },
					1: { center: new THREE.Vector2(), radius: 0 },
					2: { center: new THREE.Vector2(), radius: 0 },
					3: { center: new THREE.Vector2(), radius: 0 },
					4: { center: new THREE.Vector2(), radius: 0 },
					5: { center: new THREE.Vector2(), radius: 0 },
					6: { center: new THREE.Vector2(), radius: 0 },
					7: { center: new THREE.Vector2(), radius: 0 },
					8: { center: new THREE.Vector2(), radius: 0 },
					9: { center: new THREE.Vector2(), radius: 0 },
				},
			},
		},
	})

	const plane = new THREE.Mesh(geometry, material)
	scene.add(plane)

	// pane.addBinding(material.uniforms.uRoundMergeRadius, 'value', { label: 'Merge Radius', min: 0, max: 1 })
	// pane.addBinding(params, 'sphereRadiusMin', { label: 'Sphere Radius Min', min: 0.01, max: 0.2 })
	// pane.addBinding(params, 'sphereRadiusMax', { label: 'Sphere Radius Max', min: 0.01, max: 0.2 })

	tick()
}

function isPointInCircle(px, py, cx, cy, r) {
	return (px - cx) ** 2 + (py - cy) ** 2 <= r ** 2
}

function isPointInRectangle(px, py, rx, ry, width, height) {
	return px >= rx && px <= rx + width && py >= ry && py <= ry + height
}

function remap(value, low1, high1, low2, high2) {
	return low2 + ((value - low1) / (high1 - low1)) * (high2 - low2)
}

function setupZones() {
	if (isPlayer1) {
		const circle = {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
			radius: 140,
			isCircle: true,
		}

		let element = document.createElement('div')
		element.classList.add('target-zone')
		element.style.width = circle.radius * 2 + 'px'
		element.style.height = circle.radius * 2 + 'px'
		element.style.borderRadius = '50%'
		element.style.top = circle.y - circle.radius + 'px'
		element.style.left = circle.x - circle.radius + 'px'
		spheresContainer.value.appendChild(element)

		const rectangle = {
			x: window.innerWidth / 2 - 50,
			y: window.innerHeight - 190,
			width: 100,
			height: 80,
			isCircle: false,
		}

		element = document.createElement('div')
		element.classList.add('target-zone')
		element.style.width = rectangle.width + 'px'
		element.style.height = rectangle.height + 'px'
		element.style.top = rectangle.y + 'px'
		element.style.left = rectangle.x + 'px'
		spheresContainer.value.appendChild(element)

		const linkRectangle = {
			x: window.innerWidth / 2 - 50,
			y: window.innerHeight - 100,
			width: 100,
			height: 80,
			isLinkRectangle: true,
		}

		element = document.createElement('div')
		element.classList.add('target-zone')
		element.style.width = linkRectangle.width + 'px'
		element.style.height = linkRectangle.height + 'px'
		element.style.top = linkRectangle.y + 'px'
		element.style.left = linkRectangle.x + 'px'
		spheresContainer.value.appendChild(element)

		targetZones.push(circle)
		targetZones.push(rectangle)
		targetZones.push(linkRectangle)
	} else {
		const rectangle = {
			x: window.innerWidth / 2 - 50,
			y: 80,
			width: 100,
			height: 400,
			isCircle: false,
		}

		let element = document.createElement('div')
		element.classList.add('target-zone')
		element.style.width = rectangle.width + 'px'
		element.style.height = rectangle.height + 'px'
		element.style.top = rectangle.y + 'px'
		element.style.left = rectangle.x + 'px'
		spheresContainer.value.appendChild(element)

		const rectangle2 = {
			x: window.innerWidth / 2 - 120,
			y: 310,
			width: 60,
			height: 160,
			isCircle: false,
		}

		element = document.createElement('div')
		element.classList.add('target-zone')
		element.style.width = rectangle2.width + 'px'
		element.style.height = rectangle2.height + 'px'
		element.style.top = rectangle2.y + 'px'
		element.style.left = rectangle2.x + 'px'
		spheresContainer.value.appendChild(element)

		const linkRectangle = {
			x: window.innerWidth / 2 - 50,
			y: -10,
			width: 100,
			height: 80,
			isLinkRectangle: true,
		}

		element = document.createElement('div')
		element.classList.add('target-zone')
		element.style.width = linkRectangle.width + 'px'
		element.style.height = linkRectangle.height + 'px'
		element.style.top = linkRectangle.y + 'px'
		element.style.left = linkRectangle.x + 'px'
		spheresContainer.value.appendChild(element)

		targetZones.push(rectangle)
		targetZones.push(rectangle2)
		targetZones.push(linkRectangle)
	}
}

function setupSDFSpheres() {
	let sdfCount = isPlayer1 ? 10 : 7
	for (let i = 0; i < sdfCount; i++) {
		sdfArray.push({
			x: Math.random() * 0.8 + 0.1,
			y: Math.random() * 0.8 + 0.1,
			radius: Math.random() * (params.sphereRadiusMax - params.sphereRadiusMin) + params.sphereRadiusMin,
		})
		material.uniforms.uSpheres.value[i] = {
			center: new THREE.Vector2(sdfArray[i].x, sdfArray[i].y),
			radius: sdfArray[i].radius,
		}
	}
}

function setupPhysics() {
	world = new RAPIER.World({ x: 0, y: 0 })

	rigidBodies = {}

	const sizes = { width: window.innerWidth, height: window.innerHeight }

	let colliderHeight = 500
	let colliderWidth = 2000
	let baseCollider = RAPIER.ColliderDesc.cuboid(colliderWidth, colliderHeight)
	let marginDivider = 2
	let marginDividerPhysics = 1.05

	const bottomWall = document.createElement('div')
	bottomWall.classList.add('wall-collider')
	bottomWall.style.width = `${colliderWidth}px`
	bottomWall.style.height = `${colliderHeight}px`
	bottomWall.style.transform = 'translate(' + -colliderWidth / 2 + 'px,' + -colliderHeight / 2 + 'px)'
	bottomWall.style.top = sizes.height + colliderHeight / marginDivider + 'px'
	bottomWall.style.left = sizes.width / 2 + 'px'
	spheresContainer.value.appendChild(bottomWall)

	rigidBodies.bottomWall = world.createRigidBody(RAPIER.RigidBodyDesc.fixed())
	rigidBodies.bottomWall.setTranslation(
		{ x: sizes.width / 2, y: sizes.height + colliderHeight / marginDividerPhysics },
		true
	)
	world.createCollider(baseCollider, rigidBodies.bottomWall)

	const topWall = document.createElement('div')
	topWall.classList.add('wall-collider')
	topWall.style.width = `${colliderWidth}px`
	topWall.style.height = `${colliderHeight}px`
	topWall.style.transform = 'translate(' + -colliderWidth / 2 + 'px,' + -colliderHeight / 2 + 'px)'
	topWall.style.top = 0 - colliderHeight / marginDivider + 'px'
	topWall.style.left = sizes.width / 2 + 'px'
	spheresContainer.value.appendChild(topWall)

	rigidBodies.topWall = world.createRigidBody(RAPIER.RigidBodyDesc.fixed())
	rigidBodies.topWall.setTranslation({ x: sizes.width / 2, y: 0 - colliderHeight / marginDividerPhysics }, true)
	world.createCollider(baseCollider, rigidBodies.topWall)

	colliderHeight = 2000
	colliderWidth = 500
	baseCollider = RAPIER.ColliderDesc.cuboid(colliderWidth, colliderHeight)

	const leftWall = document.createElement('div')
	leftWall.classList.add('wall-collider')
	leftWall.style.width = `${colliderWidth}px`
	leftWall.style.height = `${colliderHeight}px`
	leftWall.style.transform = 'translate(' + -colliderWidth / 2 + 'px,' + -colliderHeight / 2 + 'px)'
	leftWall.style.top = sizes.height / 2 + 'px'
	leftWall.style.left = -colliderWidth / marginDivider + 'px'
	spheresContainer.value.appendChild(leftWall)

	rigidBodies.leftWall = world.createRigidBody(RAPIER.RigidBodyDesc.fixed())
	rigidBodies.leftWall.setTranslation({ x: 0 - colliderWidth / marginDividerPhysics, y: sizes.height / 2 }, true)
	world.createCollider(baseCollider, rigidBodies.leftWall)

	const rightWall = document.createElement('div')
	rightWall.classList.add('wall-collider')
	rightWall.style.width = `${colliderWidth}px`
	rightWall.style.height = `${colliderHeight}px`
	rightWall.style.transform = 'translate(' + -colliderWidth / 2 + 'px,' + -colliderHeight / 2 + 'px)'
	rightWall.style.top = sizes.height / 2 + 'px'
	rightWall.style.left = sizes.width + colliderWidth / marginDivider + 'px'
	spheresContainer.value.appendChild(rightWall)

	rigidBodies.rightWall = world.createRigidBody(RAPIER.RigidBodyDesc.fixed())
	rigidBodies.rightWall.setTranslation(
		{ x: sizes.width + colliderWidth / marginDividerPhysics, y: sizes.height / 2 },
		true
	)
	world.createCollider(baseCollider, rigidBodies.rightWall)

	sdfArray.forEach((data, index) => {
		// create html red sphere element for each sdf
		let element = document.createElement('div')
		element.classList.add('sphere')
		spheresContainer.value.appendChild(element)
		sdfArray[index].element = element
		const colliderWidth = remap(
			data.radius,
			params.sphereRadiusMin,
			params.sphereRadiusMax,
			params.physicsSphereRadiusMin,
			params.physicsSphereRadiusMax
		)
		let ballCollider = RAPIER.ColliderDesc.ball(colliderWidth)

		data.element.style.width = colliderWidth * 2 + 'px'
		data.element.style.height = colliderWidth * 2 + 'px'
		ballCollider.setFriction(0.0)
		ballCollider.setDensity(1000)

		rigidBodies[`sdf${index}`] = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic())
		rigidBodies[`sdf${index}`].setTranslation({ x: data.x * sizes.width, y: data.y * sizes.height }, true)
		world.createCollider(ballCollider, rigidBodies[`sdf${index}`])
		sdfArray[index].rigidBody = rigidBodies[`sdf${index}`]
		console.log(rigidBodies[`sdf${index}`].translation())
	})

	touchSphere.element = document.createElement('div')
	touchSphere.element.classList.add('sphere-touch')
	spheresContainer.value.appendChild(touchSphere.element)

	let ballCollider = RAPIER.ColliderDesc.ball(50)
	ballCollider.setFriction(0.0)
	ballCollider.setDensity(100)

	let squareCollider = RAPIER.ColliderDesc.cuboid(50, 50)
	squareCollider.setFriction(0.0)
	squareCollider.setDensity(100)

	const touchRigidBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic())
	touchRigidBody.setTranslation({ x: 0, y: 0 }, true)
	world.createCollider(ballCollider, touchRigidBody)
	touchSphere.rigidBody = touchRigidBody
}

function sendMessage() {
	websocketStore.sendMessage({
		event: 'key',
	})
}

/**
 * Update
 */
function updatePhysics() {
	world.step()

	sdfArray.forEach((sdf) => {
		sdf.rigidBody.setLinvel({ x: 0, y: 0 })
		let position = sdf.rigidBody.translation()
		let domPositionX = position.x - sdf.element.offsetHeight / 2
		let domPositionY = position.y - sdf.element.offsetHeight / 2
		sdf.element.style.transform = 'translate(' + domPositionX + 'px,' + domPositionY + 'px)'

		material.uniforms.uSpheres.value[sdfArray.indexOf(sdf)].center.x = position.x / window.innerWidth
		material.uniforms.uSpheres.value[sdfArray.indexOf(sdf)].center.y = position.y / window.innerHeight
	})

	touchSphere.rigidBody.setLinvel({ x: 0, y: 0 })

	let touchPosition = touchSphere.rigidBody.translation()
	let domPositionX = touchPosition.x - touchSphere.element.offsetHeight / 2
	let domPositionY = touchPosition.y - touchSphere.element.offsetHeight / 2
	touchSphere.element.style.transform = 'translate(' + domPositionX + 'px,' + domPositionY + 'px)'
}

function resizePhysics() {
	const sizes = { width: window.innerWidth, height: window.innerHeight }

	if (!rappierLoaded) return
	rigidBodies.leftGround.setTranslation({ x: 1000, y: sizes.height }, true)
	rigidBodies.rightGround.setTranslation({ x: sizes.width - 1000, y: sizes.height }, true)

	rigidBodies.leftWall.setTranslation({ x: 0, y: sizes.height / 2 }, true)
	rigidBodies.rightWall.setTranslation({ x: sizes.width, y: sizes.height / 2 }, true)
}

function checkZones() {
	let counterCircle = 0
	let counterRectangle = 0
	let counterLink = 0
	let isGoodCount = 0
	sdfArray.forEach((sdf) => {
		let isGood = false
		targetZones.forEach((zone) => {
			if (zone.isCircle) {
				if (
					isPointInCircle(sdf.rigidBody.translation().x, sdf.rigidBody.translation().y, zone.x, zone.y, zone.radius)
				) {
					sdf.element.style.backgroundColor = 'yellow'
					counterCircle++
					isGood = true
					return
				}
			} else {
				if (
					isPointInRectangle(
						sdf.rigidBody.translation().x,
						sdf.rigidBody.translation().y,
						zone.x,
						zone.y,
						zone.width,
						zone.height
					)
				) {
					if (zone.isLinkRectangle) {
						sdf.element.style.backgroundColor = 'blue'
						counterLink++
						isGood = true
						return
					} else {
						sdf.element.style.backgroundColor = 'green'
						counterRectangle++
						isGood = true
						return
					}
				}
			}
		})
		if (!isGood) {
			sdf.element.style.backgroundColor = 'red'
		} else {
			isGoodCount++
		}
	})

	let counter = counterCircle + counterRectangle + counterLink

	if (isGoodCount >= sdfArray.length) {
		if (isPlayer1) {
			if (counterRectangle >= 1 && counterLink >= 1) {
				sendMessage()
				// document.querySelector('.target-zone').style.visibility = 'visible'
				isCompleted = true
				console.log('completed')
			}
		} else {
			if (counterLink >= 1) {
				sendMessage()
				// document.querySelector('.target-zone').style.visibility = 'visible'
				isCompleted = true
				console.log('completed')
			}
		}
	}
}

let lastTouchPosition = { x: 0, y: 0 }
let touchPosition = { x: 0, y: 0 }
let touchSpeed = 0

function handleTouchStart(event) {
	let touch = event.touches[0]
	lastTouchPosition.x = touch.clientX
	lastTouchPosition.y = touch.clientY

	touchSphere.rigidBody.setTranslation({ x: lastTouchPosition.x, y: lastTouchPosition.y }, true)
	touchSphere.rigidBody.setLinvel({ x: 0, y: 0 })
}

function handleTouchMove(event) {
	event.preventDefault()
	let touch = event.touches[0]
	touchPosition.x = touch.clientX
	touchPosition.y = touch.clientY

	// Calculate movement vector and its magnitude as speed
	let dx = touchPosition.x - lastTouchPosition.x
	let dy = touchPosition.y - lastTouchPosition.y
	touchSpeed = Math.sqrt(dx * dx + dy * dy) // Speed is the magnitude of the movement vector

	lastTouchPosition.x = touchPosition.x
	lastTouchPosition.y = touchPosition.y

	touchSphere.rigidBody.setTranslation({ x: touchPosition.x, y: touchPosition.y }, true)
	touchSphere.rigidBody.setLinvel({ x: 0, y: 0 })
}

function handleTouchEnd(event) {
	// const x = event.changedTouches[0].clientX
	// const y = event.changedTouches[0].clientY
	// if (y < startY) {
	// 	const force = Math.round(Math.sqrt((x - startX) ** 2 + (y - startY) ** 2))
	// 	const angle = Math.round((Math.atan2(y - startY, x - startX) + Math.PI / 2) * (180 / Math.PI))
	// 	// websocketStore.sendMessage({
	// 	// 	event: 'throw',
	// 	// 	force,
	// 	// 	angle,
	// 	// })
	// }
}

function tick() {
	if (isCompleted) return

	requestAnimationFrame(tick)
	if (renderer) renderer.render(scene, camera)

	if (rappierLoaded) updatePhysics()

	if (rappierLoaded) checkZones()
}

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
	const screenWidth = window.innerWidth
	const screenHeight = window.innerHeight
	const aspectRatio = screenWidth / screenHeight

	material.uniforms.uResolution.value.x = screenWidth
	material.uniforms.uResolution.value.y = screenHeight

	// Update camera
	camera.aspect = aspectRatio
	// For OrthographicCamera, adjust frustum
	camera.left = -aspectRatio
	camera.right = aspectRatio
	camera.top = 1
	camera.bottom = -1
	camera.updateProjectionMatrix()

	// Update renderer size
	renderer.setSize(screenWidth, screenHeight)

	resizePhysics()
}
</script>

<template>
	<canvas
		class="key"
		ref="canvas"
		@touchstart="handleTouchStart"
		@touchmove="handleTouchMove"
		@touchend="handleTouchEnd"
	/>
	<div ref="spheresContainer" class="spheres-container"></div>
</template>

<style scoped>
canvas {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.key {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	/* top: 0; */
}

.spheres-container {
	pointer-events: none;
	position: absolute;
	width: 100%;
	height: 100%;
	overflow: hidden;
	/* top: 0; */
}

:global(.sphere) {
	position: absolute;
	width: 80px;
	/* // physics radius * 2 */
	height: 80px;
	background-color: red;
	border-radius: 50%;
	top: 0;
	left: 0;
	visibility: hidden;
}

:global(.sphere-touch) {
	position: absolute;
	width: 100px;
	height: 100px;
	background-color: rgb(0, 0, 0);
	border-radius: 50%;
	top: 0;
	left: 0;
	opacity: 0.1;
}

:global(.target-zone) {
	position: absolute;
	border: 5px solid red;
	visibility: hidden;
}

:global(.wall-collider) {
	position: absolute;
	background-color: rgb(0, 0, 0);
}

.tweakpane {
	display: none;
}
</style>
