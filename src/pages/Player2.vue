<script setup>
import { onMounted, ref } from 'vue'

import Cables from '@/components/Cables.vue'
import Screw from '@/components/Screw.vue'
import Throw from '@/components/Throw.vue'
import Radio from '@/components/Radio.vue'

import useWebsocketStore from '@/stores/websocket.js'
import allPermissions from '@/utils/permissions.js'

const websocketStore = useWebsocketStore()
const permissionsAccepted = ref(false)

const stepEnum = Object.freeze({
	Radio: 0,
	Throw: 1,
	Screw: 2,
	Cables: 3,
})
const step = ref(stepEnum.Radio)

websocketStore.ws.addEventListener('open', ({ target }) => {
	target.send('web_2')
})
websocketStore.ws.addEventListener('message', (event) => {
	const data = JSON.parse(event.data)

	if (data.event === 'breakdown') {
		step.value = stepEnum.Screw
	}
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

onMounted(() => {
	websocketStore.ws.addEventListener('open', () => {
		websocketStore.sendMessage({
			event: 'p2_connected',
		})
	})
})
</script>

<template>
	<fieldset style="z-index: 10; position: relative">
		<label><input type="radio" v-model="step" :value="stepEnum.Radio" /> Radio</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Throw" /> Throw</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Screw" /> Screw</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Cables" /> Cables</label>
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
			@handleFinish="step = stepEnum.Radio"
		/>
	</template>
	<template v-else-if="step === stepEnum.Radio">
		<Radio />
	</template>
</template>

<style scoped></style>
