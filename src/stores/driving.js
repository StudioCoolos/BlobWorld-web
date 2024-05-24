import { defineStore } from 'pinia'

export const useDrivingStore = defineStore({
	id: 'drivingStore',
	state: () => ({
		isDriving: false,
		throttle: 0,
		steering: 0,
	}),
	actions: {
		setIsDriving(isDriving) {
			this.isDriving = isDriving
		},
		setThrottle(throttle) {
			this.throttle = throttle
		},
		setSteering(steering) {
			this.steering = steering
		},
	},
})
