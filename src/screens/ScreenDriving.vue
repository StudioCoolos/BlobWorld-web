<script setup>
import Drive from '@/components/Drive.vue'
import Button from '@/components/Button.vue'
import { useDrivingStore } from '@/stores/driving.js'
import { useHour } from '@/hooks/useHour.js'
import Speed from '@/components/Speed.vue'

const drivingStore = useDrivingStore()

const { time } = useHour()
</script>

<template>
	<Drive />
	<div class="go" :class="{ active: drivingStore.isDriving }">
		<Button class="button" type="medium" theme="black-outline">GO</Button>
		<Button class="button" type="medium" theme="black-outline">GO</Button>
	</div>
	<div class="infos">
		<div class="ext">
			<div class="hour icon">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="10" cy="10" r="10" fill="black" />
					<path d="M10 1V10.5H16.5" stroke="white" stroke-linejoin="round" />
				</svg>
				<span class="time">{{ time }}</span>
			</div>
			<div class="temp icon">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M20 10C20 11.9778 19.4135 13.9112 18.3147 15.5557C17.2159 17.2002 15.6541 18.4819 13.8268 19.2388C11.9996 19.9957 9.98891 20.1937 8.0491 19.8079C6.10929 19.422 4.32746 18.4696 2.92893 17.0711C1.53041 15.6725 0.577999 13.8907 0.192147 11.9509C-0.193705 10.0111 0.00432836 8.00043 0.761205 6.17317C1.51808 4.3459 2.79981 2.78412 4.4443 1.6853C6.08879 0.58649 8.02219 -2.35852e-08 10 0V2.15631C8.44866 2.15631 6.93217 2.61633 5.64228 3.47821C4.35239 4.34008 3.34704 5.5651 2.75337 6.99835C2.1597 8.4316 2.00437 10.0087 2.30702 11.5302C2.60967 13.0518 3.35671 14.4494 4.45367 15.5463C5.55063 16.6433 6.94824 17.3903 8.46977 17.693C9.9913 17.9956 11.5684 17.8403 13.0017 17.2466C14.4349 16.653 15.6599 15.6476 16.5218 14.3577C17.3837 13.0678 17.8437 11.5513 17.8437 10H20Z"
						fill="black"
					/>
				</svg>
				<span class="temperature">16°C</span>
			</div>
		</div>
		<Speed />
	</div>
</template>

<style scoped>
.go {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 0 60px 0 60px;
	position: absolute;
	bottom: 50px;
	width: 100%;
	left: 50%;
	transform: translateX(-50%);
	box-sizing: border-box;
	pointer-events: none;
	transition: opacity 0.4s ease-in-out;

	&.active {
		opacity: 0;
	}
}

.infos {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 1;
	opacity: 0.8;
	color: #000;
	text-align: center;
	font-family: 'League Gothic', sans-serif;
	font-size: 24px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
}

.ext {
	position: absolute;
	bottom: 50px;
	left: 50%;
	transform: translateX(calc(-50% - 120px));
	display: flex;
	flex-direction: column;
	gap: 4px;
	justify-content: right;
	align-items: flex-end;
}

.icon {
	display: flex;
	flex-direction: row;
	gap: 8px;
	align-items: center;
	justify-content: right;
}

.button {
	color: #000;

	text-align: center;
	font-family: 'League Gothic', sans-serif;
	font-size: 64px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
}
</style>
