<script setup>
import debounce from '@/utils/debounce.js'
import { deviceMotionPermission } from '@/utils/permissions.js'
import { useWebsocketStore } from '@/stores/websocket.js'

const websocketStore = useWebsocketStore()

const debounceStrike = debounce(() =>
	websocketStore.sendMessage({
		event: 'strike',
	}),
)
function handlePermissionClick() {
	deviceMotionPermission((event) => {
		const acceleration = Math.sqrt(event.acceleration.x ** 2 + event.acceleration.y ** 2 + event.acceleration.z ** 2)
		if (acceleration > 20) {
			debounceStrike()
		}
	}).then((result) => console.log(result))
}
</script>

<template>
	<button @click="handlePermissionClick">Enable strike</button>
</template>

<style scoped></style>
