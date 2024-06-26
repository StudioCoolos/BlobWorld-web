<script setup>
import Kapout from '@/components/icons/Kapout.vue'

import { useDrivingStore } from '@/stores/driving.js'

const drivingStore = useDrivingStore()
</script>

<template>
	<div class="BrandedPanel">
		<Kapout ref="brand" :class="{ active: drivingStore.isDriving, brand: true }" />
		<svg class="panel" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 517 51">
			<path fill="#000" d="M0 51h517c-29 0-56-10-78-26-18-13-39-25-61-25H139c-22 0-43 12-61 25C56 41 29 51 0 51Z" />
		</svg>
	</div>
</template>

<style scoped lang="scss">
@use '@/assets/functions' as *;
@use '@/assets/mixins' as *;

.BrandedPanel {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: fit-content;
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin-top: auto;
	z-index: 10;

	.brand {
		@include absolute-centering;
		width: vw(44px);
		height: vw(28px);
		opacity: 0.3;
		transition: opacity 0.3s ease-in-out;

		&.active {
			opacity: 1;
		}
	}

	.panel {
		width: vw(517px);
		height: vw(51px);
	}
}
</style>
