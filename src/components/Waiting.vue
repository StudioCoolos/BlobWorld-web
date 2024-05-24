<script setup>
import Screen1 from '@/templates/Waiting/Screen1.vue'
</script>

<template>
	<div class="Waiting">
		<Screen1 />
	</div>
</template>

<style scoped>
.Waiting {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: var(--bg_pilot, radial-gradient(100% 100% at 0% 50%, #1f1920 15.58%, #2c192f 100%));
	width: 100%;
	height: 100%;
	.title {
	}
}
</style>
