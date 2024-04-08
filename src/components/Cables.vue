<script setup>
import { ref } from 'vue'
import useDeviceStore from '@/stores/device.js'

const emit = defineEmits(['handleFinish'])
const props = defineProps({
	colors: {
		type: Array,
		default: ['red', 'blue', 'green', 'yellow'],
	},
	unknownSide: {
		type: String,
		default: 'left',
	},
	endColors: {
		type: Array,
		default: null,
	},
})

const deviceStore = useDeviceStore()
deviceStore.setOrientationMode('portrait')
const unknownColor = 'grey'
const cablesState = ref(
	new Map(
		props.colors.map((color) => [
			color,
			{
				transform: '',
				endCableRef: null,
				endCableRect: {},
				startCableRect: {},
				attach: false,
			},
		]),
	),
)

const endColors = props.endColors || [...props.colors].sort(() => Math.random() - 0.5)

function handleTouchStart(index, event) {
	const cableState = cablesState.value.get(props.colors[index])
	cableState.startCableRect = event.currentTarget.getBoundingClientRect()
	cableState.endCableRect = cableState.endCableRef.getBoundingClientRect()
}

function handleTouchMove(index, event) {
	const cableState = cablesState.value.get(props.colors[index])
	const distance = Math.sqrt(
		(event.touches[0].clientX -
			(props.unknownSide === 'left' ? cableState.startCableRect.left : cableState.startCableRect.right)) **
			2 +
			(event.touches[0].clientY - (cableState.startCableRect.top + cableState.startCableRect.height / 2)) ** 2,
	)
	const angle = Math.atan2(
		event.touches[0].clientY - (cableState.startCableRect.top + cableState.startCableRect.height / 2),
		event.touches[0].clientX -
			(props.unknownSide === 'left' ? cableState.startCableRect.left : cableState.startCableRect.right),
	)
	cableState.transform = `rotate(${angle}rad) scaleX(${distance})`
}

function handleTouchEnd(index, event) {
	const cableState = cablesState.value.get(props.colors[index])
	if (
		event.changedTouches[0].clientX > cableState.endCableRect.left &&
		event.changedTouches[0].clientX < cableState.endCableRect.right &&
		event.changedTouches[0].clientY > cableState.endCableRect.top &&
		event.changedTouches[0].clientY < cableState.endCableRect.bottom
	) {
		const distance = Math.sqrt(
			((props.unknownSide === 'left' ? cableState.startCableRect.left : cableState.startCableRect.right) -
				(props.unknownSide === 'left' ? cableState.endCableRect.right : cableState.endCableRect.left)) **
				2 +
				(cableState.startCableRect.top - cableState.endCableRect.top) ** 2,
		)
		const angle = Math.atan2(
			cableState.endCableRect.top - cableState.startCableRect.top,
			(props.unknownSide === 'left' ? cableState.endCableRect.right : cableState.endCableRect.left) -
				(props.unknownSide === 'left' ? cableState.startCableRect.left : cableState.startCableRect.right),
		)

		cableState.transform = `rotate(${angle}rad) scaleX(${distance})`
		cableState.attach = true

		if (Array.from(cablesState.value.values()).every((state) => state.attach)) {
			emit('handleFinish')
		}
		return
	}
	cableState.transform = ''
	cableState.attach = false
}
</script>

<template>
	<div
		class="cables-container"
		:class="{ 'unknown-side-left': unknownSide === 'left', 'unknown-side-right': unknownSide === 'right' }"
	>
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
			<div
				class="cable caught-cable"
				:style="{
					background: state[0],
					transform: state[1].transform,
				}"
			/>
		</div>
		<div class="end-cable-wrapper" v-for="(color, index) in endColors" :key="index">
			<div
				class="cable"
				:style="{
					background: cablesState.get(color).attach ? color : unknownColor,
				}"
				:ref="
					(element) =>
						cablesState.get(color).endCableRef === null ? (cablesState.get(color).endCableRef = element) : null
				"
			/>
			<div
				class="joint"
				:style="{
					background: cablesState.get(color).attach ? color : unknownColor,
				}"
			/>
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
	grid-column: 1;
	display: flex;
	width: max-content;
	position: relative;

	.joint {
		right: -10px;
	}
}

.cable {
	width: 50px;
	height: 20px;
}

.caught-cable {
	z-index: 1;
	width: 1px;
	transform-origin: 0 50%;
	pointer-events: none;
}

.unknown-side-left {
	.cable-wrapper {
		grid-column: 2;
		justify-self: right;
		flex-direction: row-reverse;
		.joint {
			left: -10px;
			right: auto;
		}
	}

	.end-cable-wrapper {
		grid-column: 1;
		justify-self: left;

		.joint {
			right: -10px;
			left: auto;
		}
	}
}
</style>
