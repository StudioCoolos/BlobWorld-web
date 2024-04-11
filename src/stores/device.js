import { defineStore } from 'pinia'
import { ref } from 'vue'

const useDeviceStore = defineStore('device', () => {
	/**
	 * @type {import('vue').Ref<'portrait' | 'landscape'>}
	 */
	const orientationMode = ref('portrait')
	const isWarning = ref(false)

	const app = document.querySelector('#app')
	if (orientationMode.value === 'landscape') {
		app?.classList.add('rotated')
	}

	/**
	 * @param {'portrait' | 'landscape'} mode
	 */
	function setOrientationMode(mode) {
		orientationMode.value = mode
		if (mode === 'portrait') {
			app?.classList.remove('rotated')
		} else {
			app?.classList.add('rotated')
		}
	}

	return { orientationMode, setOrientationMode, isWarning }
})

export default useDeviceStore
