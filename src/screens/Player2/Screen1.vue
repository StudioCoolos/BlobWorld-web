<script setup>
import { useActiveScreensStore } from '@/stores/activeScreens.js'
import { ref } from 'vue'
import useWebsocketStore from '@/stores/websocket.js'
import Screw from '@/components/Screw.vue'
import Throw from '@/components/Throw.vue'
import Cables from '@/components/Cables.vue'
import Radio from '@/components/Radio.vue'
import Klaxon from '@/components/Klaxon.vue'
import Headlights from '@/components/Headlights.vue'
import useDeviceStore from '@/stores/device.js'

const stepEnum = Object.freeze({
	Drive: 0,
	Screw: 1,
	Cables: 2,
	Throw: 3,
	Key: 4,
	Controls: 5,
})
const step = ref(stepEnum.Controls)
const store = useActiveScreensStore()

const websocketStore = useWebsocketStore()
const deviceStore = useDeviceStore()

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
	<div class="Screen1">
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
			<Radio />
			<Headlights />
			<Klaxon />
		</template>
	</div>
</template>

<style scoped>
.Screen1 {
	display: flex;
	flex-direction: column;
	text-transform: uppercase;
	color: #000;
	text-align: center;
	font-family: 'League Gothic', sans-serif;

	font-style: normal;
	font-weight: 400;
	line-height: normal;

	.title {
		font-size: 40px;
	}
}
</style>
