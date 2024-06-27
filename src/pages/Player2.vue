<script setup>
import { computed, onMounted, ref, shallowRef } from 'vue'

import useWebsocketStore from '@/stores/websocket.js'

import allPermissions from '@/utils/permissions.js'

import { useActiveScreensStore } from '@/stores/activeScreens.js'
import Screen1 from '@/screens/Player2/Screen1.vue'
import Screen2 from '@/screens/Player2/Screen2.vue'
import Screen3 from '@/screens/Player2/Screen3.vue'
import Screw from '@/components/Screw.vue'
import { useStepsStore } from '@/stores/steps.js'
import Cables from '@/components/Cables.vue'
import Key from '@/components/Key.vue'
import useDeviceStore from '@/stores/device.js'

const websocketStore = useWebsocketStore()
const store = useActiveScreensStore()
const stepStore = useStepsStore()

const stepEnum = Object.freeze({
	Controls: 0,
	Screw: 1,
	Cables: 2,
	Key: 3,
})
const step = ref(stepEnum.Controls)
const deviceStore = useDeviceStore()

const permissionsAccepted = ref(false)

websocketStore.ws.addEventListener('open', ({ target }) => {
	target.send('web_2')
	websocketStore.sendMessage({
		event: 'p2_connected',
	})
	const interval = setInterval(() => {
		websocketStore.sendMessage({
			event: 'p2_connected',
			recipient: 'web_1',
		})
	}, 2000)
	setTimeout(() => {
		clearInterval(interval)
	}, 10000)
})
websocketStore.ws.addEventListener('message', (event) => {
	const data = JSON.parse(event.data)

	if (data.event === 'breakdown') {
		deviceStore.isWarning = true
	}

	if (data.event === 'p1_connected') {
		store.setActiveScreen(1)
		setTimeout(() => {
			store.setActiveScreen(2)
		}, 3000)
	}
})

const screens = [Screen1, Screen2, Screen3]

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
	<div class="player2">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="385"
			height="52"
			fill="none"
			viewBox="0 0 385 52"
			style="transform: translateY(-1px)"
		>
			<path
				fill="#000"
				fill-rule="evenodd"
				d="M384.5.5h-393c19 0 36.6 7 51.6 19.1C63.3 35.9 86 51.5 112 51.5h152c26 0 48.6-15.6 68.9-31.9A82.6 82.6 0 0 1 384.5.5Z"
				clip-rule="evenodd"
			/>
			<path
				fill="#727272"
				d="M218.3 21.3v-1l-.4-2.2-.7-1.7-1-1.5a7.8 7.8 0 0 0-2.2-2 17 17 0 0 0-1.8-.7l-1.3-.4-1.7-.3-1.8-.1h-2.2l-.5.2c-.6 0-1.1 0-1.7.2l-1 .1-2 .4-1.6.5c-.4.2-.5.4-.4.7.1.4.4.6.7.5l1.8-.3h2.3l.3.1.9.1c.5.1 1 .4 1.3.6l1 .7c.9 1 .9 1.9.5 3-.1.5-.4 1-.7 1.5a33.5 33.5 0 0 1-2.3 3.5 22.4 22.4 0 0 1-4.9 4.2l-1 .7c-.3 0-.5.2-.7.3l-1 .5-1.2.5-2.7 1a13 13 0 0 1-3.5.4l-1.4-.2c-.9 0-1.5-.5-2.2-1-1.2-.7-1.6-2.3-1.2-3.4l.2-1c0-.2 0-.3-.3-.5-.2 0-.4-.2-.6 0l-.6.5c-.5.4-1 1-1.3 1.5a6 6 0 0 0-.8 1.6v.3l-.3.3-.2-.3v-.3l.1-2.1c.1-1.2.6-2.3 1-3.3l.1-.2.6-.9 1-1.7 2.3-2.9 1.9-1.8.7-.7c.2-.3.2-.6-.1-.8-.3-.2-.5-.2-.8-.1-.8.1-1.6.5-2.3.9l-1.6 1-1.7 1.3a32 32 0 0 0-2 1.8l-1.7 1.9a12.3 12.3 0 0 0-1.7 2.4 10 10 0 0 0-1 2.1c-.5 1-.6 2.2-.7 3.4a11.5 11.5 0 0 0 .4 4l.7 1.6c.4.4.6.9.9 1.3a10.8 10.8 0 0 0 3.5 2.7l1.4.5c.7.3 1.5.4 2.2.6.6 0 1 .3 1.6.1h3.1l1.1-.1h.9c.6-.2 1.2-.4 1.8-.4.6 0 1.1-.3 1.7-.4a91.2 91.2 0 0 0 4.2-1.4l1.3-.6 1.5-.7.9-.4 1-.6 1.4-1a43.2 43.2 0 0 0 6.6-6.2c.5-.5.9-1.2 1.3-1.8l1-1.4c0-.3.2-.6.3-.8l.3-.3.2.3a9 9 0 0 1-.5 3.5l-.8 2.1a25 25 0 0 1-2.1 3.5c-1 1.3-2.1 2.4-3.3 3.6-.4.3-.4.4 0 .9.1.2.2.2.4 0l1-.2.2-.2c.2 0 .4-.2.6-.4l1.4-.9.4-.3 1.3-1 1.5-1.7.7-.8.9-1.2 1.5-2.7a11 11 0 0 0 1.3-3.6l.2-1 .1-2ZM199 18.6l1 .3c.3 0 .5.4.6.7v1l-.5 1.5v.3c0 .2 0 .5.2.6.3.2.5.2.8 0l.6-.7 1-1.4.5-1.5a4 4 0 0 0 0-2c-.3-1.1-1-1.8-2-2-.7-.2-1.3-.3-1.9-.2h-1a22.9 22.9 0 0 0-3.8 1.3 9 9 0 0 0-2 1.1l-1.4 1.2c-.5.5-1 1-1.3 1.6a5 5 0 0 0-.5 1.6c-.1 1 .3 1.9 1.4 2.3l.1.3-.2.1c-.3 0-.7.2-1 0-.3 0-.6 0-.8-.2-.5-.2-.8-.6-.7-1.2 0-.6 0-1.2.4-1.7.2-.3.1-.7 0-.9-.4-.2-.7-.2-1 .1-.7 1-1.4 1.9-1.7 3-.3 1.2-.3 2.3.4 3.3.3.4.6.8 1 1 .4.3.7.3 1.1.4l2-.1h.6l2-.9a14.8 14.8 0 0 0 4.2-3.3c.6-.6 1.1-1.3 1.4-2 .2-.9.2-1.6-.3-2.3-.2-.3-.4-.5-.7-.6l-.2-.3.3-.2 1.4-.2Z"
			/>
		</svg>
		<transition name="fade" mode="out-in">
			<template v-if="stepStore.activeStep === stepStore.steps.Drive">
				<component :is="screens[store.activeScreen]" v-if="permissionsAccepted" />
				<button @click="handlePermissionClick" v-else-if="!permissionsAccepted">Accept permissions</button>
			</template>
			<Screw
				v-else-if="stepStore.activeStep === stepStore.steps.Screw"
				@handleFinish="stepStore.activeStep = stepStore.steps.Cables"
			/>
			<Cables
				v-else-if="stepStore.activeStep === stepStore.steps.Cables"
				unknown-side="left"
				:colors="['blue', 'green', 'red']"
				:end-colors="['red', 'blue', 'green']"
				@handleFinish="stepStore.activeStep = stepStore.steps.Drive"
			/>
		</transition>

		<svg xmlns="http://www.w3.org/2000/svg" width="393" height="52" fill="none" viewBox="0 0 393 52">
			<path
				fill="#000"
				fill-rule="evenodd"
				d="M-.5 51.5h393c-19 0-36.6-7-51.6-19.1C320.7 16.1 298 .5 272 .5H120c-26 0-48.7 15.6-69 31.9A81.8 81.8 0 0 1-.5 51.5Z"
				clip-rule="evenodd"
			/>
		</svg>
	</div>
</template>
<style scoped>
.player2 {
	display: grid;
	grid-template-rows: min-content 1fr min-content;
	height: 100%;
	justify-content: center;
	align-items: center;

	button {
		color: white;
	}
}
</style>
