<script setup>
import { useActiveScreensStore } from '@/stores/activeScreens.js'

const store = useActiveScreensStore()

function handleClick() {
	store.setActiveScreen(2)
}
</script>

<template>
	<div>test screen1</div>
	<button @click="handleClick">Change</button>
</template>

<style scoped></style>
