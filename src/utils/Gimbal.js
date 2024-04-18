import { Euler, MathUtils, Object3D, Quaternion, Vector3 } from 'three'

class Gimbal {
	constructor() {
		this.quaternion = new Quaternion()
		this.quatOrigin = new Quaternion()
		this.axisUp = new Vector3(0, 1, 0)
		this.axisFwd = new Vector3(0, 0, 1)
		this.vectorUp = new Vector3()
		this.vectorFwd = new Vector3()
		this.sensorRotations = new Object3D()
		this.orientationData = { alpha: 0, beta: 0, gamma: 0 }
		this.needsUpdate = false
		this.recalRequested = true
		this.eulerOrigin = new Euler(0, 0, 0)
		this.isEnable = false
		this.yaw = undefined
		this.pitch = undefined
		this.roll = undefined
	}

	performRecalibration() {
		this.sensorRotations.setRotationFromEuler(this.eulerOrigin)
		this.sensorRotations.rotateZ(MathUtils.degToRad(0))
		this.sensorRotations.rotateX(MathUtils.degToRad(0))
		this.sensorRotations.rotateY(MathUtils.degToRad(-30))
		this.quatOrigin.copy(this.sensorRotations.quaternion).invert()
		this.recalRequested = false
	}

	onSensorMove(event) {
		this.orientationData = {
			alpha: event.alpha || 0,
			beta: event.beta || 0,
			gamma: event.gamma || 0,
		}
		this.needsUpdate = true
		if (this.recalRequested) this.performRecalibration()
	}

	enable() {
		return new Promise((resolve, reject) => {
			if (typeof DeviceOrientationEvent.requestPermission === 'function') {
				DeviceOrientationEvent.requestPermission()
					.then((permissionState) => {
						if (permissionState === 'granted') {
							addEventListener('deviceorientation', this.onSensorMove.bind(this), false)
							this.isEnable = true
							resolve('granted')
						}
					})
					.catch(reject)
			} else {
				if (navigator.userAgent.indexOf('Mobile') === -1) {
					reject('Not a mobile device')
				}
				addEventListener('deviceorientation', this.onSensorMove.bind(this), false)
				this.isEnable = true
				resolve('granted')
			}
		})
	}

	disable() {
		removeEventListener('deviceorientation', this.onSensorMove.bind(this), false)
		this.isEnable = false
	}

	recalibrate() {
		this.recalRequested = true
	}

	update() {
		if (!this.needsUpdate) return false
		this.sensorRotations.setRotationFromEuler(this.eulerOrigin)
		this.sensorRotations.applyQuaternion(this.quatOrigin)
		this.sensorRotations.rotateZ(MathUtils.degToRad(this.orientationData.alpha))
		this.sensorRotations.rotateX(MathUtils.degToRad(this.orientationData.beta))
		this.sensorRotations.rotateY(MathUtils.degToRad(this.orientationData.gamma))
		this.quaternion.copy(this.sensorRotations.quaternion).invert()
		this.vectorUp.copy(this.axisUp).applyQuaternion(this.quaternion)
		this.vectorFwd.copy(this.axisFwd).applyQuaternion(this.quaternion)
		this.yaw = Math.atan2(this.vectorFwd.x, this.vectorFwd.z)
		this.pitch = Math.atan2(this.vectorUp.z, this.vectorUp.y)
		this.roll = Math.atan2(-this.vectorUp.x, this.vectorUp.y)

		this.needsUpdate = false
		return true
	}
}

export default new Gimbal()
