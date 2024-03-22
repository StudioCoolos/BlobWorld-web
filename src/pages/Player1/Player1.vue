<script setup>

import OrientationBlocker from '@/components/OrientationBlocker.vue'
import Motion from '@/components/Strike.vue'
import Orientation from '@/components/Drive.vue'
import allPermissions from '@/utils/permissions.js'
import { ref, watch } from 'vue'
import useWebsocketStore from '@/stores/websocket.js'

const permissionsAccepted = ref(false)

function handlePermissionClick() {
	allPermissions()
		.then((result) => {
			permissionsAccepted.value = true
			console.log(result)
		})
		.catch((reason) => {
			alert(reason)
		})
}

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
			event: 'p1_connected'
		})
		console.log('Event sent')
	} catch (error) {
		console.error('WebSocket error:', error);
	}
}

executeWhenOpen();

</script>

<template>
	<OrientationBlocker />
	<div v-if="permissionsAccepted">
		<Motion />
		<Orientation />
	</div>
	<button v-else @click="handlePermissionClick">Ask permissions</button>
</template>

<style scoped>

</style>