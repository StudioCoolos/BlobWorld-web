<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import useWebsocketStore from '@/stores/websocket.js'
import useDeviceStore from '@/stores/device.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import vertexShader from '@/shaders/key-v2/vertex.glsl'
import fragmentShader from '@/shaders/key-v2/fragment.glsl'

import RAPIER from '@dimforge/rapier2d-compat'
import { Pane } from 'tweakpane'
import { gsap } from 'gsap'

// Chunks
import PhongPars from '@/shaders/chunks/phong/pars.glsl.js'
import PhongFragment from '@/shaders/chunks/phong/fragment.glsl.js'
import MatcapPars from '@/shaders/chunks/matcap/pars.glsl.js'
import MatcapFragment from '@/shaders/chunks/matcap/fragment.glsl.js'
import ShadowsVertexPars from '@/shaders/chunks/shadows/vertex_pars.glsl.js'
import ShadowsVertex from '@/shaders/chunks/shadows/vertex.glsl.js'
import ShadowsFragmentPars from '@/shaders/chunks/shadows/fragment_pars.glsl.js'
import ShadowsFragment from '@/shaders/chunks/shadows/fragment.glsl.js'
import { lerp } from '@/utils/math'

/**
 * @type {Ref<HTMLCanvasElement>}
 */
const canvas = ref()
const portal = ref()
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
// const pane = new Pane()
const params = {
	minSpeed: 1,
	maxSpeed: 3.5,
}
let lastTimestamp = gsap.ticker.time
let lastTouchTime = 0
let lastTouchX = 0
let lastTouchY = 0
let speed = 0
let targetSpeed = 0
let ease = 0.04
let counter = 0
let turnsGoal = 4
let lastAngle = 0
let accumulatedAngle = 0
let turns = 0
const isPlayer1 = window.location.pathname.includes('player2') ? false : true
// const isPlayer1 = false
const targetZones = []
// deviceStore.setOrientationMode('landscape')

onMounted(() => {
	console.log('monkey ted')
	// setupCanvas()
	gsap.ticker.add(tick)

	gsap.delayedCall(1, () => {
		window.setInterval(() => {
			sendMessage()
		}, 500)
	})
})

onUnmounted(() => {
	// remove gsap ticker
	gsap.ticker.remove(tick)
	window.removeEventListener('resize', onWindowResize)
	// remove interval
	isCompleted = true
})

function setupCanvas() {
	// THREE.ShaderChunk.phong_pars_fragment = PhongPars
	// THREE.ShaderChunk.phong_fragment = PhongFragment

	// THREE.ShaderChunk.matcap_pars_fragment = MatcapPars
	// THREE.ShaderChunk.matcap_fragment = MatcapFragment

	// THREE.ShaderChunk.shadows_vertex_pars = ShadowsVertexPars
	// THREE.ShaderChunk.shadows_vertex = ShadowsVertex
	// THREE.ShaderChunk.shadows_fragment_pars = ShadowsFragmentPars
	// THREE.ShaderChunk.shadows_fragment = ShadowsFragment

	const screenWidth = window.innerWidth
	const screenHeight = window.innerHeight
	const aspectRatio = screenWidth / screenHeight

	const textureLoader = new THREE.TextureLoader()

	// setup a threejs renderer in the canvas with a plane that has a shader material on it
	renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true, transparent: true })
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight, true)

	scene = new THREE.Scene()
	camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 0.1, 100)
	// camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000)
	// const orbit = new OrbitControls(camera, renderer.domElement)
	camera.position.z = 1

	const keyTexture = textureLoader.load('/images/key-outline-2.jpg', () => {})

	const geometry = new THREE.PlaneGeometry(2, 2)
	material = new THREE.ShaderMaterial({
		vertexShader,
		fragmentShader,
		transparent: true,
		defines: {
			IS_PLAYER1: isPlayer1,
		},
		uniforms: {
			uPortal: { value: textureLoader.load('/images/portal-image.png') },
			uMinSpeed: { value: params.minSpeed },
			uMaxSpeed: { value: params.maxSpeed },
			uSpeed: { value: 0 },
			uTime: { value: 0 },
		},
	})

	const scaleFactor = screenHeight / screenWidth

	const plane = new THREE.Mesh(geometry, material)
	// plane.scale.set(2, 2, 2)
	scene.add(plane)

	const light = new THREE.DirectionalLight(0xffffff, 2)
	light.position.set(5, 2, 5)
	// scene.add(light)

	const helper = new THREE.DirectionalLightHelper(light, 2)
	// scene.add(helper)

	// pane.addBinding(material.uniforms.uRoundMergeRadius, 'value', { label: 'Merge Radius', min: 0, max: 1 })
	// pane.addBinding(params, 'sphereRadiusMin', { label: 'Sphere Radius Min', min: 0.01, max: 0.2 })
	// pane.addBinding(params, 'sphereRadiusMax', { label: 'Sphere Radius Max', min: 0.01, max: 0.2 })

	// createPane()
}

function createPane() {
	pane.addBinding(params, 'maxSpeed', { label: 'max speed', min: 0, max: 10 })
	pane.addBinding(params, 'minSpeed', { label: 'min speed', min: 0, max: 10 })
}

function sendMessage() {
	console.log('send message', speed.toFixed(3))
	websocketStore.sendMessage({
		event: 'portal',
		speed: speed.toFixed(3),
	})
}

/**
 * Update
 */

let lastTouchPosition = { x: 0, y: 0 }
let touchPosition = { x: 0, y: 0 }
let touchSpeed = 0

function getAngle(x, y, centerX, centerY) {
	return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI)
}

function handleTouchStart(event) {
	const touch = event.touches[0]
	lastTouchTime = gsap.ticker.time
	lastTimestamp = gsap.ticker.time
	lastTouchX = touch.clientX
	lastTouchY = touch.clientY

	lastAngle = getAngle(lastTouchX, lastTouchY, window.innerWidth / 2, window.innerHeight / 2)

	ease = 0.04
}

function handleTouchMove(event) {
	const touch = event.touches[0]
	const currentTime = gsap.ticker.time
	const currentX = touch.clientX
	const currentY = touch.clientY

	const deltaTime = currentTime - lastTimestamp
	const deltaX = currentX - lastTouchX
	const deltaY = currentY - lastTouchY

	// Calculate distance moved
	const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

	// Normalize distance by the diagonal length of the screen
	const screenWidth = window.innerWidth
	const screenHeight = window.innerHeight
	const diagonalLength = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight)
	const normalizedDistance = distance / diagonalLength

	const centerX = window.innerWidth / 2
	const centerY = window.innerHeight / 2

	const currentAngle = getAngle(currentX, currentY, centerX, centerY)

	if (lastTouchX !== 0 && lastTouchY !== 0) {
		let deltaAngle = currentAngle - lastAngle

		if (deltaAngle > 180) {
			deltaAngle -= 360
		} else if (deltaAngle < -180) {
			deltaAngle += 360
		}

		accumulatedAngle += deltaAngle
		turns = accumulatedAngle / 360
		turns = Math.max(-turnsGoal, Math.min(turnsGoal, turns))
	}

	// Calculate normalized speed (normalized distance per millisecond)
	targetSpeed = normalizedDistance * 10 * turns

	// Update last position and time
	lastAngle = currentAngle
	lastTouchTime = currentTime
	lastTouchX = currentX
	lastTouchY = currentY
}

function handleTouchEnd(event) {
	// Reset values if needed
	lastTouchTime = 0
	lastTouchX = 0
	lastTouchY = 0

	// Reset speed
	targetSpeed = 0

	ease = 0.08

	lastAngle = 0
	accumulatedAngle = 0
}

function tick() {
	if (isCompleted) return

	// renderer.render(scene, camera)
	speed = lerp(speed, targetSpeed, ease)
	portal.value.style.transform = `scale(${speed}) rotateZ(${performance.now() / 3}deg)`
	// material.uniforms.uSpeed.value = speed
	// material.uniforms.uTime.value = performance.now() / 1000
}

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
	// const screenWidth = window.innerWidth
	// const screenHeight = window.innerHeight
	// const aspectRatio = screenWidth / screenHeight
	// // material.uniforms.uResolution.value.x = screenWidth
	// // material.uniforms.uResolution.value.y = screenHeight
	// // Update camera
	// camera.aspect = aspectRatio
	// // For OrthographicCamera, adjust frustum
	// camera.left = -aspectRatio
	// camera.right = aspectRatio
	// camera.top = 1
	// camera.bottom = -1
	// camera.updateProjectionMatrix()
	// // Update renderer size
	// renderer.setSize(screenWidth, screenHeight)
}
</script>

<template>
	<!-- <canvas
		class="key"
		ref="canvas"
		@touchstart="handleTouchStart"
		@touchmove="handleTouchMove"
		@touchend="handleTouchEnd"
	/> -->
	<div class="container" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
		<img src="/images/portal-image.png" class="portal" ref="portal" />
	</div>
	<!-- <div ref="spheresContainer" class="spheres-container"></div> -->
</template>

<style scoped>
.container {
	position: absolute;
	left: 0;
	top: 15vh;
	width: 100vw;
	height: 100vh;
}
.portal {
	position: absolute;
	left: 0;
	top: 0;
	inset: 0;
	width: 100%;
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
