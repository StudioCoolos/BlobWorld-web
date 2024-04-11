<script setup>
import useDeviceStore from '@/stores/device.js'

const deviceStore = useDeviceStore()
</script>

<template>
	<div class="warning" v-if="deviceStore.isWarning">
		<h1>WARNING</h1>
		<p>Do not attempt to repair the device yourself. Please contact the manufacturer for assistance.</p>
		<img src="/images/warning.png" alt="Warning" />
	</div>
</template>

<style scoped>
.warning {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	background: rgba(255, 255, 0, 0.25);
	padding: 2rem;
	gap: 1rem;
	z-index: 1000;

	h1 {
		font-size: 2rem;
	}

	img {
		width: 100px;
		height: 100px;
		animation: pulse 0.5s infinite alternate linear;
	}
}

@keyframes pulse {
	from {
		transform: scale(1);
	}
	to {
		transform: scale(1.2);
	}
}
</style>
