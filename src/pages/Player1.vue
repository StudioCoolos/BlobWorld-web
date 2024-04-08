<script setup>
import OrientationBlocker from '@/components/OrientationBlocker.vue'
import Strike from '@/components/Strike.vue'
import Drive from '@/components/Drive.vue'
import allPermissions from '@/utils/permissions.js'
import { onMounted, ref } from 'vue'
import useWebsocketStore from '@/stores/websocket.js'
import Cables from '@/components/Cables.vue'

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
			event: 'p1_connected',
		})
	})
})
const stepEnum = Object.freeze({
	Drive: 0,
	Screw: 1,
	Cables: 2,
})

const step = ref(stepEnum.Drive)
</script>

<template>
	<fieldset>
		<label><input type="radio" v-model="step" :value="stepEnum.Drive" /> Drive</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Screw" /> Screw</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Cables" /> Cables</label>
	</fieldset>
	<template v-if="step === stepEnum.Drive">
		<OrientationBlocker />
		<div v-if="permissionsAccepted">
			<Strike />
			<Drive />
		</div>
		<button v-else @click="handlePermissionClick">Ask permissions</button>
	</template>
	<template v-else-if="step === stepEnum.Screw"> </template>
	<template v-else-if="step === stepEnum.Cables">
		<Cables unknown-side="right" />
	</template>
</template>

<style scoped></style>
