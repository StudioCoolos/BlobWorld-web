<script setup>
import Drive from '@/components/Drive.vue'
import Button from '@/components/Button.vue'
import { useDrivingStore } from '@/stores/driving.js'
import Strike from '@/components/Strike.vue'
import OrientationBlocker from '@/components/OrientationBlocker.vue'
import CarCockpit from '@/components/CarCockpit.vue'

const drivingStore = useDrivingStore()
</script>

<template>
	<OrientationBlocker />
	<Strike />
	<Drive />
	<CarCockpit />
	<div class="inputs" :class="{ active: drivingStore.isDriving }">
		<Button class="button" type="medium" />
		<Button class="button" type="medium" />
	</div>
</template>

<style scoped lang="scss">
@use '@/assets/functions' as *;
.inputs {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: auto;
	margin-bottom: vw(66px);
	width: 100%;
	padding: 0 vw(90px);
	box-sizing: border-box;
	pointer-events: none;
	transition: opacity 0.4s ease-in-out;
}

.button {
	position: relative;
	top: 0;
	left: 0;

	&::before,
	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		transition:
			border 0.3s ease-in-out,
			opacity 0.3s ease-in-out;
	}

	&::before {
		border: 1px solid #7b5dd4;
		opacity: 0.54;
	}

	&::after {
		border: 1px solid #7b5dd4;
		filter: blur(vw(4px));
		opacity: 0;
	}
}

.inputs.active .button::after,
.inputs.active .button::before {
	border: 2px solid #7b5dd4;
	opacity: 0.54;
}
</style>
