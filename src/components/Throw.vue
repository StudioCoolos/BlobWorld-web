<script setup>
import { onMounted, ref } from 'vue'
import useWebsocketStore from '@/stores/websocket.js'
import useDeviceStore from '@/stores/device.js'

/**
 * @type {Ref<HTMLCanvasElement>}
 */
const canvas = ref()
/**
 * @type {Ref<CanvasRenderingContext2D>}
 */
const ctx = ref()
const websocketStore = useWebsocketStore()

const props = defineProps({
	opened: {
		type: Boolean,
		default: false,
	},
})
const opened = ref(props.opened)

let canvasRect = null
function startCanvas() {
	const canvasElement = canvas.value
	canvasElement.width = canvasElement.clientWidth
	canvasElement.height = canvasElement.clientHeight
	canvasRect = canvasElement.getBoundingClientRect()

	if (!canvasElement) return
	ctx.value = canvasElement.getContext('2d')
	ctx.value.strokeStyle = 'rgba(0, 0, 0, 1)'
	ctx.value.fillStyle = 'rgba(255, 200, 0, 0.1)'
	ctx.value.lineWidth = 50
	ctx.value.lineCap = 'round'
	requestAnimationFrame(tick)
}

let lastX = 0
let lastY = 0

let startX = 0
let startY = 0

function handleTouchStart(event) {
	if (!opened.value) return
	startX = lastX = event.touches[0].clientX - canvasRect.left
	startY = lastY = event.touches[0].clientY - canvasRect.top

	// websocketStore.sendMessage({
	// 	event: 'throwStart',a
	// })
}

function handleTouchMove(event) {
	if (!opened.value) return
	ctx.value.beginPath()
	ctx.value.moveTo(lastX, lastY)
	ctx.value.lineTo(event.touches[0].clientX - canvasRect.left, event.touches[0].clientY - canvasRect.top)
	ctx.value.stroke()
	ctx.value.closePath()
	lastX = event.touches[0].clientX - canvasRect.left
	lastY = event.touches[0].clientY - canvasRect.top
}

function handleTouchEnd(event) {
	if (!opened.value) return
	const x = event.changedTouches[0].clientX - canvasRect.left
	const y = event.changedTouches[0].clientY - canvasRect.top
	if (y < startY) {
		const force = Math.round(Math.sqrt((x - startX) ** 2 + (y - startY) ** 2))
		const angle = Math.round((Math.atan2(y - startY, x - startX) + Math.PI / 2) * (180 / Math.PI))

		websocketStore.sendMessage({
			event: 'throw',
			force,
			angle,
		})
	}
}

function tick() {
	ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height)
	requestAnimationFrame(tick)
}

function handleEyeClick() {
	opened.value = !opened.value
	setTimeout(() => {
		startCanvas()
	}, 500)
}

function handleCanvasClick() {
	if (opened.value) return
	handleEyeClick()
}
</script>

<template>
	<div class="throw" :class="{ 'throw--opened': opened, 'throw--shooting': shooting }">
		<canvas
			class="throw-canvas"
			ref="canvas"
			@touchstart="handleTouchStart"
			@touchmove="handleTouchMove"
			@touchend="handleTouchEnd"
			@click="handleCanvasClick"
		/>
		<button class="blob-eye" @click="handleEyeClick" />
	</div>
</template>

<style scoped lang="scss">
.throw {
	--ease: cubic-bezier(0.76, 0, 0.24, 1);
	--duration: 0.5s;
	position: absolute;
	height: 80px;
	left: 16px;
	right: 16px;
	width: calc(100% - 32px);
	border-radius: 40px;
	bottom: 20px;
	outline: #ffeeb1 4px solid;
	transition-property: bottom, height, border-radius;
	transition: var(--duration) var(--ease);
	contain: paint;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1;

	.throw-canvas {
		width: 100%;
		height: 100%;
		background: #ffc700;
	}

	.blob-eye {
		position: absolute;
		width: 50px;
		height: 50px;
		background: white;
		border-radius: 50%;
		bottom: 15px;
		transition: var(--duration) var(--ease);

		&::before {
			content: '';
			position: absolute;
			width: 20px;
			height: 20px;
			background: black;
			border-radius: 50%;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			transition: opacity 0.5s;
			animation: animation 10s infinite;

			@keyframes animation {
				0% {
					transform: translate(-50%, -50%) translate(-5px, 5px);
				}
				50% {
					transform: translate(-50%, -50%) translate(5px, 5px);
				}
				60% {
					transform: translate(-50%, -50%);
				}
				70% {
					transform: translate(-50%, -50%) translate(-5px, -5px);
				}
				100% {
					transform: translate(-50%, -50%) translate(-5px, 5px);
				}
			}
		}

		&::after {
			content: url('/images/cross.svg');
			transition: scale 0.5s;
			display: block;
			scale: 0;
		}
	}

	&--opened {
		border-radius: 50vw 50vw 0 0;
		bottom: 0;
		height: 90%;

		.blob-eye {
			bottom: 35px;
			&::before {
				opacity: 0;
			}
			&::after {
				scale: 1;
			}
		}
	}
}
</style>
