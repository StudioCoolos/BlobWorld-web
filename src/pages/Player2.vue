<script setup>
import useWebsocketStore from '@/stores/websocket.js'
import { ref } from 'vue'
import Cables from '@/components/Cables.vue'
import Screw from '@/components/Screw.vue'
import Throw from '@/components/Throw.vue'

const websocketStore = useWebsocketStore()

const stepEnum = Object.freeze({
	Throw: 0,
	Screw: 1,
	Cables: 2,
})

const step = ref(stepEnum.Throw)

websocketStore.ws.addEventListener('message', (event) => {
	const data = JSON.parse(event.data)

	if (data.event === 'breakdown') {
		step.value = stepEnum.Screw
	}
})
</script>

<template>
	<fieldset style="z-index: 10; position: relative">
		<label><input type="radio" v-model="step" :value="stepEnum.Throw" /> Screw</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Screw" /> Screw</label>
		<label><input type="radio" v-model="step" :value="stepEnum.Cables" /> Cables</label>
	</fieldset>
	<template v-if="step === stepEnum.Throw">
		<Throw />
	</template>
	<template v-else-if="step === stepEnum.Screw">
		<Screw />
	</template>
	<template v-else-if="step === stepEnum.Cables">
		<Cables
			unknown-side="left"
			:colors="['blue', 'green', 'red', 'yellow']"
			:end-colors="['red', 'blue', 'green', 'yellow']"
		/>
	</template>
</template>

<style scoped></style>
