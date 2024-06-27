<script setup>
import allPermissions from '@/utils/permissions.js'
import { ref } from 'vue'
import { useActiveScreensStore } from '@/stores/activeScreens.js'

const permissionsAccepted = ref(false)

const store = useActiveScreensStore()

function handlePermissionClick() {
	allPermissions()
		.then((result) => {
			permissionsAccepted.value = true
			console.log(result)
			store.setActiveScreen(1)
		})
		.catch((reason) => {
			alert(reason)
		})
}
</script>

<template>
	<div class="Screen0">
		<button class="btn" @click="handlePermissionClick">Autoriser le gyroscope</button>
	</div>
</template>

<style scoped>
.Screen0 {
	position: relative;
	z-index: 2;
	.btn {
		padding: 8px 16px;
		border-radius: 8px;
		color: white;
		background-color: #000;
	}
}
</style>
