<script setup>
import { ref } from 'vue'
import { clamp } from '@/utils/math.js'
import useWebsocketStore from '@/stores/websocket.js'

const websocketStore = useWebsocketStore()
const isDriving = ref(false)

function handleDeviceOrientation(event) {
	const steering = Math.round(clamp(event.beta / 30, -1, 1) * 100) / 100
	const throttle = Math.round(clamp(event.gamma / 30, -1, 1) * 100) / 100

	const driveData = {
		event: 'drive',
		steering,
		throttle,
	}

	websocketStore.sendMessage(driveData)
}

function handlePermissionClick() {
	if (isDriving.value) {
		removeEventListener('deviceorientation', handleDeviceOrientation)
	} else {
		addEventListener('deviceorientation', handleDeviceOrientation)
	}
	isDriving.value = !isDriving.value
}
</script>

<template>
	<button @click="handlePermissionClick">{{ isDriving ? 'Disable ' : 'Enable' }} driving</button>
</template>

<style scoped></style>
