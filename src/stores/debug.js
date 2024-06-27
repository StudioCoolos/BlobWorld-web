import { Pane } from 'tweakpane'
import { defineStore } from 'pinia'

export const useDebugStore = defineStore({
	id: 'debug',
	state: () => {
		const pane = new Pane()
		const folders = []
		pane.element.style.position = 'relative'
		pane.element.style.zIndex = '999'

		return {
			pane,
			folders,
		}
	},
	actions: {
		addFolder(params) {
			const f = this.pane.addFolder(params)
			this.folders.push(f)
			return f
		},
		getFolder(title) {
			return this.folders.filter((f) => f.title === title)
		},
	},
})
