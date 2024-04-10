<script setup>
import { ref } from 'vue'
import useDeviceStore from '@/stores/device.js'
import useWebsocketStore from '@/stores/websocket.js'

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
	middleColors: {
		type: Array,
		default: ['green', 'blue', 'red', 'yellow'],
	},
	endColors: {
		type: Array,
		default: ['blue', 'green', 'red', 'yellow'],
	},
})

const deviceStore = useDeviceStore()
deviceStore.setOrientationMode('portrait')
const websocketStore = useWebsocketStore()
websocketStore.ws.addEventListener('message', (event) => {
	const data = JSON.parse(event.data)

	if (data.event === 'cables') {
		cablesState.value.get(data.color).open = true
	}
	if (data.event === 'cablesFinish') {
		emit('handleFinish')
	}
})
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
				open: false,
			},
		]),
	),
)

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
	if (props.unknownSide === 'right' || cableState.open) {
		if (
			event.changedTouches[0].clientX > cableState.endCableRect.left &&
			event.changedTouches[0].clientX < cableState.endCableRect.right &&
			event.changedTouches[0].clientY > cableState.endCableRect.top &&
			event.changedTouches[0].clientY < cableState.endCableRect.bottom
		) {
			const startX = props.unknownSide === 'left' ? cableState.startCableRect.left : cableState.startCableRect.right
			const endX =
				props.unknownSide === 'left'
					? cableState.endCableRect.right - cableState.endCableRect.width / 2
					: cableState.endCableRect.left + cableState.endCableRect.width / 2
			const startY = cableState.startCableRect.top
			const endY = cableState.endCableRect.top + cableState.endCableRect.height / 2

			const distance = Math.sqrt((startX - endX) ** 2 + (startY - endY) ** 2)
			const angle = Math.atan2(endY - startY, endX - startX)

			cableState.transform = `rotate(${angle}rad) scaleX(${distance})`
			cableState.attach = true

			if (props.unknownSide === 'left') {
				if (Array.from(cablesState.value.values()).every((state) => state.attach)) {
					emit('handleFinish')

					websocketStore.sendMessage({
						event: 'cablesFinish',
						recipient: 'web',
					})
					websocketStore.sendMessage({
						event: 'cablesFinish',
					})
				}
			} else {
				websocketStore.sendMessage({
					event: 'cables',
					recipient: 'web',
					color: props.colors[index],
				})
			}
			return
		}
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
		<div class="end-cable-wrapper" v-for="(color, index) in middleColors" :key="index">
			<div
				class="cable"
				:style="{ background: unknownSide === 'left' ? color : unknownColor }"
				:ref="
					(element) =>
						cablesState.get(color).endCableRef === null ? (cablesState.get(color).endCableRef = element) : null
				"
			/>
			<div class="witness" :class="{ attach: cablesState.get(color).attach || cablesState.get(color).open }" />
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
	z-index: 1;

	.cable {
		height: 80px;
		background: v-bind(unknownColor);
	}

	.witness {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: black;
		position: absolute;
		top: 20%;
		left: 20%;

		&.attach {
			background: white;
		}
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

		.witness {
			right: 20%;
			left: auto;
		}
	}
}
</style>
