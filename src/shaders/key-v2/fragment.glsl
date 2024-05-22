varying vec2 vUv;
varying vec3 vNormal;

uniform float uSpeed;
uniform float uTime;

uniform sampler2D uPortal;

void main() {


    //scale uv on the center depending on speed
    vec2 uv = vUv;
    uv -= 0.5;
    uv *= 2.0;
    uv /= uSpeed;
    uv += 0.5;

    //rotate uv on its center depending on speed
    float angle = - uTime * 15.0;
    float s = sin(angle);
    float c = cos(angle);
    mat2 rot = mat2(c, -s, s, c);
    uv -= 0.5;
    uv = rot * uv;
    uv += 0.5;

    // opacity circle made on uv at the center
    float dist = 1.0-smoothstep( 0.4, 0.6, distance(vUv, vec2(0.5)));


    vec4 portal = texture2D(uPortal, uv);
    gl_FragColor = portal;
    gl_FragColor.a *= clamp(abs(uSpeed) * 20.0, 0.0, 1.0);
    gl_FragColor.a *= dist;
    // gl_FragColor.a = 1.0;

}
