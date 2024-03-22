<script setup>
import useWebsocketStore from '@/stores/websocket.js'

const websocketStore = useWebsocketStore()

function waitForOpenState(websocket) {
	return new Promise((resolve, reject) => {
		if (websocket.readyState === 1) {
			resolve();
		} else {
			websocket.addEventListener('open', resolve, { once: true });
			websocket.addEventListener('error', reject, { once: true });
		}
	});
}

async function executeWhenOpen() {
	try {
		await waitForOpenState(websocketStore.ws);
		websocketStore.sendMessage({
			event: 'p2_connected'
		})
		console.log('Event sent')
	} catch (error) {
		console.error('WebSocket error:', error);
	}
}

executeWhenOpen();
</script>

<template>
Player2
</template>

<style scoped>

</style>