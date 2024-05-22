attribute vec3 color;

// Varyings
varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec4 vWorldPosition;

void main() {
	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

	vNormal = normalize(normalMatrix * normal);
	vViewPosition = -mvPosition.xyz;
	vUv = uv;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}