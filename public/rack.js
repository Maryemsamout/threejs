import * as THREE from 'three';
import Stats from './jsm/libs/stats.module.js';
import { ColladaLoader } from './jsm/loaders/ColladaLoader.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { FontLoader } from './jsm/loaders/FontLoader.js';
import { Raycaster } from 'three';
import {TextGeometry} from './jsm/geometries/TextGeometry.js';
import {CSS2DRenderer,CSS2DObject,
} from './jsm/renderers/CSS2DRenderer.js';

let container, stats, clock, controls;
let camera, scene, renderer, mixer;

init();
animate();
function init() {
	container = document.getElementById('container');
	camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(-20, 10, -15);
	scene = new THREE.Scene();
	clock = new THREE.Clock();
	//loading(0,0,0)
	//loading(1.61,0,0) 
	//loading(0,0.97,0)  
	//loading(0,0,0.62)

	// loading(-8.5,0,0)   
	// loading(0,0,0)
	// loading(0,0.56,0)
	// loading(0.92,0,0)
	// loading(-0.92,0,0)
	// loading(1.84,0,0)
	scene.background = new THREE.Color('Silver')

	const ambientLight = new THREE.AmbientLight(0x0000ff, 0.2);
	scene.add(ambientLight);
	const pointLight = new THREE.PointLight(0x0000ff, 0.8);
	scene.add(camera);
	camera.add(pointLight);
	//
	renderer = new THREE.WebGLRenderer({ antialias: true });

	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	//

	controls = new OrbitControls(camera, renderer.domElement);
	controls.screenSpacePanning = true;
	controls.minDistance = 5;
	controls.maxDistance = 40;
	controls.target.set(0, 2, 0);
	controls.update();
	controls.enableZoom = true;

	//

	stats = new Stats();
	container.appendChild(stats.dom);

	//

	window.addEventListener('resize', onWindowResize);

}
function loading(x, y, z) {

	const loader = new ColladaLoader();
	//loader.options.convertUpAxis = true;
	loader.load('shelves.dae', function (collada) {
		const avatar = collada.scene;
		const animations = avatar.animations;
		avatar.scale.set(1.0, 1.0, 1.0);
		// console.log(collada)
		avatar.position.set(x, y, z);
		// console.log(avatar.position)
		const root = collada.scene;
		root.scale.set(0.35, 0.35, 0.35)
		scene.add(root);

		avatar.traverse(function (node) {

			if (node.isSkinnedMesh) {

				node.frustumCulled = false;

			}

		});

		mixer = new THREE.AnimationMixer(avatar);
		//	mixer.clipAction( animations[ 0 ] ).play();

		scene.add(avatar);

	});

}
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

	requestAnimationFrame(animate);

	render();
	stats.update();

}

function render() {

	const delta = clock.getDelta();

	if (mixer !== undefined) {

		mixer.update(delta);

	}

	renderer.render(scene, camera);

}
//texture
var floorTexture = new THREE.ImageUtils.loadTexture('text.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(10, 10);
var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneGeometry(18, 18, 1);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = 0.24;
floor.rotation.x = Math.PI / 2;
//floor.name = "Checkerboard Floor";
scene.add(floor);
//main
function fetchcube(Callback) {
	fetch('warehouse.json')
		.then(response => response.json())
		.then(json => Callback(null, json.config, json.lines))
		.catch(error => Callback(error, null))
}

fetchcube((error, config, lines) => {
	const geometry = new THREE.BoxGeometry(1.3, 0.75, 0.4);
	const texture = new THREE.TextureLoader().load( 'crate.gif' );
	const texture1 =new THREE.TextureLoader().load( 'jaune.jpg' );
	const texture2 = new THREE.TextureLoader().load( 'rouge.jpg' );
	const texture3 = new THREE.TextureLoader().load( 'vert.jpg' );

	lines.forEach(function (key, val) {
		//console.log(key)
		//	console.log(key.z)
		key.line.forEach(function (key1, val1) {
			//	console.log(key1)
			let y = key1.y
			let z = key.z
			let i = 0;
			key1.culumns.forEach(function (key2, val2) {
				key2.shelves.forEach(function (key3, val3) {
					loading(key1.x, key1.y, z)
						const material = new THREE.MeshBasicMaterial({
							map: texture,
						});
					//	console.log(key3.state)
					 //console.log(key3.state==="empty")
					 if(key3.state==="empty"){
						material.map = texture1;
					  }
					   else if  (key3.state==="full"){
						material.map = texture2;
					    }
					    else if(key3.state==="half-full"){
							material.map = texture3;
						}
					const cube = new THREE.Mesh(geometry, material);
					cube.position.set(key1.x, key1.y+1.94 ,z);
					scene.add(cube);
					cube.name = key3.name;
					mouse(key1.x, key1.y ,z)
					// TEXT

	  const loader = new FontLoader().load( 'optimer_bold.typeface.json' , function (font) {
		const geometry = new TextGeometry(key1.name, {
			font: font,
			size: 0.25,
			height: 1,
			curveSegments: 10,
			bevelEnabled: false,
			bevelOffset: 0,
			bevelSegments: 0.5,
			bevelSize: 0.3,
			bevelThickness: .051
		});
		const materials = [
			new THREE.MeshPhongMaterial({ color: 0xff6600 }), // front
			new THREE.MeshPhongMaterial({ color: 0x0000ff }) // side
		];
		const textMesh1 = new THREE.Mesh(geometry, materials);
		textMesh1.castShadow = true
		textMesh1.position.y += 1
		textMesh1.position.x -= 7
		textMesh1.rotation.y = -1.5
		textMesh1.position.z += z
		scene.add(textMesh1)
	});
					key1.y = key1.y + config.rack_heigth
				})
				key1.y = y
				i++,
					key1.x = key1.x + config.rack_width
			})

			key.z = key.z + config.rack_lenght
		//	console.log(key.z)
		})

		//console.log(key.z)


	});
});
//visible text with mouse
function mouse(x,y,z){
	const labelRenderer = new CSS2DRenderer();
	  labelRenderer.setSize(innerWidth, innerHeight);
	  labelRenderer.domElement.style.position = 'absolute';
	  labelRenderer.domElement.style.top = '0px';
	  labelRenderer.domElement.style.pointerEvents = 'none';
	  document.body.appendChild(labelRenderer.domElement);
	  
	  const labelDiv = document.createElement('div');
	  labelDiv.className = 'label';
	  labelDiv.style.marginTop = '-1em';
	  const label = new CSS2DObject(labelDiv);
	  label.visible = false;
	  
	  scene.add(label);
	
	  // Track mouse movement to pick objects
	  const raycaster = new THREE.Raycaster();
	  const mouse = new THREE.Vector2();
	
	  window.addEventListener('mousemove', ({ clientX, clientY }) => {
		const { innerWidth, innerHeight } = window;
	
		mouse.x = (clientX / innerWidth) * 2 - 1;
		mouse.y = -(clientY / innerHeight) * 2 + 1;
	  });
	
	  // Handle window resize
	  window.addEventListener('resize', () => {
		const { innerWidth, innerHeight } = window;
	
		renderer.setSize(innerWidth, innerHeight);
		camera.aspect = innerWidth / innerHeight;
		camera.updateProjectionMatrix();
	  });
	
	  renderer.setAnimationLoop(() => {
		controls.update();
	
		// Pick objects from view using normalized mouse coordinates
		raycaster.setFromCamera(mouse, camera);
	
		const [hovered] = raycaster.intersectObjects(scene.children);
	
		if (hovered) {
		  // Setup label
		  renderer.domElement.className = 'hovered';
		  label.visible = true;
		  labelDiv.textContent = hovered.object.name;
	
		  // Get offset from object's dimensions
		  const offset = new THREE.Vector3();
		  new THREE.Box3().setFromObject(hovered.object).getSize(offset);
	
		  // Move label over hovered element
		  label.position.set(
			hovered.object.position.x,
			offset.y / 2,
			hovered.object.position.x
		  );
		} else {
		  // Reset label
		  renderer.domElement.className = '';
		  label.visible = false;
		  labelDiv.textContent = '';
		} 
	 // Render labels
	 labelRenderer.render(scene, camera);
		 });
		}
	  