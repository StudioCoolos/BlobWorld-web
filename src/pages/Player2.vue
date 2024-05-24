<script setup>
import { computed, onMounted, ref, shallowRef } from 'vue'

import useWebsocketStore from '@/stores/websocket.js'

import allPermissions from '@/utils/permissions.js'

import { useActiveScreensStore } from '@/stores/activeScreens.js'
import Screen0 from '@/screens/Player2/Screen0.vue'
import Screen from '@/components/Screen.vue'
import Screen1 from '@/screens/Player2/Screen1.vue'

const websocketStore = useWebsocketStore()
const permissionsAccepted = ref(false)

const stepEnum = Object.freeze({
	Controls: 0,
	Throw: 1,
	Screw: 2,
	Cables: 3,
})
const step = ref(stepEnum.Controls)

websocketStore.ws.addEventListener('open', ({ target }) => {
	target.send('web_2')
	websocketStore.sendMessage({
		event: 'p2_connected',
	})
	websocketStore.sendMessage({
		event: 'p2_connected',
		recipient: 'web_1',
	})
})
websocketStore.ws.addEventListener('message', (event) => {
	const data = JSON.parse(event.data)

	if (data.event === 'breakdown') {
		step.value = stepEnum.Screw
	}
})

const store = useActiveScreensStore()

const screens = ref([{ component: shallowRef(Screen0) }, { component: shallowRef(Screen1) }])

const activeScreen = computed(() => store.activeScreen)

onMounted(() => {
	setTimeout(() => {
		store.setActiveScreen(1)
	}, 3000)
})

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
</script>

<template>
	<Screen
		v-for="(screen, index) in screens"
		:key="index"
		:isActive="activeScreen === index"
		:component="screen.component"
	/>
</template>
<style scoped></style>
