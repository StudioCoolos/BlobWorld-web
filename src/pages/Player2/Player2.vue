<script setup>
import useWebsocketStore from '@/stores/websocket.js'
import { onMounted } from 'vue'

const websocketStore = useWebsocketStore()

onMounted(() => {
	websocketStore.ws.addEventListener('open', () => {
		websocketStore.sendMessage({
			event: 'p2_connected'
		})
	})
})

</script>

<template>
Player2
</template>

<style scoped>

</style>