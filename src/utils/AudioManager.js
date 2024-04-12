import useWebsocketStore from '@/stores/websocket.js'

let instance = null

export default class AudioManager {
	constructor() {
		// Singleton
		if (instance) {
			return instance
		}
		instance = this
		this.audios = {
			correct: {
				src: '/audios/correct.mp3',
				autoplay: false,
				loop: false,
				volume: 1,
			},
			train: {
				src: '/audios/train.mp3',
				autoplay: false,
				loop: false,
				volume: 1,
			},
			chill: {
				src: '/audios/radio/chill.mp3',
				autoplay: false,
				loop: true,
				volume: 1,
			},
			country: {
				src: '/audios/radio/country.mp3',
				autoplay: false,
				loop: true,
				volume: 1,
			},
			eightys: {
				src: '/audios/radio/eightys.mp3',
				autoplay: false,
				loop: true,
				volume: 1,
			},
			techno: {
				src: '/audios/radio/techno.mp3',
				autoplay: false,
				loop: true,
				volume: 1,
			},
			switch: {
				src: '/audios/radio/switch.mp3',
				autoplay: false,
				loop: false,
				volume: 1,
			},
			alarm: {
				src: '/audios/alarm.mp3',
				autoplay: false,
				loop: false,
				volume: 1,
			},
		}
		this.#setAudioInstances()
		this.#setAudioContextReadyListener()
		this.#eventsListener()
	}

	#setAudioInstances() {
		Object.keys(this.audios).forEach((key) => {
			const values = this.audios[key]
			const audio = new Audio(values.src)
			audio.loop = values.loop
			audio.volume = values.volume
			this.audios[key].instance = audio

			this.audios[key].instance.on = (event, callback) => {
				this.audios[key].instance.addEventListener(event, callback)
			}

			this.audios[key].instance.off = (event, callback) => {
				this.audios[key].instance.removeEventListener(event, callback)
			}
		})
	}
	#setAudioContextReadyListener() {
		addEventListener(
			'click',
			() => {
				this.audioContextReady = true
				Object.keys(this.audios).forEach((key) => {
					const audio = this.audios[key]
					if (audio.autoplay) {
						audio.instance.play()
					} else {
						audio.instance.muted = true
						audio.instance.play()
						audio.instance.pause()
						audio.instance.currentTime = 0
						audio.instance.muted = false
					}
				})
			},
			{ once: true },
		)
	}

	#eventsListener() {
		const websocketStore = useWebsocketStore()
		websocketStore.ws.addEventListener('message', (event) => {
			const data = JSON.parse(event.data)
			if (data.event === 'audio') {
				this.play(data.name)
			}
		})
	}

	play(name) {
		this.audios[name].instance.play()
	}

	stop() {
		Object.keys(this.audios).forEach((key) => {
			this.audios[key].instance.pause()
			this.audios[key].instance.currentTime = 0
		})
	}

	setVolume(name, volume) {
		this.audios[name].instance.volume = volume
	}

	pause(name) {
		this.audios[name].instance.pause()
	}
}
