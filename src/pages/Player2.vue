<script setup>
import useWebsocketStore from '@/stores/websocket.js'
import { onMounted } from 'vue'
import Cables from '@/components/Cables.vue'

const websocketStore = useWebsocketStore()

onMounted(() => {
	websocketStore.ws.addEventListener('open', () => {
		websocketStore.sendMessage({
			event: 'p2_connected',
		})
	})
})
</script>

<template>
	<Cables unknown-side="left" />
</template>

<style scoped></style>
