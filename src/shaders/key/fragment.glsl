varying vec2 vUv;

// uniform vec3 uSdf0;
// uniform vec3 uSdf1;
// uniform vec3 uSdf2;
// uniform vec3 uSdf3;
// uniform vec3 uSdf4;
// uniform vec3 uSdf5;
// uniform vec3 uSdf6;
// uniform vec3 uSdf7;
// uniform vec3 uSdf8;
// uniform vec3 uSdf9;
// uniform vec3 uSdf10;
uniform float uRoundMergeRadius;
uniform vec2 uResolution;
uniform vec2 uKeyResolution;
uniform vec3 uColor;

uniform sampler2D uBackground;
uniform sampler2D uKeyOutline;

// Define a struct for the sphere data
struct Sphere {
    vec2 center;
    float radius;
};

// Declare an array of uniforms for the spheres
uniform Sphere uSpheres[10];

float merge(float shape1, float shape2){
    return min(shape1, shape2);
}

float round_merge(float shape1, float shape2, float radius){
    vec2 intersectionSpace = vec2(shape1 - radius, shape2 - radius);
    intersectionSpace = min(intersectionSpace, 0.0);
    float insideDistance = -length(intersectionSpace);
    float simpleUnion = merge(shape1, shape2);
    float outsideDistance = max(simpleUnion, radius);
    return  insideDistance + outsideDistance;
}

float sdCircle( vec2 p, float r )
{
    return length(p) - r;
}

void main() {

    vec2 uv = vUv;
    // uv.x *= uResolution.x / uResolution.y;

    vec3 resultColor = vec3(0.0);
    float result = 1.0; // Start with a max value for merging
    float mergeRadius = uRoundMergeRadius;
    float redRadius = 0.02;
    float redStep = 0.01;

    // Process each circle
    for (int i = 0; i < 10; ++i) {
        vec2 circleCenter = uSpheres[i].center;
        float circleRadius = uSpheres[i].radius;
        #ifdef IS_PLAYER1
            float sdfValue = sdCircle(uv - circleCenter, circleRadius);
        #else
            float sdfValue = sdCircle(uv - circleCenter, circleRadius - 0.01);
        #endif
        float redSdfValue = sdCircle(uv - circleCenter, redRadius);

        // Merge this circle's SDF value into the cumulative result
        result = round_merge(result, sdfValue, mergeRadius);

        // Calculate the red circle overlay
        float redValue = 1.0 - step(redStep, redSdfValue);
        // resultColor += vec3(redValue, 0.0, 0.0); // Adding only to the red channel
    }

    // Finalize result and color
    result = smoothstep(0.0, 0.01, result);
    resultColor += vec3(result); // Assuming result influences all channels equally

    // Output the final color
    vec3 background = texture2D(uBackground, uv).rgb;

    vec2 keyUv = uv.yx;

    #ifdef IS_PLAYER1
        keyUv.x -= 0.3;
        keyUv.x *= 0.75;
        keyUv.y -= 0.1;
        keyUv.y *= 1.2;
    #else
        keyUv.x += 0.4;
        keyUv.x *= 0.7;
        keyUv.y -= 0.1;
        keyUv *= 1.2;
    #endif

    vec3 keyOutline = texture2D(uKeyOutline, keyUv).rgb;

    background += keyOutline;

    resultColor = mix(uColor, background, result);
    gl_FragColor = vec4(resultColor, 1.0);

}


    // float circle1 = sdCircle(vUv - uSdf0.xy, uSdf0.z);
    // float circle2 = sdCircle(vUv - uSdf1.xy, uSdf1.z);
    // float circle3 = sdCircle(vUv - uSdf2.xy, uSdf2.z);
    // float circle4 = sdCircle(vUv - uSdf3.xy, uSdf3.z);
    // float circle5 = sdCircle(vUv - uSdf4.xy, uSdf4.z);
    // float circle6 = sdCircle(vUv - uSdf5.xy, uSdf5.z);
    // float circle7 = sdCircle(vUv - uSdf6.xy, uSdf6.z);
    // float circle8 = sdCircle(vUv - uSdf7.xy, uSdf7.z);
    // float circle9 = sdCircle(vUv - uSdf8.xy, uSdf8.z);
    // float circle10 = sdCircle(vUv - uSdf9.xy, uSdf9.z);

    // float result = round_merge(circle1, circle2, uRoundMergeRadius);
    // result = round_merge(result, circle3, uRoundMergeRadius);
    // result = round_merge(result, circle4, uRoundMergeRadius);
    // result = round_merge(result, circle5, uRoundMergeRadius);
    // result = round_merge(result, circle6, uRoundMergeRadius);
    // result = round_merge(result, circle7, uRoundMergeRadius);
    // result = round_merge(result, circle8, uRoundMergeRadius);
    // result = round_merge(result, circle9, uRoundMergeRadius);
    // result = round_merge(result, circle10, uRoundMergeRadius);
    // result = smoothstep(0.0, 0.01, result);

    // float stepValue = 0.01;
    // float redCircle1 = sdCircle(vUv - uSdf0.xy, 0.02);
    // redCircle1 = 1.0 - step( stepValue, redCircle1);
    // float redCircle2 = sdCircle(vUv - uSdf1.xy, 0.02);
    // redCircle2 = 1.0 - step( stepValue, redCircle2);
    // float redCircle3 = sdCircle(vUv - uSdf2.xy, 0.02);
    // redCircle3 = 1.0 - step( stepValue, redCircle3);
    // float redCircle4 = sdCircle(vUv - uSdf3.xy, 0.02);
    // redCircle4 = 1.0 - step( stepValue, redCircle4);
    // float redCircle5 = sdCircle(vUv - uSdf4.xy, 0.02);
    // redCircle5 = 1.0 - step( stepValue, redCircle5);
    // float redCircle6 = sdCircle(vUv - uSdf5.xy, 0.02);
    // redCircle6 = 1.0 - step( stepValue, redCircle6);
    // float redCircle7 = sdCircle(vUv - uSdf6.xy, 0.02);
    // redCircle7 = 1.0 - step( stepValue, redCircle7);
    // float redCircle8 = sdCircle(vUv - uSdf7.xy, 0.02);
    // redCircle8 = 1.0 - step( stepValue, redCircle8);
    // float redCircle9 = sdCircle(vUv - uSdf8.xy, 0.02);
    // redCircle9 = 1.0 - step( stepValue, redCircle9);
    // float redCircle10 = sdCircle(vUv - uSdf9.xy, 0.02);
    // redCircle10 = 1.0 - step( stepValue, redCircle10);
    // float redResult = redCircle1 + redCircle2 + redCircle3 + redCircle4 + redCircle5 + redCircle6 + redCircle7 + redCircle8 + redCircle9 + redCircle10;

    // gl_FragColor = vec4(vec3(result) + vec3(redResult, 0.0, 0.0), 1.0);
    // gl_FragColor.rgb += vec3(1.0 - smoothstep(0.0, 0.01, redCircle1), 0.0, 0.0);