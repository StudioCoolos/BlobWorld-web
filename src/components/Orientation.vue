<script setup>
import { deviceOrientationPermission } from '@/utils/permissions.js'
import { clamp } from '@/utils/math.js'
import { useWebsocketStore } from '@/stores/websocket.js'

const websocketStore = useWebsocketStore()

function handlePermissionClick() {
  deviceOrientationPermission((event) => {
    const steering = Math.round(clamp(event.beta / 30, -1, 1) * 100) / 100
    const throttle = Math.round(clamp(event.gamma / 30, -1, 1) * 100) / 100

    const vehicleData = {
      event: 'vehicleControl',
      steering,
      throttle,
    }

    websocketStore.sendMessage(vehicleData)
  }).then((result) => console.log(result))
}
</script>

<template>
  <button @click="handlePermissionClick">Enable vehicle control</button>
</template>

<style scoped></style>
