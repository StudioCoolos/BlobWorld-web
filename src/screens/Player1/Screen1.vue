<script setup>
import { useActiveScreensStore } from '@/stores/activeScreens.js'
import useWebsocketStore from '@/stores/websocket.js'

const store = useActiveScreensStore()
const websocketStore = useWebsocketStore()

websocketStore.ws.addEventListener('message', (event) => {
	const data = JSON.parse(event.data)

	if (data.event === 'p2_connected') {
		store.setActiveScreen(2)
	}
})
</script>

<template>
	<div class="Screen1">
		<p class="title" data-text="Bienvenue à bord">Bienvenue à bord</p>
		<p class="subtitle" data-text="En attente du co-pilote...">En attente du co-pilote...</p>
	</div>
</template>

<style scoped lang="scss">
@use '@/assets/functions' as *;
@use '@/assets/mixins' as *;
@use '@/assets/variables' as *;

.Screen1 {
	display: flex;
	flex-direction: column;
	text-transform: uppercase;
	color: $purple;
	text-align: center;
	@include base-text;

	.title {
		position: relative;
		top: 0;
		left: 0;
		font-size: vw(24px);
		font-weight: 700;
		z-index: 1;

		&::after {
			@include clone-data-text;
			filter: blur(vw(4px));
		}
	}

	.subtitle {
		position: relative;
		top: 0;
		left: 0;
		font-size: vw(16px);
		opacity: 0.45;
		font-weight: 500;
		text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
		z-index: 1;
		animation: blink-lowop 2s infinite ease-in-out;

		&::after {
			@include clone-data-text;
			filter: blur(vw(4px));
		}
	}

	@include blink-lowop-animation;
}
</style>
