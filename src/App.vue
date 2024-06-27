<script setup>
import { computed, ref } from 'vue'
import Player1 from '@/pages/Player1.vue'
import Page404 from '@/pages/404.vue'
import Player2 from '@/pages/Player2.vue'
import OrientationBlocker from '@/components/OrientationBlocker.vue'
import AudioManager from '@/utils/AudioManager.js'
import Warning from '@/components/Warning.vue'
import { useDebugStore } from '@/stores/debug.js'
import useDeviceStore from '@/stores/device.js'

const audioManager = new AudioManager()

const routes = {
	'/': Player1,
	'/player1': Player1,
	'/player2': Player2,
}
const currentRoute = ref(location.pathname)
const currentView = computed(() => {
	return routes[currentRoute.value || '/'] || Page404
})

const debugStore = useDebugStore()
const deviceStore = useDeviceStore()

debugStore.pane.hidden = true

const appDebug = debugStore.addFolder({
	title: 'App',
})

const screwDebug = debugStore.addFolder({
	title: 'Screw',
})

screwDebug
	.addButton({
		title: 'Warning screw',
		label: 'Trigger',
	})
	.on('click', () => {
		deviceStore.isWarning = true
	})
</script>

<template>
	<Warning />
	<!--	<OrientationBlocker />-->
	<!-- <OrientationBlocker /> -->
	<component :is="currentView" />
</template>

<style scoped></style>
