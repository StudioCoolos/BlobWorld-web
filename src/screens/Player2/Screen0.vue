<script setup>
import { useActiveScreensStore } from '@/stores/activeScreens.js'

const store = useActiveScreensStore()
</script>

<template>
	<div class="Screen1">
		<p class="title">BIENVENUE À BORD, CONDUCTEUR</p>
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
}
</style>
