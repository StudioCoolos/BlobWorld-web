<script setup>
const props = defineProps({
	type: {
		type: String,
		validator(value) {
			return ['large', 'medium', 'small'].includes(value)
		},
	},
	theme: {
		type: String,
		validator(value) {
			return ['black', 'white', 'black-outline', 'white-outline'].includes(value)
		},
	},
})
</script>

<template>
	<button class="Button" :class="[type, theme]">
		<slot />
	</button>
</template>
<style scoped lang="scss">
@use '@/assets/functions' as *;
.Button {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	position: relative;
	border-radius: 50%;
}

.large {
	width: vw(100px);
	height: vw(100px);
}

.medium {
	width: vw(90px);
	height: vw(90px);
}

.small {
	width: vw(80px);
	height: vw(80px);
}

.black {
	background-color: #000;
	color: #fff;

	& > * {
		stroke: #fff;
	}
}

.white {
	background-color: #fff;
	color: #000;

	& > * {
		stroke: #000;
	}
}

.black-outline {
	background-color: transparent;
	color: #000;
	border: 3px solid #000;
}

.white-outline {
	background-color: transparent;
	color: #fff;
	border: 3px solid #fff;
}
</style>
