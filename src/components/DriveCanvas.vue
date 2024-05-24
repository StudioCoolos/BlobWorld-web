<script setup>
import { onMounted, ref } from 'vue'

const canvas = ref()

onMounted(() => {
	const ctx = canvas.value.getContext('2d')
	let width, height, dpr

	function resizeCanvas() {
		dpr = window.devicePixelRatio || 1
		width = canvas.value.width = window.innerWidth * dpr
		height = canvas.value.height = window.innerHeight * dpr
		canvas.value.style.width = window.innerWidth + 'px'
		canvas.value.style.height = window.innerHeight + 'px'
		ctx.scale(dpr, dpr)
	}

	window.addEventListener('resize', resizeCanvas)
	resizeCanvas()

	const initialGap = 50 // Initial gap between circles
	const gapIncrement = 20 // Increment of gap for each subsequent circle
	const dotRadius = 3 // Radius of the dots
	const circleDotDensity = 0.1 // Density of dots on the circles (0 < circleDotDensity <= 1)
	const speed = 3
	let movementDirection = { forward: false, backward: false, rotatingLeft: false, rotatingRight: false }

	const verticalSpline = { angle: 0, dots: [] }
	const diagonalSplines = [
		{ angle: (Math.PI / 180) * 50, dots: [] }, // 50° Diagonal
		{ angle: (Math.PI / 180) * -50, dots: [] }, // -50° Diagonal
	]

	const allDots = []
	const diagonalDots = []
	const circleDots = []

	function createDots() {
		let position = 0
		let gap = initialGap
		const maxDistance = Math.sqrt(width * width + height * height) / dpr
		while (position < maxDistance) {
			const verticalDot = { position: position, splineAngle: verticalSpline.angle }
			verticalSpline.dots.push(verticalDot)
			allDots.push(verticalDot)
			verticalSpline.dots.push({ position: -position, splineAngle: verticalSpline.angle }) // Add mirrored dot for negative positions
			allDots.push({ position: -position, splineAngle: verticalSpline.angle })

			diagonalSplines.forEach((spline) => {
				const diagonalDot = { position: position, splineAngle: spline.angle }
				spline.dots.push(diagonalDot)
				diagonalDots.push(diagonalDot)
				allDots.push(diagonalDot)
				spline.dots.push({ position: -position, splineAngle: spline.angle }) // Add mirrored dot for negative positions
				diagonalDots.push({ position: -position, splineAngle: spline.angle })
				allDots.push({ position: -position, splineAngle: spline.angle })
			})

			position += gap
			gap += gapIncrement
		}
	}

	function createCircleDots() {
		circleDots.length = 0 // Clear the previous circle dots
		let r = initialGap
		let gap = initialGap
		while (r < (Math.max(width, height) * 2) / dpr) {
			const circumference = 2 * Math.PI * r
			const numDots = Math.floor((circumference / initialGap) * circleDotDensity)
			for (let i = 0; i < numDots; i++) {
				const angle = ((2 * Math.PI) / numDots) * i
				circleDots.push({ radius: r, angle: angle })
			}
			gap += gapIncrement
			r += gap
		}
	}

	createDots()
	createCircleDots()

	function draw() {
		ctx.clearRect(0, 0, width / dpr, height / dpr)
		ctx.save()
		ctx.translate(width / (2 * dpr), height / (2 * dpr))

		// Draw circles with increasing gaps
		let r = initialGap
		let gap = initialGap
		while (r < (Math.max(width, height) * 2) / dpr) {
			ctx.beginPath()
			ctx.arc(0, 0, r, 0, Math.PI * 2)
			ctx.strokeStyle = '#58446C'
			ctx.stroke()
			gap += gapIncrement
			r += gap
		}

		// Draw vertical spline
		ctx.save()
		ctx.rotate(verticalSpline.angle)
		ctx.beginPath()
		ctx.moveTo(0, -Math.max(width, height) / dpr)
		ctx.lineTo(0, Math.max(width, height) / dpr)
		ctx.strokeStyle = '#58446C'
		ctx.stroke()
		ctx.restore()

		// Draw diagonal splines
		diagonalSplines.forEach((spline) => {
			ctx.save()
			ctx.rotate(spline.angle)
			ctx.beginPath()
			ctx.moveTo(0, -Math.max(width, height) / dpr)
			ctx.lineTo(0, Math.max(width, height) / dpr)
			ctx.strokeStyle = '#58446C'
			ctx.stroke()
			ctx.restore()
		})

		// Draw vertical spline dots
		verticalSpline.dots.forEach((dot) => {
			ctx.save()
			ctx.rotate(dot.splineAngle)
			ctx.beginPath()
			let x = 0
			let y = dot.position
			if (movementDirection.forward) {
				dot.position -= speed
				if (dot.position < -Math.max(width, height) / dpr) dot.position = Math.max(width, height) / dpr
			} else if (movementDirection.backward) {
				dot.position += speed
				if (dot.position > Math.max(width, height) / dpr) dot.position = -Math.max(width, height) / dpr
			}
			ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
			ctx.fillStyle = '#58446C'
			ctx.fill()
			ctx.restore()
		})

		// Draw diagonal spline dots
		diagonalDots.forEach((dot) => {
			ctx.save()
			ctx.rotate(dot.splineAngle)
			ctx.beginPath()
			let x = 0
			let y = dot.position
			if (movementDirection.forward) {
				dot.position -= speed
				if (dot.position < -Math.max(width, height) / dpr) dot.position = Math.max(width, height) / dpr
			} else if (movementDirection.backward) {
				dot.position += speed
				if (dot.position > Math.max(width, height) / dpr) dot.position = -Math.max(width, height) / dpr
			}
			ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
			ctx.fillStyle = '#5A5E8A'
			ctx.fill()
			ctx.restore()
		})

		// Draw free-moving circle dots
		circleDots.forEach((dot) => {
			ctx.beginPath()
			dot.angle += movementDirection.rotatingRight ? speed / 100 : movementDirection.rotatingLeft ? -speed / 100 : 0
			const x = dot.radius * Math.cos(dot.angle)
			const y = dot.radius * Math.sin(dot.angle)
			ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
			ctx.fillStyle = '#5A5E8A'
			ctx.fill()
		})

		ctx.restore()
	}

	function update() {
		// No additional updates needed for this logic
	}

	function animate() {
		update()
		draw()
		requestAnimationFrame(animate)
	}

	animate()

	// Add event listeners to change the movement direction
	window.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowUp') {
			movementDirection.forward = true
		} else if (e.key === 'ArrowDown') {
			movementDirection.backward = true
		} else if (e.key === 'ArrowLeft') {
			movementDirection.rotatingLeft = true
		} else if (e.key === 'ArrowRight') {
			movementDirection.rotatingRight = true
		}
	})

	window.addEventListener('keyup', (e) => {
		if (e.key === 'ArrowUp') {
			movementDirection.forward = false
		} else if (e.key === 'ArrowDown') {
			movementDirection.backward = false
		} else if (e.key === 'ArrowLeft') {
			movementDirection.rotatingLeft = false
		} else if (e.key === 'ArrowRight') {
			movementDirection.rotatingRight = false
		}
	})
})
</script>

<template>
	<canvas id="canvas" ref="canvas" />
	<div class="shadow" />
</template>

<style scoped>
#canvas {
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0.4;
}

.shadow {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 110vw; /* make it bigger than the viewport */
	height: 110vw; /* make it bigger than the viewport */
	transform: translate(-50%, -50%); /* center the circle */
	border-radius: 50%; /* make it a circle */
	background: radial-gradient(
		26.63% 26.63% at 50% 50.06%,
		#000 11.53%,
		rgba(0, 0, 0, 0.56) 35.56%,
		rgba(0, 0, 0, 0) 100%
	);
}
</style>
