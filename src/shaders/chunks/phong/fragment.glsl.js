export default /* glsl */`
ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = uColorS;
material.specularShininess = uShininess;
material.specularStrength = uKs * roughness;

IncidentLight directLight;


#if ( NUM_DIR_LIGHTS > 0 )

  DirectionalLight directionalLight;

  #pragma unroll_loop_start
  for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

    directionalLight = directionalLights[ i ];

    directLight.color = directionalLight.color;
    directLight.direction = directionalLight.direction;
    directLight.visible = true;

    RE_Direct( directLight, -vViewPosition, normal, normalize( vViewPosition ), material, reflectedLight );
  }
  #pragma unroll_loop_end

#endif

RE_IndirectDiffuse( uColorA, -vViewPosition, normal, normalize( vViewPosition ), material, reflectedLight );

`;
