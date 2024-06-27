<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import useWebsocketStore from '@/stores/websocket.js'
import useDeviceStore from '@/stores/device.js'

const emit = defineEmits(['handleFinish'])

const websocketStore = useWebsocketStore()
const deviceStore = useDeviceStore()

deviceStore.setOrientationMode('landscape')

const rotation = ref(0)
const prevAlpha = ref(null)
const rotationCount = ref(0)
const goalRotation = ref(1)
const screwContainer = ref()
const screw = ref()
const isFinished = ref(false)

function handleDeviceOrientation(event) {
	if (isFinished.value) {
		return
	}
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

	if (rotationCount.value >= goalRotation.value) {
		handleFinish()
	}
}

function handleFinish() {
	isFinished.value = true
	animate().then(() => {
		emit('handleFinish')
		websocketStore.sendMessage({
			event: 'screw',
		})
	})
}

async function animate() {
	await gsap
		.timeline()
		.to(screw.value, {
			duration: 1,
			rotation: 900,
			ease: 'power3.inOut',
		})
		.to(
			screw.value,
			{
				duration: 1,
				opacity: 0,
				ease: 'power3.inOut',
			},
			'-=0.6',
		)
		.to(
			screwContainer.value,
			{
				duration: 1,
				opacity: 0,
				ease: 'power3',
			},
			'-=0.6',
		)
}

onMounted(() => {
	addEventListener('deviceorientation', handleDeviceOrientation)
})

onUnmounted(() => {
	removeEventListener('deviceorientation', handleDeviceOrientation)
})
</script>

<template>
	<div ref="screwContainer" class="screw-container">
		<svg ref="screw" class="screw" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 172 172">
			<circle cx="85.6" cy="85.6" r="85.6" fill="#A2A2A2" />
			<path stroke="#848484" stroke-linecap="round" stroke-width="15" d="M140 86H29m56-56v112" />
		</svg>
	</div>
</template>

<style scoped lang="scss">
@use '@/assets/functions' as *;
@use '@/assets/variables' as *;

button {
	height: 50px;
}

.screw-container {
	position: absolute;
	overflow: hidden;
	width: calc(50% + vw(123px));
	box-sizing: border-box;
	margin: vw(74px) 0 vw(74px) auto;
	padding: vw(37px);
	border-radius: vw(122px) 0 0 vw(122px);
	inset: 0;
	pointer-events: none;
	z-index: 1;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	background-color: $white;
}

.screw {
	width: vw(171px);
	height: vw(171px);
	transform: rotate(calc(v-bind(rotation) * 1deg));
	/* height: 250px; */
}
</style>
