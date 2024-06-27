<script setup>
import { useActiveScreensStore } from '@/stores/activeScreens.js'

const store = useActiveScreensStore()
function handleClick() {
	store.setActiveScreen(1)
	setTimeout(() => {
		store.setActiveScreen(2)
	}, 3000)
}
</script>

<template>
	<div class="Screen1" @click="handleClick">
		<p class="title" data-text="Bienvenue à bord">Bienvenue à bord</p>
		<p class="subtitle" data-text="En attente du pilote">En attente du pilote</p>
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
		font-size: 24px;
		font-weight: 700;
		z-index: 1;

		&::after {
			@include clone-data-text;
			filter: blur(4px);
		}
	}

	.subtitle {
		position: relative;
		top: 0;
		left: 0;
		font-size: 16px;
		opacity: 0.45;
		font-weight: 500;
		text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
		z-index: 1;
		animation: blink 2s infinite ease-in-out;

		&::after {
			@include clone-data-text;
			filter: blur(4px);
		}
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 0.45;
		}

		50% {
			opacity: 0.2;
		}
	}
}
</style>
