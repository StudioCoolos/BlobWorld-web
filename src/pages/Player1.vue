<script setup>
import Strike from '@/components/Strike.vue'
import Drive from '@/components/Drive.vue'
import allPermissions from '@/utils/permissions.js'
import { ref } from 'vue'
import useWebsocketStore from '@/stores/websocket.js'
import Cables from '@/components/Cables.vue'
import Screw from '@/components/Screw.vue'
import Throw from '@/components/Throw.vue'
import useDeviceStore from '@/stores/device.js'
import Key from '@/components/Key.vue'
import Toaster from '@/components/Toaster.vue'

const websocketStore = useWebsocketStore()
const deviceStore = useDeviceStore()
const permissionsAccepted = ref(false)
const stepEnum = Object.freeze({
	Drive: 0,
	Screw: 1,
	Cables: 2,
	Throw: 3,
	Key: 4,
})
const step = ref(stepEnum.Key)

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

websocketStore.ws.addEventListener('open', ({ target }) => {
	target.send('web_1')
	websocketStore.sendMessage({
		event: 'p1_connected',
	})
})
websocketStore.ws.addEventListener('message', (event) => {
	const data = JSON.parse(event.data)

	if (data.event === 'breakdown') {
		deviceStore.isWarning = true
		setTimeout(() => {
			deviceStore.isWarning = false
		}, 2000)
		step.value = stepEnum.Screw
	}
})
</script>

<template>
	<fieldset style="z-index: 10; position: relative">
		<label><input type="radio" v-model="step" :value="stepEnum.Drive" /> Drive</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Screw" /> Screw</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Cables" /> Cables</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Throw" /> Throw</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Key" /> Key</label>
	</fieldset>
	<template v-if="step === stepEnum.Drive">
		<div v-if="permissionsAccepted">
			<Strike />
			<Drive />
		</div>
		<button v-else @click="handlePermissionClick">Ask permissions</button>
	</template>
	<template v-else-if="step === stepEnum.Screw">
		<Screw v-if="permissionsAccepted" @handleFinish="step = stepEnum.Cables" />
		<button v-else @click="handlePermissionClick">Ask permissions</button>
	</template>
	<template v-else-if="step === stepEnum.Cables">
		<Cables unknown-side="right" @handleFinish="step = stepEnum.Drive" />
	</template>
	<template v-else-if="step === stepEnum.Throw">
		<Throw />
	</template>
	<template v-else-if="step === stepEnum.Key">
		<Key />
	</template>

	<Toaster />
</template>

<style scoped></style>
