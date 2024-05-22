// varyings
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

uniform sampler2D uSplatterNormal;
uniform vec2 uUvScale;
uniform vec2 uUvOffset;
uniform vec2 uNormalScale;

#include <phong_pars_fragment>

#include ../partials/getTangentFrame.glsl;
#include ../partials/contrast-saturation-brightness.glsl;

void main() {
	vec4 diffuseColor = vec4(uColorD, uOpacity);

	vec2 scaledUv = vUv * uUvScale + uUvOffset;

	// albedo
	// #ifdef USE_ALBEDO
	vec4 albedoMap = texture2D(uSplatterNormal, scaledUv);
	diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * albedoMap.rgb, 1.0);
	// #endif

	vec3 normal = normalize(vNormal);

	// normal
	mat3 tbn = getTangentFrame(-vViewPosition, normal, scaledUv);
	vec3 normalMap = texture2D(uSplatterNormal, scaledUv).xyz * 2.0 - 1.0;
	normalMap.xy *= uNormalScale;
	normal = normalize(tbn * normalMap);

	float roughness = 1.;
	#ifdef USE_ROUGHNESS
	roughness = texture2D(uRoughnessMap, vUv * uRoughnessRepeat).r * uRoughnessIntensity;
	#endif

	// lighting
	#include <phong_fragment>

	vec3 finalColor = (reflectedLight.directDiffuse * uKd) + (reflectedLight.indirectDiffuse * uKa) + reflectedLight.directSpecular + reflectedLight.indirectSpecular + uColorE;

	// ao
	float ao = 1.;
	#ifdef USE_AO_MAP
	ao *= (texture2D(uAOMap, vUv * uAOMapRepeat).r - 1.0) * uAOMapIntensity + 1.0;
	#endif
	#ifdef USE_VERTEX_AO
	ao *= (vColor.r - 1.) * uAOVertexIntensity + 1.0;
	#endif
	finalColor *= ao;

	// matcap
	#ifdef USE_MATCAP
	float matcapRoughness = 1.;
	#ifdef USE_MATCAP_ROUGHNESS
	vec3 matcapNoise = texture2D(uMatcapNoiseMap, vUv * uMatcapNoiseRepeat).rgb;
	matcapRoughness += (matcapNoise.r * uMatcapNoiseChannel.r + matcapNoise.g * uMatcapNoiseChannel.g + matcapNoise.b * uMatcapNoiseChannel.b) * uMatcapNoiseIntensity;
	#endif
	vec3 matcapColor = matcap(matcapRoughness);
	finalColor *= (matcapColor - 1.0) * uMatcapIntensity + 1.0;
	#endif

	// finalColor = contrastSaturationBrightness(finalColor, uContrast, uSaturation, uBrightness);

	// shadows
	finalColor *= diffuseColor.rgb;
	gl_FragColor = clamp(vec4(finalColor, diffuseColor.a), 0., 1.);

	#include <tonemapping_fragment>
	#include <colorspace_fragment>

}