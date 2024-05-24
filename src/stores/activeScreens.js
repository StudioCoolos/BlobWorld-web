import { defineStore } from 'pinia'

export const useActiveScreensStore = defineStore({
	id: 'activeScreen',
	state: () => ({
		activeScreen: 0,
	}),
	actions: {
		setActiveScreen(screenIndex) {
			this.activeScreen = screenIndex
		},
	},
})
