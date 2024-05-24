<script setup>
import { computed, onMounted, ref } from 'vue'
import gsap from 'gsap'

import allPermissions from '@/utils/permissions.js'
import useWebsocketStore from '@/stores/websocket.js'
import logdepthbuf_fragmentGlsl from 'three/src/renderers/shaders/ShaderChunk/logdepthbuf_fragment.glsl.js'

const websocketStore = useWebsocketStore()

const permissionsAccepted = ref(false)
const phase0 = ref()
const phases = ref()
const cubes = ref()
const cubesTimeline = gsap.timeline({ repeat: -1 })
const viewportWidth = window.innerWidth

function handlePermissionClick() {
	console.log('handlePermissionClick')
	allPermissions()
		.then((result) => {
			permissionsAccepted.value = true
			console.log(result)

			gsap.to(phase0.value, { opacity: 0, duration: 1, onComplete: animatePhase1 })
		})
		.catch((reason) => {
			alert(reason)
		})
}

websocketStore.ws.addEventListener('message', (event) => {
	const data = JSON.parse(event.data)

	if (data.event === 'p2_connected') {
		gsap.to(phases.value.children[0], { opacity: 0, duration: 1, onComplete: animatePhase2 })
	}
})

function animatePhase1() {
	const phase1Element = phases.value.children[0]
	const title = phase1Element.querySelector('.title')
	const subtitle = phase1Element.querySelector('.subtitle')

	const timeline = gsap.timeline()

	timeline.to(phase1Element, { opacity: 1, duration: 1 })
	timeline.to(title.children, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.05 }, '-=0.5')
	timeline.to(
		subtitle.children,
		{ opacity: 1, duration: 0.4, stagger: 0.04 }, // start same time as title
		'<+=1',
	)

	const cubesElements = cubes.value.children
	const cubeWidth = cubesElements[0].offsetWidth
	const gap = 16
	const totalWidth = cubeWidth * 3 + gap * 2 // total width of 4 cubes and 2 gaps

	// Set initial position of individual cubes
	gsap.set(cubes.value, { width: totalWidth, left: '50%', x: '-50%' })
	gsap.set(cubesElements[0], { x: 0 })
	gsap.set(cubesElements[1], { x: 0 })
	gsap.set(cubesElements[2], { x: cubeWidth + gap })
	gsap.set(cubesElements[3], { x: cubeWidth * 2 + gap * 2 })

	gsap.to(cubes.value, { opacity: 1, duration: 1 })
	cubesTimeline.to(cubesElements, { scale: 0.6, duration: 0.8, stagger: 0.2 }, '-=0.6')
	cubesTimeline.to(cubesElements, { scale: 1, duration: 0.8, stagger: 0.1 }, '-=0.6')
}

function animatePhase2() {
	const phase2Element = phases.value.children[1]
	const title = phase2Element.querySelector('.title')
	const subtitle = phase2Element.querySelector('.subtitle')

	const timeline = gsap.timeline()

	timeline.to(phase2Element, { opacity: 1, duration: 1 }) // Fade in phase2 container

	// If is animating, stop the staggered animation and make all cubes scale 1 at the same time
	cubesTimeline.kill()
	const cubesElements = cubes.value.children
	const cubeWidth = cubesElements[0].offsetWidth
	// gsap.to(cubesElements, { x: '-50%', scale: 1, duration: 0.8 })
	cubesTimeline.clear()
	cubesTimeline.repeat(0)

	cubesTimeline.to(cubes.value, { y: '-50%', duration: 1 })
	cubesTimeline.to(cubesElements, { scale: 0.4, duration: 0.8 }, '<')
	cubesTimeline.to(cubesElements, { x: '-50%', left: '50%', duration: 0.8 }, '<')
	cubesTimeline.to(cubesElements[0], {
		x: -cubeWidth / 2 - 150,
		y: -100,
		duration: 1,
	})
	cubesTimeline.to(
		cubesElements[1],
		{
			x: -cubeWidth / 2 + 150,
			y: -100,
			duration: 1,
		},
		'<',
	)
	cubesTimeline.to(
		cubesElements[2],
		{
			x: -cubeWidth / 2 - 150,
			y: 100,
			duration: 1,
		},
		'<',
	)
	cubesTimeline.to(
		cubesElements[3],
		{
			x: -cubeWidth / 2 + 150,
			y: 100,
			duration: 1,
			onComplete: () => {
				cubesInSquarePattern()
				timeline.to(title.children, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.05 }, '-=0.5')
				timeline.to(
					subtitle.children,
					{ opacity: 1, duration: 0.4, stagger: 0.04 }, // start same time as title
					'<+=1',
				)
			},
		},
		'<',
	)
}

function cubesInSquarePattern() {
	const cubesElements = cubes.value.children
	cubesTimeline.kill()
	cubesTimeline.clear()

	// Infinite animation between scale 0.4 and 0.3
	cubesTimeline.to(cubesElements, { scale: 0.3, duration: 0.8, stagger: 0.2 }, '-=0.6')
	cubesTimeline.to(cubesElements, { scale: 0.4, duration: 0.8, stagger: 0.1 }, '-=0.6')

	cubesTimeline.repeat(-1)
}

const phasesTexts = computed(() => {
	return [
		{
			title: 'System initialization',
			subtitle: 'Waiting the copilot',
		},
		{
			title: 'WELCOME ABOARD',
			subtitle: 'DRIVER SEAT',
		},
		{
			title: 'PLEASE fasten your seat belt',
			subtitle: 'and accept conditions',
		},
		{
			title: 'press and hold THE SCREEN',
			subtitle: 'to start the vehicule.',
		},
		{
			title: 'MOVE THE PHONE TO DRIVE THE VEHICULE.',
		},
		{
			title: 'DRIVE SAFE',
		},
	]
})
</script>

<template>
	<div class="Screen1">
		<div class="phase0" ref="phase0">
			<button class="permissionBtn" @click="handlePermissionClick">Ask permissions</button>
		</div>
		<div class="phases" ref="phases">
			<div class="phase1">
				<p class="title">
					<span class="char" v-for="(char, index) in phasesTexts[0].title" :key="index">{{ char }}</span>
				</p>
				<p class="subtitle">
					<span class="char" v-for="(char, index) in phasesTexts[0].subtitle" :key="index">{{ char }}</span>
				</p>
			</div>
			<div class="phase2">
				<p class="title">
					<span class="char" v-for="(char, index) in phasesTexts[1].title" :key="index">{{ char }}</span>
				</p>
				<p class="subtitle">
					<span class="char" v-for="(char, index) in phasesTexts[1].subtitle" :key="index">{{ char }}</span>
				</p>
			</div>
			<div class="phase3">
				<p class="title">
					<span class="char" v-for="(char, index) in phasesTexts[2].title" :key="index">{{ char }}</span>
				</p>
				<p class="subtitle">
					<span class="char" v-for="(char, index) in phasesTexts[2].subtitle" :key="index">{{ char }}</span>
				</p>
				<svg width="45" height="30" viewBox="0 0 45 30" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 15H43M43 15L29.0163 1M43 15L29.0163 29" stroke="#D8B1FF" stroke-width="2.1" />
				</svg>
			</div>
			<div class="phase4">
				<p class="title">
					<span class="char" v-for="(char, index) in phasesTexts[3].title" :key="index">{{ char }}</span>
				</p>
				<p class="subtitle">
					<span class="char" v-for="(char, index) in phasesTexts[3].subtitle" :key="index">{{ char }}</span>
				</p>
			</div>
			<div class="phase5">
				<p class="title">
					<span class="char" v-for="(char, index) in phasesTexts[4].title" :key="index">{{ char }}</span>
				</p>
				<svg width="73" height="73" viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M49.2427 20.3016C46.8682 8.84109 42.0513 1 36.4953 1C28.5863 1 22.1748 16.8894 22.1748 36.49C22.1748 56.0906 28.5863 71.98 36.4953 71.98C41.796 71.98 46.424 64.843 48.9 54.235"
						stroke="#D8B1FF"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
					<path
						d="M20.0005 25.0535C8.70956 27.4502 1.01023 32.2301 1.01023 37.7356C1.01023 43.241 8.70956 48.0209 20.0005 50.4176M26.2268 24.0242C29.4789 23.628 32.9279 23.415 36.5002 23.415C56.1008 23.415 71.9902 29.8266 71.9902 37.7356C71.9902 45.6446 56.1008 52.0561 36.5002 52.0561C32.9279 52.0561 29.4789 51.8431 26.2268 51.4469"
						stroke="#D8B1FF"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
					<path
						d="M18.1572 47.0735L20.4395 50.3126L17.2003 52.5949"
						stroke="#D8B1FF"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M51.249 17.8103L49.2678 21.2418L45.8363 19.2606"
						stroke="#D8B1FF"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
			<div class="phase6">
				<p class="title">
					<span v-for="(char, index) in phasesTexts[5].title" :key="index">{{ char }}</span>
				</p>
			</div>
		</div>
		<div class="cubes" ref="cubes">
			<div class="cube" v-for="i in 4" :key="i"></div>
		</div>
	</div>
</template>

<style scoped>
.Screen1 {
	position: relative;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	.permissionBtn {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #d8b1ff;
		background-color: #1f1920;
		border: 1px solid #d8b1ff;
		border-radius: 10px;
		padding: 10px 20px;
		font-size: 16px;
		font-weight: 300;
		font-family: Outfit, sans-serif;
	}

	.phase1,
	.phase2,
	.phase3,
	.phase4,
	.phase5,
	.phase6 {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		opacity: 0;
		pointer-events: none;
		white-space: pre;
	}

	.cubes {
		position: absolute;
		top: 50%;
		left: 0;
		transform: translate(0, calc(-50% + 100px));
		width: 100%;
		height: 32px;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: none;
		gap: 16px;
		opacity: 0;
	}

	.cube {
		width: 20px;
		height: 20px;
		background-color: transparent;
		border: 6px solid var(--bc1, #d8b1ff);
		border-radius: 6px;
		position: absolute;
		top: 0;
		left: 0;
		//transform: translateX(-50%);
		transform-origin: center;
	}

	.char {
		display: inline-block;
		opacity: 0;
	}

	.title .char {
		transform: translateY(100%);
	}

	.title,
	.subtitle {
		color: #d8b1ff;
		text-align: center;
		font-family: Outfit, sans-serif;
		font-style: normal;
		line-height: normal;
	}

	.title {
		font-size: 40px;
		font-weight: 600;
		text-transform: uppercase;
		overflow: hidden;
	}

	.subtitle {
		font-size: 24px;
		font-weight: 300;
	}
}
</style>
