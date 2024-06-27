<script setup>
import { ref } from 'vue'
import { gsap } from 'gsap'

import useDeviceStore from '@/stores/device.js'
import { useStepsStore } from '@/stores/steps.js'

import Button from '@/components/Button.vue'

const deviceStore = useDeviceStore()
const stepStore = useStepsStore()

const dangerImg = ref()
const rescale = ref(false)
const loadingScrew = ref(false)

const tl = gsap.timeline({ paused: true })

function handleTransitionEnter(el, done) {
	tl.to(dangerImg.value, {
		duration: 1,
		onStart: () => {
			rescale.value = true
		},
	})

	setTimeout(() => tl.play(), 2000)
}

function handleChangeMode() {
	loadingScrew.value = true

	setTimeout(() => {
		deviceStore.isWarning = false
		stepStore.setActiveStep('Screw')
	}, 2_000)
}
</script>

<template>
	<Transition appear @enter="handleTransitionEnter" name="fade">
		<div class="Warning" v-if="deviceStore.isWarning">
			<div class="wrapper" :class="{ rescale }">
				<img ref="dangerImg" class="danger" src="/images/danger.svg" alt="Danger icon" />
				<p class="text">
					PANNE DÉTECTÉE SUR<br />
					LE VÉHICULE
				</p>
			</div>
			<Button @click="handleChangeMode" class="btn" :class="{ rescale }">LANCER LE MODE RÉPARATION</Button>
			<div class="screwsLoader" :class="{ active: loadingScrew }">
				<img class="logo" src="/images/logo.svg" alt="Kapout Logo" />
			</div>
		</div>
	</Transition>
</template>

<style scoped lang="scss">
@use '@/assets/functions' as *;
@use '@/assets/mixins' as *;
@use '@/assets/variables' as *;

.Warning {
	position: absolute;
	inset: 0;
	text-align: center;
	z-index: 1000;
	background-color: rgba(255, 0, 0, 0.4);

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(50.15% 50.15% at 50% 50.15%, #55070b 0%, rgba(85, 7, 11, 0) 100%);
		z-index: -1;
	}

	.danger {
		width: vw(198px);
		height: vw(179px);
		transition: transform 0.8s $quart-bezier-de-bz;
	}

	.text {
		text-align: center;
		@include base-text;
		font-weight: 700;
		font-size: vw(24px);
		color: $red;
		transition: transform 0.8s $quart-bezier-de-bz;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		gap: vw(24px);
		animation: blink-highop 2s infinite ease-in-out;
		transition: transform 0.8s $quart-bezier-de-bz;
	}

	.btn {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, vw(-66px));
		padding: vw(24px);
		border-radius: vw(62px);
		background-color: $bg-color;
		color: $white;
		@include base-text;
		font-weight: 500;
		font-size: vw(14px);
		opacity: 0;
		transition: opacity 0.8s $quart-bezier-de-bz;
	}

	.rescale {
		&.wrapper {
			transform: translateY(vw(-62px));
		}

		.danger {
			transform: scale(0.48);
		}

		.text {
			transform: translateY(vw(-50px));
		}

		&.btn {
			opacity: 1;
		}
	}

	.screwsLoader {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #1b1430;
		transition: opacity 0.3s ease-in-out;
		opacity: 0;
		pointer-events: none;

		.logo {
			width: vw(93px);
			height: vw(59px);
			opacity: 0;
			transition: opacity 0.3s ease-in-out 0.4s;
		}

		&.active {
			opacity: 1;

			.logo {
				opacity: 1;
				animation: blink-lowop 2s infinite ease-in-out;
			}
		}
	}

	@include blink-lowop-animation;
	@include blink-highop-animation;
}
</style>
