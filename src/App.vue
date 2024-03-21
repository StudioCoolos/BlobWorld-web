<script setup>
import Motion from '@/components/Strike.vue'
import Orientation from '@/components/Drive.vue'
import OrientationBlocker from '@/components/OrientationBlocker.vue'
import allPermissions from '@/utils/permissions.js'
import { ref } from 'vue'

const permissionsAccepted = ref(false)

function handlePermissionClick() {
	allPermissions()
		.then((result) => {
			permissionsAccepted.value = true
			console.log(result)
		})
		.catch((reason) => {
			alert(reason)
		})
}
</script>

<template>
	<div v-if="permissionsAccepted">
		<OrientationBlocker />
		<Motion />
		<Orientation />
	</div>
	<button v-else @click="handlePermissionClick">Ask permissions</button>
</template>

<style scoped></style>
