<script setup>
import Kapout from '@/components/icons/Kapout.vue'
</script>

<template>
	<div class="CarCockpit">
		<div class="direction">
			<svg class="shadow" viewBox="0 0 564 481" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M304.054 15.4632L526.602 135.436C547.504 146.704 556.558 171.91 547.604 193.903L444.945 446.035C437.814 463.549 420.788 475 401.878 475H164.371C145.574 475 128.626 463.683 121.422 446.322L16.7409 194.055C7.59438 172.013 16.6182 146.626 37.6244 135.301L259.923 15.4633C273.696 8.0382 290.28 8.0382 304.054 15.4632Z"
					fill="#0F0F20"
					stroke="black"
				/>
				<g filter="url(#filter0_f_3238_8)">
					<path
						d="M259.685 15.0231C273.607 7.51824 290.37 7.51824 304.291 15.0231L526.624 134.88C547.841 146.318 556.967 171.953 547.749 194.225L445.002 442.474C437.73 460.043 420.589 471.5 401.574 471.5H166.038C147.207 471.5 130.194 460.261 122.806 442.939L16.829 194.472C7.2963 172.123 16.3702 146.191 37.758 134.661L259.685 15.0231Z"
						fill="#0F0F20"
					/>
					<path
						d="M304.054 15.4632L526.387 135.32C547.378 146.636 556.407 171.999 547.286 194.034L444.54 442.283C437.345 459.665 420.387 471 401.574 471H166.038C147.408 471 130.576 459.88 123.266 442.743L17.2889 194.276C7.85762 172.164 16.835 146.509 37.9952 135.102L259.923 15.4633C273.696 8.0382 290.28 8.0382 304.054 15.4632Z"
						stroke="black"
					/>
				</g>
				<defs>
					<filter
						id="filter0_f_3238_8"
						x="4.15273"
						y="0.494532"
						width="556.076"
						height="479.905"
						filterUnits="userSpaceOnUse"
						color-interpolation-filters="sRGB"
					>
						<feFlood flood-opacity="0" result="BackgroundImageFix" />
						<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
						<feGaussianBlur stdDeviation="4.45" result="effect1_foregroundBlur_3238_8" />
					</filter>
				</defs>
			</svg>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use '@/assets/functions' as *;
@use '@/assets/mixins' as *;

.CarCockpit {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
	gap: vw(36px);

	.direction {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%) translateY(vw(-170px, 'small'));
		width: vw(564px, 'small');
		height: vw(472px, 'small');
	}

	.shadow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}
}
</style>
