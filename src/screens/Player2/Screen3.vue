<script setup>
import { onMounted, ref } from 'vue'
import Compass from '@/components/Compass.vue'
import Button from '@/screens/Player2/Button.vue'
import useWebsocketStore from '@/stores/websocket.js'
import Throw from '@/components/Throw.vue'
import Key from '@/components/Key.vue'
import debounce from '@/utils/debounce.js'

const websocketStore = useWebsocketStore()

const helperVisible = ref(true)
const portalVisible = ref(false)
const blobThrowVisible = ref(false)

onMounted(() => {
	setTimeout(() => {
		helperVisible.value = false
	}, 5000)

	websocketStore.ws.addEventListener('message', (event) => {
		const data = JSON.parse(event.data)

		if (data.event === 'portalZone') {
			portalVisible.value = true
		}
	})
})

let isHeadlightsOn = false
function handleBubbleClick() {
	isHeadlightsOn = !isHeadlightsOn
	websocketStore.sendMessage({
		event: 'headlights',
		value: isHeadlightsOn,
	})
}

const handleKlaxonClick = debounce(() => {
	websocketStore.sendMessage({
		event: 'klaxon',
	})
}, 10000)

const handleJumpClick = debounce(() => {
	websocketStore.sendMessage({
		event: 'strike',
	})
}, 1000)

websocketStore.ws.addEventListener('message', (event) => {
	const data = JSON.parse(event.data)

	if (data.event === 'blobify') {
		blobThrowVisible.value = true
	}
})
</script>

<template>
	<div class="Screen3">
		<transition name="fade" appear>
			<div class="helper" v-if="helperVisible">
				<p>AIDEZ LE PILOTE GRÂCE AUX DIFFÉRENTES FONCTIONS DU VÉHICULE</p>
			</div>
		</transition>
		<transition name="fade">
			<Throw v-if="blobThrowVisible" />
		</transition>
		<Compass />
		<svg width="393" height="43" viewBox="0 0 393 43" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M197 0.999969C115 0.999969 60.4005 42 -4 42" stroke="url(#paint0_linear_2979_11582)" />
			<path d="M197 0.999969C279 0.999969 333.6 42 398 42" stroke="url(#paint1_linear_2979_11582)" />
			<defs>
				<linearGradient
					id="paint0_linear_2979_11582"
					x1="-4"
					y1="21.5"
					x2="197"
					y2="21.5"
					gradientUnits="userSpaceOnUse"
				>
					<stop stop-color="#D3CEE3" stop-opacity="0" />
					<stop offset="1" stop-color="#7B5DD4" />
				</linearGradient>
				<linearGradient
					id="paint1_linear_2979_11582"
					x1="398"
					y1="21.5"
					x2="197"
					y2="21.5"
					gradientUnits="userSpaceOnUse"
				>
					<stop stop-color="#D3CEE3" stop-opacity="0" />
					<stop offset="1" stop-color="#7B5DD4" />
				</linearGradient>
			</defs>
		</svg>
		<div class="buttons">
			<Button @click="handleBubbleClick"><img src="/images/purple-light-bulb.svg" alt="lightbulb logo" /></Button>
			<Button always-toggled @click="handleKlaxonClick"><img src="/images/klaxon.svg" alt="klaxon logo" /></Button>
			<Button always-toggled full-width class="jump" @click="handleJumpClick">JUMP</Button>
		</div>
		<transition name="fade">
			<Key v-if="portalVisible" />
		</transition>
	</div>
</template>

<style scoped lang="scss">
@use '@/assets/functions' as *;
@use '@/assets/mixins' as *;
@use '@/assets/variables' as *;

.Screen3 {
	color: $purple;
	font-weight: 700;
	font-size: 24px;
	line-height: 120%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;

	.helper {
		position: absolute;
		display: flex;
		inset: 0;
		align-items: center;
		justify-content: center;
		text-align: center;
		background: rgba(0, 0, 0, 0.8);
		z-index: 10;
		p {
			width: 80%;
		}
	}

	.title {
		position: relative;
		font-size: 24px;
		font-weight: 700;
		z-index: 1;

		&::after {
			@include clone-data-text;
			filter: blur(4px);
		}
	}

	.buttons {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
		grid-template-rows: repeat(2, 1fr);
		padding-bottom: 32px;

		.jump {
			grid-column: 1 / -1;
		}
	}
}
</style>
