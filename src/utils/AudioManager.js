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
		})
	}
	#setAudioContextReadyListener() {
		addEventListener(
			'click',
			() => {
				this.audioContextReady = true
				Object.keys(this.audios).forEach((key) => {
					const audio = this.audios[key]
					if (audio.autoplay) audio.instance.play()
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
}
