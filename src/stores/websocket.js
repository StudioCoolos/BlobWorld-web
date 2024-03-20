import { defineStore } from 'pinia'

export const useWebsocketStore = defineStore('websocket', () => {
  const ws = new WebSocket('wss://blobworld-web-server.onrender.com')

  ws.onopen = function () {
    console.log('[open] Connection established')
  }

  ws.onmessage = function (event) {
    console.log(`[message] Data received from server: ${event.data}`)
  }

  /**
   * @param {Object} data
   * @param {string} data.event
   */
  function sendMessage(data) {
    ws.send(JSON.stringify(data))
  }

  function disconnect() {
    ws.close()
  }

  return { ws, sendMessage, disconnect }
})
