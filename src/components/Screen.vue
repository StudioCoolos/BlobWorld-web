<script setup>
import { ref, onMounted, watch } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
	component: Object,
	isActive: Boolean,
})

const screen = ref(null)

onMounted(() => {
	if (props.isActive) {
		animateIn()
	}
})

watch(
	() => props.isActive,
	(newVal) => {
		if (newVal) {
			animateIn()
		} else {
			animateOut()
		}
	},
)

const animateIn = () => {
	gsap.fromTo(
		screen.value,
		{ opacity: 0, pointerEvents: 'none' },
		{ pointerEvents: 'all', opacity: 1, duration: 0.4, ease: 'power2.inOut', delay: 0.4 },
	)
}

const animateOut = () => {
	gsap.to(screen.value, { opacity: 0, duration: 0.2 })
}
</script>

<template>
	<div ref="screen" class="screen">
		<component :is="component" />
	</div>
</template>

<style scoped>
.screen {
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	opacity: 0;
	pointer-events: none;
	transition: opacity 1s;
}
</style>
