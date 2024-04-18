<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { clamp, lerp } from '@/utils/math.js'
import useWebsocketStore from '@/stores/websocket.js'
import useDeviceStore from '@/stores/device.js'
import debounce from '@/utils/debounce.js'
import Gimbal from '@/utils/Gimbal.js'

const websocketStore = useWebsocketStore()
const deviceStore = useDeviceStore()
deviceStore.setOrientationMode('landscape')
const isDriving = ref(false)
const steering = ref(0)
const throttle = ref(0)
let targetSteering = 0
let targetThrottle = 0
let previousTime = performance.now()

function sendDriveData() {
	const driveData = {
		event: 'drive',
		steering: targetSteering,
		throttle: targetThrottle,
	}
	websocketStore.sendMessage(driveData)
}

const debounceMessage = debounce(sendDriveData, 200)

// function handleDeviceOrientation(event) {
// 	let beta = Gimbal.yaw
// 	let gamma = Gimbal.pitch
// 	// if (event.beta > 90) {
// 	// 	return
// 	// }
// 	// if (event.beta < -90) {
// 	// 	return
// 	// }
//
// 	targetSteering = Math.round(clamp(beta / 30, -1, 1) * 100) / 100
// 	targetThrottle = Math.round(clamp(gamma / 30 + 1, -1, 1) * 100) / 100
//
// 	debounceMessage()
// }

onMounted(() => {
	previousTime = performance.now()
	requestAnimationFrame(tick)
})

onUnmounted(() => {
	Gimbal.disable()
	// removeEventListener('deviceorientation', handleDeviceOrientation)
	targetSteering = 0
	targetThrottle = 0
	sendDriveData()
	isDriving.value = false
})

function handleStartEngine(event) {
	if (event.touches.length < 2 || isDriving.value) return
	Gimbal.enable()
	// addEventListener('deviceorientation', handleDeviceOrientation)
	isDriving.value = true
}

function handleStopEngine(event) {
	if (event.touches.length >= 2 || !isDriving.value) return
	Gimbal.disable()
	// removeEventListener('deviceorientation', handleDeviceOrientation)
	targetSteering = 0
	targetThrottle = 0
	sendDriveData()
	isDriving.value = false
}

function tick() {
	const currentTime = performance.now()
	const deltaTime = currentTime - previousTime
	previousTime = currentTime
	if (Gimbal.isEnable) {
		Gimbal.update()
		const { yaw, roll, pitch } = Gimbal
		if (yaw && roll && pitch) {
			const convertedPitch = (-pitch * 180) / Math.PI
			const convertedRoll = (-yaw * 180) / Math.PI
			targetSteering = Math.round(clamp(convertedPitch / 30, -1, 1) * 100) / 100
			targetThrottle = Math.round(clamp(convertedRoll / 30, -1, 1) * 100) / 100
			debounceMessage()
		}
	}

	steering.value = lerp(steering.value, targetSteering, deltaTime / 100)
	throttle.value = lerp(throttle.value, targetThrottle, deltaTime / 100)
	requestAnimationFrame(tick)
}
</script>

<template>
	<div class="bubble-container" @touchstart.prevent="handleStartEngine" @touchend.prevent="handleStopEngine">
		<div class="bubble" :class="{ active: isDriving }" />
	</div>
</template>

<style scoped>
.bubble-container {
	position: absolute;
	inset: 0;
	display: flex;
	z-index: -1;
}
.bubble {
	margin: auto;
	width: 250px;
	height: 250px;
	background-color: #333;
	border-radius: 50%;
	transition: background-color 0.2s;

	transform: translate(calc(v-bind(steering) * 50vh), calc(v-bind(throttle) * -50vw))
		scaleX(calc(v-bind(throttle) * v-bind(throttle) * (2 - 1) + 1))
		scaleY(calc(v-bind(steering) * v-bind(steering) * (2 - 1) + 1));

	&.active {
		background-color: #666;
	}
}
</style>
