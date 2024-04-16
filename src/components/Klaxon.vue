<script setup>
import { ref } from 'vue'

import useWebsocketStore from '@/stores/websocket.js'

const websocketStore = useWebsocketStore()
const isWebsocketConnected = ref(false)

websocketStore.ws.addEventListener('open', () => {
	isWebsocketConnected.value = true
})

function onClick() {
	if (!isWebsocketConnected.value) {
		return
	}

	websocketStore.sendMessage({
		event: 'klaxon',
	})
}
</script>

<template>
	<button @click="onClick">Klaxon</button>
</template>

<style scoped>
button {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, calc(-50% + 150px));
}
</style>
