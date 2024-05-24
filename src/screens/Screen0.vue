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
	<button @click="handlePermissionClick">Ask permissions</button>
</template>

<style scoped></style>
