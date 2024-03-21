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
	<OrientationBlocker />
	<div v-if="permissionsAccepted" class="rotated-content">
		<Motion />
		<Orientation />
	</div>
	<button v-else @click="handlePermissionClick">Ask permissions</button>
</template>

<style scoped>
.rotated-content {
	transform-origin: top left;
	transform: translateX(100vw) rotate(90deg);
	position: relative;
	width: 100vh;
	height: 100vw;
}
</style>
