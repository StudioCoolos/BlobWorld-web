<script setup>
import useDeviceStore from '@/stores/device.js'

const deviceStore = useDeviceStore()
</script>

<template>
	<div class="orientation-blocker" :class="{ [deviceStore.orientationMode]: true }">
		<div class="content">
			<img src="/images/rotate-phone.svg" alt="rotate phone" />
			<p>Please rotate</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.orientation-blocker {
	display: none;
	position: fixed;
	inset: 0;
	z-index: 10000;
	background-color: #333;

	&.landscape {
		@media screen and (orientation: landscape) {
			display: flex;
		}
	}

	&.portrait {
		@media screen and (orientation: portrait) {
			display: flex;
		}
	}

	.content {
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		color: white;
	}
}
</style>
