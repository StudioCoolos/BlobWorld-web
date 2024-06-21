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
const deviceStore = useDeviceStore()
deviceStore.setOrientationMode('portrait')

onMounted(() => {
	const canvasElement = canvas.value
	canvasElement.width = canvasElement.clientWidth
	canvasElement.height = canvasElement.clientHeight
	if (!canvasElement) return
	ctx.value = canvasElement.getContext('2d')
	ctx.value.strokeStyle = 'white'
	ctx.value.fillStyle = 'rgba(0, 0, 0, 0.1)'
	ctx.value.lineWidth = 10
	ctx.value.lineCap = 'round'
	requestAnimationFrame(tick)
})

let lastX = 0
let lastY = 0

let startX = 0
let startY = 0

function handleTouchStart(event) {
	startX = lastX = event.touches[0].clientX
	startY = lastY = event.touches[0].clientY

	websocketStore.sendMessage({
		event: 'throwStart',
	})
}

function handleTouchMove(event) {
	ctx.value.beginPath()
	ctx.value.moveTo(lastX, lastY)
	ctx.value.lineTo(event.touches[0].clientX, event.touches[0].clientY)
	ctx.value.stroke()
	ctx.value.closePath()
	lastX = event.touches[0].clientX
	lastY = event.touches[0].clientY
}

function handleTouchEnd(event) {
	const x = event.changedTouches[0].clientX
	const y = event.changedTouches[0].clientY
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
</script>

<template>
	<canvas
		class="throw"
		ref="canvas"
		@touchstart="handleTouchStart"
		@touchmove="handleTouchMove"
		@touchend="handleTouchEnd"
	/>
</template>

<style scoped>
.throw {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}
</style>
