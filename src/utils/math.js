export function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max)
}

export function lerp(current, target, interpolation) {
	return current * (1 - interpolation) + target * interpolation
}

export function lerpAngle(a, b, t) {
	const delta = ((b - a + 180) % 360) - 180
	return a + delta * t
}
