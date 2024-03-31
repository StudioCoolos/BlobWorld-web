<script setup>
import { ref } from 'vue'

const colors = ['red', 'blue', 'green', 'yellow']

const cablesState = ref(
	new Map(
		colors.map((color) => [
			color,
			{
				transform: '',
				endCableRef: null,
			},
		]),
	),
)

const shuffledColors = [...colors].sort(() => Math.random() - 0.5)

function handleTouchStart(index, event) {
	const cableState = cablesState.value.get(colors[index])
	cableState.startCableRect = event.currentTarget.getBoundingClientRect()
	cableState.endCableRect = cableState.endCableRef.getBoundingClientRect()
}

function handleTouchMove(index, event) {
	const cableState = cablesState.value.get(colors[index])
	const distance = Math.sqrt(
		(event.touches[0].clientX - cableState.startCableRect.right) ** 2 +
			(event.touches[0].clientY - cableState.startCableRect.top) ** 2,
	)
	const angle = Math.atan2(
		event.touches[0].clientY - cableState.startCableRect.top,
		event.touches[0].clientX - cableState.startCableRect.right,
	)
	cableState.transform = `rotate(${angle}rad) scaleX(${distance})`
}

function handleTouchEnd(index, event) {
	//check if the cable is in the end cable
	const cableState = cablesState.value.get(colors[index])
	if (
		event.changedTouches[0].clientX > cableState.endCableRect.left &&
		event.changedTouches[0].clientX < cableState.endCableRect.right &&
		event.changedTouches[0].clientY > cableState.endCableRect.top &&
		event.changedTouches[0].clientY < cableState.endCableRect.bottom
	) {
		const distance = Math.sqrt(
			(cableState.startCableRect.right - cableState.endCableRect.left) ** 2 +
				(cableState.startCableRect.top - cableState.endCableRect.top) ** 2,
		)
		const angle = Math.atan2(
			cableState.endCableRect.top - cableState.startCableRect.top,
			cableState.endCableRect.left - cableState.startCableRect.right,
		)

		cableState.transform = `rotate(${angle}rad) scaleX(${distance})`
		return
	}
	cableState.transform = ''
}
</script>

<template>
	<div class="cables-container">
		<div
			class="cable-wrapper"
			v-for="(state, index) in cablesState"
			:key="index"
			@touchstart="(event) => handleTouchStart(index, event)"
			@touchmove="(event) => handleTouchMove(index, event)"
			@touchend="(event) => handleTouchEnd(index, event)"
		>
			<div class="cable" :style="{ background: state[0] }" />
			<div class="joint" :style="{ background: state[0] }" />
			<div class="cable caught-cable" :style="{ background: state[0], transform: state[1].transform }" />
		</div>
		<div class="end-cable-wrapper" v-for="(color, index) in shuffledColors" :key="index">
			<div
				class="cable"
				:style="{ background: color }"
				:ref="
					(element) =>
						cablesState.get(color).endCableRef === null ? (cablesState.get(color).endCableRef = element) : null
				"
			/>
			<div class="joint" :style="{ background: color }" />
		</div>
	</div>
</template>

<style scoped>
.cables-container {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	height: 100%;
	grid-auto-flow: dense;
	align-items: center;
}

.joint {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	position: absolute;
	top: 0;
}
.end-cable-wrapper {
	grid-column: 2;
	justify-self: right;
	position: relative;

	.joint {
		left: -10px;
	}
}

.cable-wrapper {
	display: flex;
	width: max-content;
	grid-column: 1;
	position: relative;

	.joint {
		right: -10px;
	}
}
.cable {
	width: 40px;
	height: 20px;
}

.caught-cable {
	width: 1px;
	transform-origin: 0 50%;
	pointer-events: none;
}
</style>
