<script setup>
import { computed, nextTick, onMounted, onUpdated, ref, watch } from 'vue'
import { gsap } from 'gsap'

import useWebsocketStore from '@/stores/websocket.js'
import useNotificationStore from '@/stores/states.js'

const isWebsocketConnected = ref(false)
const currentNotification = ref(null)

let newNotification = gsap.timeline({
	paused: true,
})
const animationProperties = {
	itemDuration: 0.5,
	itemDelay: 1,
}

const { itemDuration, itemDelay } = animationProperties

const dynamicBar = ref(null)
const notificationText = ref(null)
const statesContainer = ref(null)
const notificationTextWidth = ref(50)

const { states, add } = useNotificationStore()
const websocketStore = useWebsocketStore()

const enabledStates = computed(() => {
	return Object.keys(states).filter((state) => states[state].enabled)
})

websocketStore.ws.addEventListener('open', () => {
	isWebsocketConnected.value = true
})

websocketStore.ws.addEventListener('message', (ev) => {
	const data = JSON.parse(ev.data)

	if (data.event === 'headlights' || data.event === 'wipers') {
		currentNotification.value = data.value ? states[data.event].onTitle : states[data.event].offTitle

		if (newNotification.isActive()) {
			newNotification.pause()
			newNotification.clear()
		}

		if (data.value) {
			nextTick(() => {
				newNotification.to(statesContainer.value, { opacity: 0, duration: itemDuration })
				newNotification.to(dynamicBar.value, { opacity: 1, duration: itemDuration })
				newNotification.to(notificationTextWidth, {
					value: notificationText.value.offsetWidth + 120,
					duration: itemDuration,
					onComplete: () => {
						states[data.event].enabled = data.value
					},
				})
				newNotification.to(notificationText.value, { opacity: 1, duration: itemDuration })
				newNotification.to(dynamicBar.value, { opacity: 0, duration: itemDuration, delay: itemDelay })
				newNotification.to(statesContainer.value, { opacity: 1, duration: itemDuration })

				// reset
				newNotification.to(notificationTextWidth, { value: 50, duration: 0 })
				newNotification.to(notificationText.value, { opacity: 0, duration: 0 })
				newNotification.to(
					{},
					{
						duration: 0,
						onComplete: () => {
							newNotification.clear()
						},
					},
				)
			})
			newNotification.play()
		} else {
			newNotification.to(statesContainer.value, { opacity: 0, duration: itemDuration })
			newNotification.to(dynamicBar.value, { opacity: 1, duration: itemDuration })
			newNotification.to(notificationTextWidth, {
				value: notificationText.value.offsetWidth + 120,
				duration: itemDuration,
			})
			newNotification.to(notificationText.value, { opacity: 1, duration: itemDuration })
			newNotification.to(dynamicBar.value, { opacity: 0, duration: itemDuration, delay: itemDelay })

			// reset
			newNotification.to(notificationTextWidth, { value: 50, duration: 0 })
			newNotification.to(notificationText.value, { opacity: 0, duration: 0 })
			newNotification.to(
				{},
				{
					duration: 0,
					onComplete: () => {
						newNotification.clear()
					},
				},
			)

			newNotification.play().then(() => {
				gsap.to(statesContainer.value, { opacity: 1, duration: itemDuration })
				states[data.event].enabled = data.value
			})
		}
	}
})
</script>

<template>
	<div class="Toaster" :style="`--notification-text-width: ${notificationTextWidth}px`">
		<div class="dynamic" ref="dynamicBar">
			<span class="notificationText" ref="notificationText">{{ currentNotification }}</span>
		</div>
		<div class="statesContainer" ref="statesContainer">
			<div class="container" v-for="(state, index) in enabledStates" :key="index">
				<img class="state" :src="states[state].icon" alt="State icon" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.Toaster {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 50px;
	position: absolute;
	top: 16px;
	left: 0;
	pointer-events: none;

	.statesContainer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 16px;
		opacity: 0;
	}

	.dynamic {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 50px;
		opacity: 0;
	}

	.dynamic:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: var(--notification-text-width);
		height: 50px;
		background-color: #000;
		border-radius: 70px;
		padding: 8px;
	}

	.notificationText {
		color: #fff;
		text-align: center;
		font-family: 'League Gothic', sans-serif;
		font-size: 28px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		opacity: 0;
	}

	.container {
		padding: 8px;
		border-radius: 50%;
		background-color: red;
		position: relative;
		top: 0;
		left: 0;
		width: 30px;
		height: 30px;
	}

	.state {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 30px;
		height: 30px;
	}
}
</style>
