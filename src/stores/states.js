import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

const useStatesStore = defineStore('notification', () => {
	const states = reactive({
		headlights: {
			onTitle: 'LIGHTS ON',
			offTitle: 'LIGHTS OFF',
			enabled: false,
			icon: '/images/light-bulb.svg',
		},
		wipers: {
			onTitle: 'WIPERS ON',
			offTitle: 'WIPERS OFF',
			enabled: true,
			icon: '/images/wipers.svg',
		},
	})

	function add(state) {
		states.push(state)
	}

	function remove(key) {
		delete states.value[key]
	}

	function reset() {
		states.value = {
			headlights: {
				enabled: false,
				icon: '/images/light-bulb.svg',
				title: '',
			},
			wipers: {
				enabled: false,
				icon: '/images/wiper.svg',
				title: '',
			},
		}
	}

	return { states, add, remove, reset }
})

export default useStatesStore
