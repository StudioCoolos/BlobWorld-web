<script setup>
import { onMounted, ref } from 'vue'
import useWebsocketStore from '@/stores/websocket.js'
import { lerp } from '@/utils/lerp.js'

const compassValue = ref(0)
let targetCompassValue = 0
const websocketStore = useWebsocketStore()

websocketStore.ws.addEventListener('message', (event) => {
	const data = JSON.parse(event.data)

	if (data.event === 'compass') {
		targetCompassValue = data.value
	}
})

function tick() {
	compassValue.value = lerp(compassValue.value, targetCompassValue, 0.01)
	requestAnimationFrame(tick)
}

onMounted(() => {
	requestAnimationFrame(tick)
})
</script>

<template>
	<img src="/images/compass.svg" alt="compass" />
</template>

<style scoped>
img {
	width: 100%;
	rotate: v-bind('compassValue + "deg"');
}
</style>
