<script setup>
import { ref } from 'vue'

import useWebsocketStore from '@/stores/websocket.js'
import useStatesStore from '@/stores/states.js'

const websocketStore = useWebsocketStore()
const statesStore = useStatesStore()

const isHeadlightsOn = ref(false)
const isWebsocketConnected = ref(false)

websocketStore.ws.addEventListener('open', () => {
	isWebsocketConnected.value = true
})

function onClick() {
	if (!isWebsocketConnected.value) {
		return
	}
	isHeadlightsOn.value = !isHeadlightsOn.value
	console.log('isHeadlightsOn', isHeadlightsOn.value)

	websocketStore.sendMessage({
		event: 'headlights',
		value: isHeadlightsOn.value,
		recipient: 'web_1',
	})

	statesStore.states.headlights.enabled = isHeadlightsOn.value
}
</script>

<template>
	<button @click="onClick">{{ isHeadlightsOn ? 'Turn off' : 'Turn on' }} headlights</button>
</template>

<style scoped>
button {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, calc(-50% + 100px));
}
</style>
