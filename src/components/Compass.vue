<script setup>
import { onMounted, ref } from 'vue'
import useWebsocketStore from '@/stores/websocket.js'
import { lerp, clamp, lerpAngle } from '@/utils/math.js'

const websocketStore = useWebsocketStore()
const vehicleAngle = ref(0)
let targetVehicleAngle = 0
const goalAngleX = ref(0)
let targetGoalAngleX = 0
const goalAngleY = ref(0)
let targetGoalAngleY = 0
const goalDistance = ref(0)
let targetGoalDistance = 0
let lastGoalDistance = 0
const resetGoal = ref(false)
const hiddenGoal = ref(false)

websocketStore.ws.addEventListener('message', (event) => {
	const data = JSON.parse(event.data)

	if (data.event === 'compass') {
		targetVehicleAngle = data.vehicleAngle.replace(',', '.')

		const goalAngle = data.goalAngle.replace(',', '.')
		const radialGoalAngle = (goalAngle * Math.PI) / 180 - Math.PI / 2
		targetGoalAngleX = Math.cos(radialGoalAngle)
		targetGoalAngleY = Math.sin(radialGoalAngle)
		targetGoalDistance = clamp((data.goalDistance.replace(',', '.') / 20_000) * 145, 0, 145)
	}
})

function tick() {
	requestAnimationFrame(tick)
	hiddenGoal.value = goalDistance.value < 1
	if (Math.abs(targetGoalDistance - lastGoalDistance) > 20) {
		resetGoal.value = true
		setTimeout(() => {
			resetGoal.value = false
			goalDistance.value = targetGoalDistance
			goalAngleX.value = targetGoalAngleX
			goalAngleY.value = targetGoalAngleY
		}, 3000)
	}

	lastGoalDistance = targetGoalDistance
	vehicleAngle.value = lerpAngle(vehicleAngle.value, targetVehicleAngle, 0.01)
	if (resetGoal.value) return
	goalAngleX.value = lerp(goalAngleX.value, targetGoalAngleX, 0.01)
	goalAngleY.value = lerp(goalAngleY.value, targetGoalAngleY, 0.01)
	goalDistance.value = lerp(goalDistance.value, targetGoalDistance, 0.01)
}

onMounted(() => {
	requestAnimationFrame(tick)
})
</script>

<template>
	<div class="compass">
		<img src="/images/compass.svg" alt="compass" />
		<div class="goal" :class="{ hidden: resetGoal || hiddenGoal }" />
	</div>
</template>

<style scoped lang="scss">
.compass {
	position: relative;
	width: 100%;
	height: 100%;
	max-width: 300px;
	max-height: 300px;
}

img {
	width: 100%;
	rotate: v-bind('-vehicleAngle + "deg"');
}

.goal {
	position: absolute;
	width: 24px;
	height: 24px;
	background-color: #b10000;
	filter: blur(4px);
	border-radius: 50%;
	top: 50%;
	left: 50%;
	transition: opacity 1s;
	transform: translateX(v-bind('goalAngleX * goalDistance + "px"'))
		translateY(v-bind('goalAngleY * goalDistance + "px"'));
	animation: pulse 4s infinite linear;

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
	}
}

.hidden {
	opacity: 0;
}
</style>
