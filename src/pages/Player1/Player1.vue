<script setup>

import OrientationBlocker from '@/components/OrientationBlocker.vue'
import Motion from '@/components/Strike.vue'
import Orientation from '@/components/Drive.vue'
import allPermissions from '@/utils/permissions.js'
import { onMounted, ref, watch } from 'vue'
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

onMounted(() => {
	websocketStore.ws.addEventListener('open', () => {
		websocketStore.sendMessage({
			event: 'p1_connected'
		})
	})
})

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