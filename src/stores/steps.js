import { defineStore } from 'pinia'

export const useStepsStore = defineStore({
	id: 'steps',
	state: () => ({
		steps: Object.freeze({
			Drive: 0,
			Screw: 1,
			Cables: 2,
			Throw: 3,
			Key: 4,
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
