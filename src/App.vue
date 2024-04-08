<script setup>
import { computed, ref } from 'vue'
import Player1 from '@/pages/Player1.vue'
import Page404 from '@/pages/404.vue'
import Player2 from '@/pages/Player2.vue'

const routes = {
	'/': Player1,
	'/player1': Player1,
	'/player2': Player2,
}

const currentRoute = ref(location.pathname)

const currentView = computed(() => {
	return routes[currentRoute.value || '/'] || Page404
})
</script>

<template>
	<component :is="currentView" />
</template>

<style scoped></style>
