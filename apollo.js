import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const material2 = new THREE.MeshPhysicalMaterial({
  color: 0x5555ff,
  metalness: 0,
  roughness: 0
});

material2.onBeforeCompile = (shader) => {
	console.log(shader.vertexShader);
	console.log(shader.fragmentShader);
	shader.vertexShader = 
		`varying float vFresnel;
		#define STANDARD
		varying vec3 vViewPosition;
		#ifdef USE_TRANSMISSION
			varying vec3 vWorldPosition;
		#endif
		#include <common>
		#include <batching_pars_vertex>
		#include <uv_pars_vertex>
		#include <displacementmap_pars_vertex>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <normal_pars_vertex>
		#include <morphtarget_pars_vertex>
		#include <skinning_pars_vertex>
		#include <shadowmap_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>
		void main() {
			#include <uv_vertex>
			#include <color_vertex>
			#include <morphinstance_vertex>
			#include <morphcolor_vertex>
			#include <batching_vertex>
			#include <beginnormal_vertex>
			#include <morphnormal_vertex>
			#include <skinbase_vertex>
			#include <skinnormal_vertex>
			#include <defaultnormal_vertex>
			#include <normal_vertex>
			#include <begin_vertex>
			#include <morphtarget_vertex>
			#include <skinning_vertex>
			#include <displacementmap_vertex>
			#include <project_vertex>
			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			vViewPosition = - mvPosition.xyz;
			#include <worldpos_vertex>
			#include <shadowmap_vertex>
			#include <fog_vertex>
		#ifdef USE_TRANSMISSION
			vWorldPosition = worldPosition.xyz;
		#endif
			vec3 viewNormal = normalize( normalMatrix * objectNormal );
			vec3 viewPosition = normalize( (modelViewMatrix * vec4(position, 1.0)).xyz );
			vFresnel = pow(1.0 - abs(dot(viewNormal, viewPosition)), 3.0);

		}`;
		
	shader.fragmentShader = 
		`varying float vFresnel;
		#define STANDARD
		#ifdef PHYSICAL
			#define IOR
			#define USE_SPECULAR
		#endif
		uniform vec3 diffuse;
		uniform vec3 emissive;
		uniform float roughness;
		uniform float metalness;
		uniform float opacity;
		#ifdef IOR
			uniform float ior;
		#endif
		#ifdef USE_SPECULAR
			uniform float specularIntensity;
			uniform vec3 specularColor;
			#ifdef USE_SPECULAR_COLORMAP
				uniform sampler2D specularColorMap;
			#endif
			#ifdef USE_SPECULAR_INTENSITYMAP
				uniform sampler2D specularIntensityMap;
			#endif
		#endif
		#ifdef USE_CLEARCOAT
			uniform float clearcoat;
			uniform float clearcoatRoughness;
		#endif
		#ifdef USE_DISPERSION
			uniform float dispersion;
		#endif
		#ifdef USE_IRIDESCENCE
			uniform float iridescence;
			uniform float iridescenceIOR;
			uniform float iridescenceThicknessMinimum;
			uniform float iridescenceThicknessMaximum;
		#endif
		#ifdef USE_SHEEN
			uniform vec3 sheenColor;
			uniform float sheenRoughness;
			#ifdef USE_SHEEN_COLORMAP
				uniform sampler2D sheenColorMap;
			#endif
			#ifdef USE_SHEEN_ROUGHNESSMAP
				uniform sampler2D sheenRoughnessMap;
			#endif
		#endif
		#ifdef USE_ANISOTROPY
			uniform vec2 anisotropyVector;
			#ifdef USE_ANISOTROPYMAP
				uniform sampler2D anisotropyMap;
			#endif
		#endif
		varying vec3 vViewPosition;
		#include <common>
		#include <packing>
		#include <dithering_pars_fragment>
		#include <color_pars_fragment>
		#include <uv_pars_fragment>
		#include <map_pars_fragment>
		#include <alphamap_pars_fragment>
		#include <alphatest_pars_fragment>
		#include <alphahash_pars_fragment>
		#include <aomap_pars_fragment>
		#include <lightmap_pars_fragment>
		#include <emissivemap_pars_fragment>
		#include <iridescence_fragment>
		#include <cube_uv_reflection_fragment>
		#include <envmap_common_pars_fragment>
		#include <envmap_physical_pars_fragment>
		#include <fog_pars_fragment>
		#include <lights_pars_begin>
		#include <normal_pars_fragment>
		#include <lights_physical_pars_fragment>
		#include <transmission_pars_fragment>
		#include <shadowmap_pars_fragment>
		#include <bumpmap_pars_fragment>
		#include <normalmap_pars_fragment>
		#include <clearcoat_pars_fragment>
		#include <iridescence_pars_fragment>
		#include <roughnessmap_pars_fragment>
		#include <metalnessmap_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>
		void main() {
			//vec4 diffuseColor = vec4( diffuse, opacity );
			//vec3 fresnelColor = vec3(5.0, 0.0, 0.0);
			vec4 diffuseColor = vec4( mix(diffuse, diffuse * 5.0, vFresnel), opacity);
			#include <clipping_planes_fragment>
			ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
			vec3 totalEmissiveRadiance = emissive;
			#include <logdepthbuf_fragment>
			#include <map_fragment>
			#include <color_fragment>
			#include <alphamap_fragment>
			#include <alphatest_fragment>
			#include <alphahash_fragment>
			#include <roughnessmap_fragment>
			#include <metalnessmap_fragment>
			#include <normal_fragment_begin>
			#include <normal_fragment_maps>
			#include <clearcoat_normal_fragment_begin>
			#include <clearcoat_normal_fragment_maps>
			#include <emissivemap_fragment>
			#include <lights_physical_fragment>
			#include <lights_fragment_begin>
			#include <lights_fragment_maps>
			#include <lights_fragment_end>
			#include <aomap_fragment>
			vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
			vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
			#include <transmission_fragment>
			vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
			#ifdef USE_SHEEN
				float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
				outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
			#endif
			#ifdef USE_CLEARCOAT
				float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
				vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
				outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
			#endif
			#include <opaque_fragment>
			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>
			#include <dithering_fragment>
		}`;
};

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var apollo;
const loader = new GLTFLoader();
loader.load( 'public/Apollo.glb', function ( gltf ) {
		apollo = scene.add( gltf.scene );
		apollo.traverse((object) => {
		if (object.isMesh) {
			const materials = Array.isArray(object.material)
			? object.material
			: [object.material];

			for (let i = 0; i < materials.length; i++) {
				const mat = materials[i];

				materials[i].onBeforeCompile = material2.onBeforeCompile;
				/*const mat2 = new THREE.MeshBasicMaterial({
					map: mat.map // Correct way to copy the texture
				});
				materials[i] = mat2;
				console.log(mat.name);*/
				materials[i].vertexColors = false;
			}

			// Reassign the modified materials back
			object.material = Array.isArray(object.material) ? materials : materials[0];
		}
		});
		apollo.scale.setScalar(0.1);	
	}, undefined, function ( error ) {
		console.error( error );
} );

const light = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(light);

const light2 = new THREE.DirectionalLight( 0xFFFFFF, 5);
light2.position.set(-5, 10, 5);
light2.target.position.set(0, 0, 0); // aiming toward scene center
scene.add(light2);
scene.add(light2.target);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

light2.castShadow = true;

camera.setFocalLength(20);
camera.position.z = 3;
camera.position.y = 1.25;
camera.rotation.x = -0.2;

function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

var slider = document.getElementById("myRange");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
	apollo.children.forEach(element => {
		
  		element.rotation.y = this.value * 10 * (Math.PI/180);
	});
  	console.log(this.value);
}