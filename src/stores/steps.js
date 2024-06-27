import { defineStore } from 'pinia'

export const useStepsStore = defineStore({
	id: 'steps',
	state: () => ({
		steps: Object.freeze({
			Drive: 0,
			Screw: 1,
			Cables: 2,
			Key: 3,
		}),
		activeStep: 0,
	}),
	actions: {
		setActiveStep(step) {
			if (!this.steps[step]) {
				return
			}
			this.activeStep = this.steps[step]
		},
	},
})
