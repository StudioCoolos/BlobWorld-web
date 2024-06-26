<script setup>
import { onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'

import { useActiveScreensStore } from '@/stores/activeScreens.js'

const store = useActiveScreensStore()

const step1 = ref()
const step2 = ref()
const step3 = ref()
const step4 = ref()
const step5 = ref()

const steps = ref([
	{
		component: step1,
		duration: 3,
	},
	{
		component: step2,
		duration: 3,
	},
	{
		component: step3,
		duration: 1,
	},
	{
		component: step4,
		duration: 3,
	},
	{
		component: step5,
		duration: 3,
	},
])

const activeStep = ref(0)

const timeline = gsap.timeline({ paused: true })

onMounted(() => {
	for (let i = 0; i < steps.value.length; i++) {
		const step = steps.value[i]

		timeline
			.to(step.component, {
				duration: 1,
				onStart: () => {
					activeStep.value = i
				},
				opacity: 1,
				ease: 'power3.inOut',
			})
			.to(step.component, {
				delay: step.duration,
				duration: 1,
				opacity: 0,
				ease: 'power3.inOut',
				onComplete: () => {
					if (activeStep.value === steps.value.length - 1) {
						store.setActiveScreen(3)
					}
				},
			})
	}
})

watch(
	() => store.activeScreen,
	(newVal) => {
		if (newVal === 2) {
			timeline.play()
		}
	},
)
</script>

<template>
	<div class="Screen2" :class="{ inSteps: activeStep > 0 }">
		<div class="step" ref="step1" :class="{ active: activeStep === 0 }">
			<p class="title" data-text="BIENVENUE À BORD PILOTE">BIENVENUE À BORD PILOTE</p>
			<img class="logo" src="/images/logo.svg" alt="Kapout logo" />
		</div>
		<div class="step" ref="step2" :class="{ active: activeStep === 1 }">
			<p class="title" data-text="PRESSEZ ET MAINTENEZ LES BOUTONS LATÉRAUX POUR ACTIVER LE VÉHICULE">
				PRESSEZ ET MAINTENEZ LES BOUTONS LATÉRAUX POUR ACTIVER LE VÉHICULE
			</p>
		</div>
		<div class="step step3" ref="step3" :class="{ active: activeStep === 2 }">
			<div class="controllers">
				<div v-for="(i, index) in 2" :key="index" class="controller" />
			</div>
		</div>
		<div class="step step4" ref="step4" :class="{ active: activeStep === 3 }">
			<p class="title" data-text="À L’AIDE DU GYROSCOPE DE VOTRE TÉLÉPHONE, PILOTEZ LE VÉHICULE">
				À L’AIDE DU GYROSCOPE DE VOTRE TÉLÉPHONE, PILOTEZ LE VÉHICULE
			</p>
			<img class="logo" src="/images/gyroscope.svg" alt="Gyroscope icon" />
		</div>
		<div class="step step5" ref="step5" :class="{ active: activeStep === 4 }">
			<p class="title" data-text="DRIVE SAFE">DRIVE SAFE</p>
			<img class="logo" src="/images/logo.svg" alt="Kapout logo" />
		</div>
	</div>
</template>

<style scoped lang="scss">
@use '@/assets/functions' as *;
@use '@/assets/mixins' as *;
@use '@/assets/variables' as *;

.Screen2 {
	width: 100%;
	height: 100%;
	text-transform: uppercase;
	color: $purple;
	text-align: center;

	@include base-text;
	transition: background-color 0.3s ease-in-out;

	&.inSteps {
		background-color: #010102;
	}

	.title {
		position: relative;
		top: 0;
		left: 0;
		font-size: vw(24px);
		font-weight: 700;
		z-index: 1;
		white-space: pre-line;

		&::after {
			@include clone-data-text;
			filter: blur(vw(4px));
		}
	}

	.logo {
		width: vw(63px);
		height: vw(40px);
	}

	.step {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: vw(600px);
		align-items: center;
		gap: vw(16px);
		@include absolute-centering;
		opacity: 0;
		transition: opacity 0.3s ease-in-out;

		&.active {
			opacity: 1;
		}
	}

	.step3 {
		max-width: none;
		top: auto;
		left: auto;
		transform: none;
		bottom: vw(66px);
	}

	.controllers {
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		width: 100%;
		height: fit-content;
		justify-content: space-between;
		padding: 0 vw(90px);
	}

	.controller {
		width: vw(80px);
		height: vw(80px);
		background-color: transparent;
		opacity: 0.54;
		border-radius: 50%;
		border: 2px solid #7b5dd4;
		filter: blur(vw(4px));
	}

	.step4 {
		top: auto;
		transform: translate(-50%, 0);
		bottom: vw(66px);
	}
	.step4 .logo {
		margin-top: vw(16px);
		width: vw(83px);
		height: vw(83px);
	}

	.step5 .logo {
		width: vw(88px);
		height: vw(46px);
	}
}
</style>
