<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useDrivingStore } from '@/stores/driving.js'
import { lerp } from '@/utils/lerp.js'

const driveStore = useDrivingStore()

const maxSpeed = 43
const speed = ref(0)
const radius = 62
const circumference = 2 * Math.PI * radius
let animationFrame

const updateSpeed = () => {
	const targetSpeed = Math.abs(driveStore.throttle) * maxSpeed
	speed.value = lerp(speed.value, targetSpeed, 0.1)
	animationFrame = requestAnimationFrame(updateSpeed)
}

watch(
	() => driveStore.throttle,
	() => {
		if (!animationFrame) {
			updateSpeed()
		}
	},
)

onMounted(() => {
	updateSpeed()
})

onUnmounted(() => {
	cancelAnimationFrame(animationFrame)
})
</script>

<template>
	<div class="Infos">
		<div class="infos">
			<p class="speed">{{ speed.toFixed(0) }}</p>
			<p class="km">km</p>
		</div>
		<svg class="circle" xmlns="http://www.w3.org/2000/svg" width="130" height="129" viewBox="0 0 130 129" fill="none">
			<circle
				:stroke-dasharray="circumference"
				:stroke-dashoffset="circumference - circumference * (speed / maxSpeed)"
				cx="64.8154"
				cy="64.5"
				r="62"
				stroke="url(#paint0_radial)"
				stroke-width="5"
			/>
			<defs>
				<radialGradient
					id="paint0_radial"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(0.000487676 64) rotate(45) scale(91.9239)"
				>
					<stop stop-color="#04C100" />
					<stop offset="1" stop-color="#0572C1" stop-opacity="0" />
				</radialGradient>
			</defs>
		</svg>
	</div>
</template>

<style scoped>
.Infos {
	display: flex;
	flex-direction: column;
	width: 130px;
	height: 130px;
	border: 1px solid rgba(0, 0, 0, 0.4);
	border-radius: 50%;
	opacity: 1;
	position: absolute;
	bottom: 16px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 1;
	text-align: center;
	font-family: 'League Gothic', sans-serif;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	text-transform: uppercase;

	.infos {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}
	.speed {
		color: #000;
		font-size: 78px;
	}

	.km {
		transform: translateY(-30%);
		opacity: 0.4;
		font-size: 22px;
	}

	.circle {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 2;
		transform: translateX(-1px);
	}
}
</style>
