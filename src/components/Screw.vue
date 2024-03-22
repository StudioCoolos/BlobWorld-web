<script setup>
import { onUnmounted, ref } from 'vue'
import { clamp } from '@/utils/math.js'
import useWebsocketStore from '@/stores/websocket.js'

const websocketStore = useWebsocketStore()
const isScrewing = ref(false)
const rotation = ref(0)
const initialCumulativeRotation = ref(0)
const prevAlpha = ref(null)
const rotationCount = ref(0)
const goalRotation = ref(3 * 360)

function handleDeviceOrientation(event) {
	const currentAlpha = event.alpha // Current alpha value from the event

	// Initialize prevAlpha with the first alpha value received
	if (prevAlpha.value === null) {
		prevAlpha.value = currentAlpha
		return // Skip the first event to establish a starting point
	}

	let difference = currentAlpha - prevAlpha.value

	// Adjust for alpha value continuity
	if (difference > 180) {
		difference -= 360
	} else if (difference < -180) {
		difference += 360
	}

	// Update cumulative rotation based on difference
	rotation.value += difference
	rotation.value = Math.round(rotation.value * 100) / 100
	rotation.value = Math.max(rotation.value, 0)
	console.log(rotation.value)

	// Calculate total rotations (positive for clockwise, negative for counter-clockwise)
	rotationCount.value = Math.floor(rotation.value / 360)

	// Update previous alpha for next calculation
	prevAlpha.value = currentAlpha

	const screwData = {
		event: 'screw',
		rotation: rotation.value,
	}

	websocketStore.sendMessage(screwData)
}

function handlePermissionClick() {
	if (isScrewing.value) {
		removeEventListener('deviceorientation', handleDeviceOrientation)
		rotation.value = 0
	} else {
		console.log('Adding event listener')
		addEventListener('deviceorientation', handleDeviceOrientation)
	}
	isScrewing.value = !isScrewing.value
}

onUnmounted(() => {
	if (isScrewing.value) {
		removeEventListener('deviceorientation', handleDeviceOrientation)
	}
})
</script>

<template>
	<button @click="handlePermissionClick">{{ isScrewing ? 'Disable ' : 'Enable' }} screwing</button>
	<div class="screw-container">
		<img src="/images/screw-background.jpg" class="background" />
		<svg viewBox="0 0 36 36" class="circle-svg">
			<path
				class="circle"
				stroke-dasharray="60, 100"
				d="M18 2.0845
				a 15.9155 15.9155 0 0 1 0 31.831
				a 15.9155 15.9155 0 0 1 0 -31.831"
			/>
		</svg>
		<img src="/images/screw-cap.png" class="screw" />
	</div>
</template>

<style scoped>
.circle-svg {
	width: 300px;
	height: 300px;
	position: absolute;
	inset: 0;
	margin: auto;
	transform: rotate(-90deg);
}

.circle {
	stroke: #4cc790;
	fill: none;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-dasharray: calc((v-bind(rotation) / v-bind(goalRotation)) * 100), 100;
}

button {
	height: 50px;
}
.screw-container {
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: -1;
	display: flex;
	justify-content: center;
	align-items: center;
}
.background {
	pointer-events: none;
	height: 220%;
	z-index: -1;
	transform-origin: 50% 50%;
	transform: rotate(calc(v-bind(rotation) * 1deg));
}
.screw {
	position: absolute;
	inset: 0;
	margin: auto;
	width: 250px;
	/* height: 250px; */
}
</style>
