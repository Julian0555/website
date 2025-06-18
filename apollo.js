import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FresnelMaterial } from './public/extra.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var width = window.innerWidth / 200;
var height = window.innerHeight / 200;
const scene = new THREE.Scene();
const perscamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
perscamera.setFocalLength(20);
perscamera.position.z = 3;
perscamera.position.y = 1.25;
perscamera.rotation.x = -0.2;
const orthocam = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, -100, 1000 );
orthocam.zoom = 1;
orthocam.position.set(0, 0.5, -0.2);
orthocam.updateProjectionMatrix();
var camera = perscamera;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( perscamera, renderer.domElement );
controls.target.set(0.0, 1.25/8, 0);
perscamera.position.set(0, 1.25, 3);

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

				materials[i].onBeforeCompile = FresnelMaterial.onBeforeCompile;
				/*const mat2 = new THREE.MeshBasicMaterial({
					map: mat.map // Correct way to copy the texture
				});
				materials[i] = mat2;
				console.log(mat.name);*/
				materials[i].vertexColors = false;
				if (materials[i].defines == undefined) {
					materials[i].defines = {};
				};
				materials[i].defines.enableFresnel = true;
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


function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

var slider = document.getElementById("myRange");
var toggle_ortho = document.getElementById("toggle_ortho");
var toggle_fresnel = document.getElementById("toggle_fresnel");
var toggle_shading = document.getElementById("toggle_shading");
var toggle_diffuse = document.getElementById("toggle_diffuse");
var show_normals = document.getElementById("show_normals");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
	if (this.value == 36) this.value = 0;
	apollo.children.forEach(element => {
		
  		element.rotation.y = this.value * 10 * (Math.PI/180);
	});
  	console.log(this.value);
}

toggle_ortho.addEventListener('click', (event) => {
   if (toggle_ortho.checked) {
		camera = orthocam;
   }
   else {
		camera = perscamera;
   }
});   

toggle_fresnel.addEventListener('click', (event) => {
	apollo.traverse((object) => {
		if (object.isMesh) {
			const materials = Array.isArray(object.material)
			? object.material
			: [object.material];

			for (let i = 0; i < materials.length; i++) {
				if (materials[i].defines == undefined) materials[i].defines = {};
				//console.log(typeof(materials[i]));
				if (typeof(materials[i]) == typeof(THREE.MeshPhysicalMaterial)) materials[i].onBeforeCompile = FresnelMaterial.onBeforeCompile;
				materials[i].defines.enableFresnel = toggle_fresnel.checked;
				materials[i].needsUpdate = true;
			}
			object.material = Array.isArray(object.material) ? materials : materials[0];
		}
		});
});   

var bak_mats = {};
toggle_shading.addEventListener('click', (event) => {
	apollo.traverse((object) => {
		if (object.isMesh) {
			const materials = Array.isArray(object.material)
			? object.material
			: [object.material];

			if (!toggle_shading.checked) {
				bak_mats[object.id] = [];
			}

			for (let i = 0; i < materials.length; i++) {
				if (toggle_shading.checked)  {
					materials[i] = bak_mats[object.id][i];
					materials[i].onBeforeCompile = FresnelMaterial.onBeforeCompile;
					materials[i].defines.enableFresnel = toggle_fresnel.checked;
				}
				else {
					bak_mats[object.id][i] = materials[i].clone();
					materials[i] = new THREE.MeshBasicMaterial({ map: materials[i].map });
				}
				materials[i].needsUpdate = true;
			}
			object.material = Array.isArray(object.material) ? materials : materials[0];
		}
		});
});   

toggle_diffuse.addEventListener('click', (event) => {
	apollo.traverse((object) => {
		if (object.isMesh) {
			const materials = Array.isArray(object.material)
			? object.material
			: [object.material];

			for (let i = 0; i < materials.length; i++) {
				materials[i].defines.disableDiffuse = !toggle_diffuse.checked;
				materials[i].needsUpdate = true;
			}
			object.material = Array.isArray(object.material) ? materials : materials[0];
		}
		});
});   


show_normals.addEventListener('click', (event) => {
	apollo.traverse((object) => {
		if (object.isMesh) {
			const materials = Array.isArray(object.material)
			? object.material
			: [object.material];

			if (show_normals.checked) {
				bak_mats[object.id] = [];
			}

			for (let i = 0; i < materials.length; i++) {
				if (!show_normals.checked)  {
					materials[i] = bak_mats[object.id][i];
					materials[i].onBeforeCompile = FresnelMaterial.onBeforeCompile;
					materials[i].defines.enableFresnel = toggle_fresnel.checked;
				}
				else {
					bak_mats[object.id][i] = materials[i].clone();
					materials[i] = new THREE.MeshNormalMaterial({ normalMap: materials[i].normalMap });
					//materials[i].wireframe = true;
				}
				materials[i].needsUpdate = true;
			}
			object.material = Array.isArray(object.material) ? materials : materials[0];
		}
		});
}); 