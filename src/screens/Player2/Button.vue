<script setup>
import { ref } from 'vue'

const props = defineProps({
	alwaysToggled: Boolean,
	fullWidth: Boolean,
})

const toggled = ref(props.alwaysToggled)
</script>

<template>
	<button
		class="button"
		@click="alwaysToggled ? null : (toggled = !toggled)"
		:class="{ 'button--toggled': toggled, 'button--full-width': fullWidth }"
	>
		<slot />
	</button>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;
@use '@/assets/mixins' as *;

.button {
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 60px;
	padding: 24px;
	filter: drop-shadow(0 0 4px $purple);
	border: $purple 1px solid;
	width: 80px;
	height: 80px;
	color: $purple;
	@include base-text;
	transition:
		background-color 0.5s,
		color 0.5s;
	font-size: 24px;
	font-weight: 700;

	&--toggled {
		background-color: #2e254f;
	}

	&--full-width {
		width: 100%;
	}
}
</style>
