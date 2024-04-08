<script setup>
import useWebsocketStore from '@/stores/websocket.js'
import { onMounted, ref } from 'vue'
import Cables from '@/components/Cables.vue'
import Screw from '@/components/Screw.vue'

const websocketStore = useWebsocketStore()

onMounted(() => {
	websocketStore.ws.addEventListener('open', () => {
		websocketStore.sendMessage({
			event: 'p2_connected',
		})
	})
})

const stepEnum = Object.freeze({
	Screw: 0,
	Cables: 1,
})

const step = ref(stepEnum.Screw)
</script>

<template>
	<fieldset>
		<label><input type="radio" v-model="step" :value="stepEnum.Screw" /> Screw</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Cables" /> Cables</label>
	</fieldset>
	<template v-if="step === stepEnum.Screw">
		<Screw />
	</template>
	<template v-else-if="step === stepEnum.Cables">
		<Cables unknown-side="left" />
	</template>
</template>

<style scoped></style>
