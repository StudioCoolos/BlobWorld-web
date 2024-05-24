<script setup>
import { useActiveScreensStore } from '@/stores/activeScreens.js'
import useWebsocketStore from '@/stores/websocket.js'

const store = useActiveScreensStore()
const websocketStore = useWebsocketStore()

websocketStore.ws.addEventListener('message', (event) => {
	const data = JSON.parse(event.data)

	if (data.event === 'p2_connected') {
		store.setActiveScreen(2)

		setTimeout(() => {
			store.setActiveScreen(3)
		}, 3000)
	}
})
</script>

<template>
	<div class="Screen1">
		<p class="title">Bienvenue à bord</p>
		<p class="subtitle">En attente du co-pilote...</p>
	</div>
</template>

<style scoped>
.Screen1 {
	display: flex;
	flex-direction: column;
	text-transform: uppercase;
	color: #000;
	text-align: center;
	font-family: 'League Gothic', sans-serif;

	font-style: normal;
	font-weight: 400;
	line-height: normal;

	.title {
		font-size: 40px;
	}

	.subtitle {
		font-size: 24px;
		opacity: 0.45;
	}
}
</style>
