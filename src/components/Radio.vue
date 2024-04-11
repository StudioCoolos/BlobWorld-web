<script setup>
import { ref } from 'vue'
import AudioManager from '@/utils/AudioManager.js'

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
const audioManager = new AudioManager()

function playRadio(radio) {
	audioManager.play(radio)
}

function onChange(event) {
	audioManager.stop()

	audioManager.play('switch')

	playRadio(event.target.value)
}

function onClick() {
	isRadioPlaying.value = true

	playRadio(props.radios[0].value)
}
</script>

<template>
	<button @click="onClick" class="center" v-show="!isRadioPlaying">Enable radio</button>
	<select class="center" @change="onChange($event)" v-show="isRadioPlaying">
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
