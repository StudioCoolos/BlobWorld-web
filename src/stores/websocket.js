import { defineStore } from 'pinia'
import { ref } from 'vue'

const useWebsocketStore = defineStore('websocket', () => {
	const ws = ref(new WebSocket('wss://blobworld-web-server.onrender.com'))

	ws.value.onopen = function () {
		console.log('[open] Connection established')
		ws.value.send('web')
	}

	ws.value.onmessage = function (event) {
		console.log(`[message] Data received from server: ${event.data}`)
	}

	/**
	 * @param {Object} data
	 * @param {string} data.event
	 */
	function sendMessage(data) {
		ws.value.send(JSON.stringify(data))
	}

	function disconnect() {
		ws.value.close()
	}

	return { ws, sendMessage, disconnect }
})

export default useWebsocketStore
