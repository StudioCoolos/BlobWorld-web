export function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max)
}

export function lerp(current, target, interpolation) {
	return current * (1 - interpolation) + target * interpolation
}
