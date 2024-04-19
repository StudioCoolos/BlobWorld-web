varying vec2 vUv;

void main() {
    vUv = uv;
    vUv.y = 1.0 - vUv.y; 
    gl_Position = vec4(position, 1.0);
}