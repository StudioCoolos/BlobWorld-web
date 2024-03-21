<script setup>
import { ref } from 'vue'

const cables = ref([
	{
		color: 'red',
	},
	{
		color: 'blue',
	},
	{
		color: 'green',
	},
	{
		color: 'yellow',
	},
])

function handleTouchStart(index, event) {
	cables.value[index].rect = event.target.getBoundingClientRect()
}

function handleTouchMove(index, event) {
	const distance = Math.sqrt(
		(event.touches[0].clientX - cables.value[index].rect.right) ** 2 +
			(event.touches[0].clientY - cables.value[index].rect.top) ** 2,
	)
	const angle = Math.atan2(
		event.touches[0].clientY - cables.value[index].rect.top,
		event.touches[0].clientX - cables.value[index].rect.right,
	)

	cables.value[index].transform = `rotate(${angle}rad) scaleX(${distance})`
}

function handleTouchEnd(index) {
	cables.value[index].transform = ''
}
</script>

<template>
	<div class="cables-container">
		<div
			class="cable-wrapper"
			v-for="(style, index) in cables"
			:key="index"
			@touchstart="(event) => handleTouchStart(index, event)"
			@touchmove="(event) => handleTouchMove(index, event)"
			@touchend="() => handleTouchEnd(index)"
		>
			<div class="cable" :style="{ background: style.color }" />
			<div class="cable caught-cable" :style="{ background: style.color, transform: style.transform }" />
		</div>
	</div>
</template>

<style scoped>
.cables-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: space-around;
}

.cable-wrapper {
	display: flex;
}
.cable {
	width: 40px;
	height: 20px;
}

.caught-cable {
	width: 1px;
	transform-origin: 0 50%;
}
</style>
