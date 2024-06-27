<script setup></script>

<template>
	<div class="Screen2">
		<p class="title" data-text="Bienvenue à bord co-pilote">
			Bienvenue à bord <br />
			co-pilote
		</p>
		<img src="/images/logo.svg" alt="kapout logo" class="logo" />
	</div>
</template>

<style scoped lang="scss">
@use '@/assets/functions' as *;
@use '@/assets/mixins' as *;
@use '@/assets/variables' as *;
.Screen2 {
	display: flex;
	flex-direction: column;
	margin: 0 auto;
	align-items: center;
	text-transform: uppercase;
	text-align: center;
	color: $purple;
	@include base-text;
	gap: 16px;

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

	.logo {
		width: 80px;
	}
}
</style>
