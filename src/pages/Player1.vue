<script setup>
import { computed, onMounted, ref, shallowRef } from 'vue'
import useWebsocketStore from '@/stores/websocket.js'
import Cables from '@/components/Cables.vue'
import Screw from '@/components/Screw.vue'
import Throw from '@/components/Throw.vue'
import useDeviceStore from '@/stores/device.js'
import Key from '@/components/Key.vue'
import Toaster from '@/components/Toaster.vue'
import Screen from '@/components/Screen.vue'
import Screen1 from '@/screens/Player1/Screen1.vue'
import { useActiveScreensStore } from '@/stores/activeScreens.js'
import Screen2 from '@/screens/Player1/Screen2.vue'
import Screen0 from '@/screens/Player1/Screen0.vue'
import ScreenDriving from '@/screens/Player1/ScreenDriving.vue'
import BrandedPanel from '@/components/BrandedPanel.vue'
import Button from '@/components/Button.vue'
import { useStepsStore } from '@/stores/steps.js'

const websocketStore = useWebsocketStore()
const deviceStore = useDeviceStore()
const stepStore = useStepsStore()
const store = useActiveScreensStore()

stepStore.setActiveStep('Drive')

websocketStore.ws.addEventListener('open', ({ target }) => {
	target.send('web_1')
	websocketStore.sendMessage({
		event: 'p1_connected',
	})
	websocketStore.sendMessage({
		event: 'p1_connected',
		recipient: 'web_2',
	})
	const interval = setInterval(() => {
		websocketStore.sendMessage({
			event: 'p1_connected',
			recipient: 'web_2',
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
		// setTimeout(() => {
		// 	deviceStore.isWarning = false
		// }, 2000)
		// step.value = stepEnum.Screw
	}
})

const screens = ref([
	{ component: shallowRef(Screen0) },
	{ component: shallowRef(Screen1) },
	{ component: shallowRef(Screen2) },
	{ component: shallowRef(ScreenDriving) },
])

const activeScreen = computed(() => store.activeScreen)
</script>

<template>
	<!--	<fieldset style="z-index: 10; position: relative">-->
	<!--		<label><input type="radio" v-model="step" :value="stepEnum.Drive" /> Drive</label>-->
	<!--		<label><input type="radio" v-model="step" :value="stepEnum.Screw" /> Screw</label>-->
	<!--		<label><input type="radio" v-model="step" :value="stepEnum.Cables" /> Cables</label>-->
	<!--		<label><input type="radio" v-model="step" :value="stepEnum.Throw" /> Throw</label>-->
	<!--		<label><input type="radio" v-model="step" :value="stepEnum.Key" /> Key</label>-->
	<!--	</fieldset>-->
	<transition>
		<BrandedPanel v-if="activeScreen !== 0" />
	</transition>

	<template v-if="stepStore.activeStep === stepStore.steps.Drive">
		<Screen
			v-for="(screen, index) in screens"
			:key="index"
			:isActive="activeScreen === index"
			:component="screen.component"
		/>
	</template>
	<template v-if="stepStore.activeStep === stepStore.steps.Screw">
		<Screen0 />
		<Screw @handleFinish="stepStore.activeStep = stepStore.steps.Cables" />
	</template>
	<template v-else-if="stepStore.activeStep === stepStore.steps.Cables">
		<Cables unknown-side="right" @handleFinish="stepStore.activeStep = stepStore.steps.Drive" />
	</template>
	<template v-else-if="stepStore.activeStep === stepStore.steps.Throw">
		<Throw />
	</template>
	<template v-else-if="stepStore.activeStep === stepStore.steps.Key">
		<Key />
	</template>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease-in-out 0.8s;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
