<script setup></script>

<template>
	<div class="orientation-blocker">
		<div class="content">
			<img src="/images/rotate-phone.svg" alt="rotate phone" />
			<p>Please rotate</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.orientation-blocker {
	display: none;
	position: fixed;
	inset: 0;
	z-index: 10000;
	background-color: #333;

	@media screen and (orientation: landscape) {
		display: flex;
	}

	.content {
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		color: white;
	}
}
</style>
