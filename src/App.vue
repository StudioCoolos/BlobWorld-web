<script setup>
import { computed, ref } from 'vue'
import Player1 from '@/pages/Player1/Player1.vue'
import NotFound from '@/pages/404/NotFound.vue'
import Player2 from '@/pages/Player2/Player2.vue'

const routes = {
	'/': Player1,
	'/player1': Player1,
	'/player2': Player2
}

const currentRoute = ref(window.location.hash)

window.addEventListener('hashchange', () => {
	currentRoute.value = window.location.hash
})

const currentView = computed(() => {
	return routes[currentRoute.value.slice(1) || "/"] || NotFound
})
</script>

<template>
	<component :is="currentView" />
</template>

<style scoped></style>
