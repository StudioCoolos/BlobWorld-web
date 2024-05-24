<script setup>
import { computed, onMounted, ref, shallowRef } from 'vue'

import useWebsocketStore from '@/stores/websocket.js'

import allPermissions from '@/utils/permissions.js'

import { useActiveScreensStore } from '@/stores/activeScreens.js'
import Screen0 from '@/screens/Player2/Screen0.vue'
import Screen from '@/components/Screen.vue'
import Screen1 from '@/screens/Player2/Screen1.vue'
import Throw from '@/components/Throw.vue'
import Screw from '@/components/Screw.vue'
import Cables from '@/components/Cables.vue'
import Radio from '@/components/Radio.vue'
import Headlights from '@/components/Headlights.vue'
import Klaxon from '@/components/Klaxon.vue'
import Key from '@/components/Key.vue'

const websocketStore = useWebsocketStore()
const permissionsAccepted = ref(false)

const stepEnum = Object.freeze({
	Controls: 0,
	Throw: 1,
	Screw: 2,
	Cables: 3,
	Key: 4,
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
	<fieldset style="z-index: 10; position: relative">
		<label><input type="radio" v-model="step" :value="stepEnum.Controls" /> Controls</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Throw" /> Throw</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Screw" /> Screw</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Cables" /> Cables</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Key" /> Portal</label>
	</fieldset>
	<template v-if="step === stepEnum.Throw">
		<Throw />
	</template>
	<template v-else-if="step === stepEnum.Screw">
		<Screw v-if="permissionsAccepted" @handleFinish="step = stepEnum.Cables" />
		<button v-else @click="handlePermissionClick">Ask permissions</button>
	</template>
	<template v-else-if="step === stepEnum.Cables">
		<Cables
			unknown-side="left"
			:colors="['blue', 'green', 'red', 'yellow']"
			:end-colors="['red', 'blue', 'green', 'yellow']"
			@handleFinish="step = stepEnum.Controls"
		/>
	</template>
	<template v-else-if="step === stepEnum.Controls">
		<Screen
			v-for="(screen, index) in screens"
			:key="index"
			:isActive="activeScreen === index"
			:component="screen.component"
		/>
	</template>
	<template v-else-if="step === stepEnum.Key">
		<Key />
	</template>
</template>
<style scoped></style>
