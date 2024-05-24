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
		throttle: drivingStore.steering,
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
		<div class="bubble" :class="{ active: drivingStore.isDriving }" />
	</div>
</template>

<style scoped>
.bubble-container {
	position: absolute;
	inset: 0;
	display: flex;
	z-index: 2;
	top: -50px;
}
.bubble {
	margin: auto;
	width: 100px;
	height: 100px;
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
