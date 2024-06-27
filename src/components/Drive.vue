<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { clamp, lerp } from '@/utils/math.js'
import useWebsocketStore from '@/stores/websocket.js'
import useDeviceStore from '@/stores/device.js'
import debounce from '@/utils/debounce.js'
import { useDrivingStore } from '@/stores/driving.js'

const websocketStore = useWebsocketStore()
const deviceStore = useDeviceStore()
const drivingStore = useDrivingStore()
deviceStore.setOrientationMode('landscape')
const steering = ref(0)
const throttle = ref(0)
let previousTime = performance.now()

function sendDriveData() {
	const driveData = {
		event: 'drive',
		steering: drivingStore.steering,
		throttle: drivingStore.throttle,
	}
	websocketStore.sendMessage(driveData)
}

const debounceMessage = debounce(sendDriveData, 200)

function handleDeviceOrientation(event) {
	drivingStore.setSteering(Math.round(clamp(event.beta / 30, -1, 1) * 100) / 100)
	drivingStore.setThrottle(Math.round(clamp(event.gamma / 30 + 1, -1, 1) * 100) / 100)

	debounceMessage()
}

onMounted(() => {
	previousTime = performance.now()
	requestAnimationFrame(tick)
})

onUnmounted(() => {
	removeEventListener('deviceorientation', handleDeviceOrientation)
	drivingStore.setSteering(0)
	drivingStore.setThrottle(0)
	sendDriveData()
	drivingStore.setIsDriving(false)
})

function handleStartEngine(event) {
	if (event.touches.length < 2 || drivingStore.isDriving) return
	addEventListener('deviceorientation', handleDeviceOrientation)
	drivingStore.setIsDriving(true)
}

function handleStopEngine(event) {
	if (event.touches.length >= 2 || !drivingStore.isDriving) return
	removeEventListener('deviceorientation', handleDeviceOrientation)
	drivingStore.setSteering(0)
	drivingStore.setThrottle(0)
	sendDriveData()
	drivingStore.setIsDriving(false)
}

function tick() {
	const currentTime = performance.now()
	const deltaTime = currentTime - previousTime
	previousTime = currentTime

	steering.value = lerp(steering.value, drivingStore.steering, deltaTime / 100)
	throttle.value = lerp(throttle.value, drivingStore.throttle, deltaTime / 100)
	requestAnimationFrame(tick)
}
</script>

<template>
	<div class="bubble-container" @touchstart.prevent="handleStartEngine" @touchend.prevent="handleStopEngine">
		<svg class="controller" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 168 114">
			<path stroke="#7B5DD4" stroke-width="1.4" d="M83.7 0v114m83.8-57H0" opacity=".2" />
			<defs>
				<filter
					id="a"
					width="111.2"
					height="111.2"
					x="27.9"
					y="1.9"
					color-interpolation-filters="sRGB"
					filterUnits="userSpaceOnUse"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
					<feGaussianBlur result="effect1_foregroundBlur_3243_37" stdDeviation="11.6" />
				</filter>
			</defs>
		</svg>
		<div class="bubble" :class="{ active: drivingStore.isDriving }" />
	</div>
</template>

<style scoped lang="scss">
@use '@/assets/functions' as *;
@use '@/assets/variables' as *;

.bubble-container {
	position: absolute;
	inset: 0;
	display: flex;
	z-index: 1;
	top: 0;
}
.bubble {
	position: relative;
	top: vw(116px);
	left: 0;
	overflow: visible;
	margin: 0 auto auto;
	width: vw(65px);
	height: vw(65px);
	transition: background-color 0.2s ease-in-out;
	will-change: transform;

	transform: translate(calc(v-bind(steering) * vw(250px)), calc(v-bind(throttle) * vw(-116px)))
		scaleX(calc((v-bind(throttle)) * (v-bind(throttle)) * (2 - 1) + 1))
		scaleY(calc((v-bind(steering)) * (v-bind(steering)) * (2 - 1) + 1));

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 50%;
		background-color: #503f84;
		width: 100%;
		height: 100%;

		z-index: 1;
	}

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 50%;
		background-color: #261e3f;
		filter: blur(vw(11.55px));
		width: 100%;
		height: 100%;
		will-change: filter;
		transition:
			background-color 0.2s ease-in-out,
			filter 0.4s $quart-bezier-de-bz;
		z-index: 2;
	}

	&.active {
		&::before {
			background-color: #503f84;
		}

		&::after {
			background-color: #7b5dd4;
		}
	}
}

.controller {
	position: absolute;
	top: vw(92px);
	left: 50%;
	transform: translateX(-50%);
	width: vw(168px);
	height: vw(114px);
	z-index: 1;
}
</style>
