<script setup>
import { ref } from 'vue'

import useWebsocketStore from '@/stores/websocket.js'

const websocketStore = useWebsocketStore()

const props = defineProps({
	radios: {
		type: Array,
		default: [
			{ value: 'chill', label: 'Chill radio' },
			{ value: 'country', label: 'Country' },
			{ value: 'eightys', label: "Eighty's" },
			{ value: 'techno', label: 'Techno' },
		],
	},
})

const isRadioPlaying = ref(false)
const isWebsocketConnected = ref(false)
const websocketConnectionInterval = ref(null)

websocketStore.ws.addEventListener('open', () => {
	isWebsocketConnected.value = true
})

function playRadio(radio) {
	if (!isWebsocketConnected.value) {
		websocketConnectionInterval.value = setInterval(() => {
			if (isWebsocketConnected.value) {
				clearInterval(websocketConnectionInterval.value)
				playRadio(radio)
			}
		}, 1000)
		return
	}

	websocketStore.sendMessage({ event: 'radio', type: 'play', value: radio })
}

function onChangeRadio(event) {
	playRadio(event.target.value)
}

function onEnable() {
	isRadioPlaying.value = true

	playRadio(props.radios[0].value)
}

function onPause() {
	websocketStore.sendMessage({ event: 'radio', type: 'pause' })
}

function onChangeVolume(event) {
	websocketStore.sendMessage({ event: 'radio', type: 'volume', value: event.target.value / 100 })
}
</script>

<template>
	<button @click="onEnable" class="center" v-if="!isRadioPlaying">Enable radio</button>
	<button @click="onPause" v-else>Pause radio</button>
	<input type="range" min="0" max="100" value="100" @input="onChangeVolume" />
	<select class="center" @change="onChangeRadio" v-show="isRadioPlaying">
		<option v-for="radio in radios" :value="radio.value">{{ radio.label }}</option>
	</select>
</template>

<style scoped>
.center {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
