<script setup>
import debounce from '@/utils/debounce.js'
import useWebsocketStore from '@/stores/websocket.js'
import { ref } from 'vue'

const websocketStore = useWebsocketStore()
const isStriking = ref(false)

const debounceStrike = debounce(() =>
	websocketStore.sendMessage({
		event: 'strike',
	}),
)

function handleDeviceMotion(event) {
	const acceleration = Math.sqrt(event.acceleration.x ** 2 + event.acceleration.y ** 2 + event.acceleration.z ** 2)
	if (acceleration > 20) {
		debounceStrike()
	}
}
function handlePermissionClick() {
	if (isStriking.value) {
		removeEventListener('devicemotion', handleDeviceMotion)
	} else {
		addEventListener('devicemotion', handleDeviceMotion)
	}
	isStriking.value = !isStriking.value
}
</script>

<template>
	<button @click="handlePermissionClick">{{ isStriking ? 'Disable ' : 'Enable' }} striking</button>
</template>

<style scoped></style>
