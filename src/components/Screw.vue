<script setup>
import { onUnmounted, ref } from 'vue'
import useWebsocketStore from '@/stores/websocket.js'

const emit = defineEmits(['handleFinish'])

const websocketStore = useWebsocketStore()
const isScrewing = ref(false)
const rotation = ref(0)
const prevAlpha = ref(null)
const rotationCount = ref(0)
const goalRotation = ref(3 * 360)

function handleDeviceOrientation(event) {
	const currentAlpha = event.alpha

	if (prevAlpha.value === null) {
		prevAlpha.value = currentAlpha
		return
	}

	let difference = currentAlpha - prevAlpha.value

	if (difference > 180) {
		difference -= 360
	} else if (difference < -180) {
		difference += 360
	}

	rotation.value += difference
	rotation.value = Math.round(rotation.value * 100) / 100
	rotation.value = Math.max(rotation.value, 0)

	rotationCount.value = Math.floor(rotation.value / 360)

	prevAlpha.value = currentAlpha

	if (rotationCount.value >= 3) {
		handleFinish()
	}
}

function handleFinish() {
	emit('handleFinish')
	websocketStore.sendMessage({
		event: 'screw',
	})
}

function handlePermissionClick() {
	if (isScrewing.value) {
		removeEventListener('deviceorientation', handleDeviceOrientation)
		rotation.value = 0
	} else {
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
		<img src="/images/screw-background.jpg" class="background" alt="" />
		<svg viewBox="0 0 36 36" class="circle-svg">
			<path
				class="circle"
				stroke-dasharray="60, 100"
				d="M18 2.0845
				a 15.9155 15.9155 0 0 1 0 31.831
				a 15.9155 15.9155 0 0 1 0 -31.831"
			/>
		</svg>
		<img src="/images/screw-cap.png" class="screw" alt="" />
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
	background: url('/images/screw-background.jpg') center center;
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
