<script setup>
import { onUnmounted, ref } from 'vue'
import { clamp } from '@/utils/math.js'
import useWebsocketStore from '@/stores/websocket.js'
import useDeviceStore from '@/stores/device.js'

const websocketStore = useWebsocketStore()
const deviceStore = useDeviceStore()
deviceStore.setOrientationMode('landscape')
const isDriving = ref(false)
const steering = ref(0)
const throttle = ref(0)

function handleDeviceOrientation(event) {
	steering.value = Math.round(clamp(event.beta / 30, -1, 1) * 100) / 100
	throttle.value = Math.round(clamp(event.gamma / 30 + 1, -1, 1) * 100) / 100

	const driveData = {
		event: 'drive',
		steering: steering.value,
		throttle: throttle.value,
	}

	websocketStore.sendMessage(driveData)
}

function handlePermissionClick() {
	if (isDriving.value) {
		removeEventListener('deviceorientation', handleDeviceOrientation)
		steering.value = 0
		throttle.value = 0
	} else {
		addEventListener('deviceorientation', handleDeviceOrientation)
	}
	isDriving.value = !isDriving.value
}

onUnmounted(() => {
	if (isDriving.value) {
		removeEventListener('deviceorientation', handleDeviceOrientation)
		steering.value = 0
		throttle.value = 0
		isDriving.value = false
	}
})
</script>

<template>
	<button @click="handlePermissionClick">{{ isDriving ? 'Disable ' : 'Enable' }} driving</button>
	<div class="bubble-container">
		<div class="bubble" />
	</div>
</template>

<style scoped>
.bubble-container {
	position: absolute;
	inset: 0;
	display: flex;
	pointer-events: none;
	z-index: -1;
}
.bubble {
	margin: auto;
	width: 250px;
	height: 250px;
	background-color: #333;
	border-radius: 50%;

	transform: translate(calc(v-bind(steering) * 50vh), calc(v-bind(throttle) * -50vw))
		scaleX(calc(v-bind(throttle) * v-bind(throttle) * (2 - 1) + 1))
		scaleY(calc(v-bind(steering) * v-bind(steering) * (2 - 1) + 1));
}
</style>
