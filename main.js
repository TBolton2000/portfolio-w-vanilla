import './style.css'

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RubiksCube } from './rubiksCube';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer( {canvas: document.querySelector("#bg"), alpha: true} );

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(50);

let rubiksCube = new RubiksCube();
// rubiksCube.print();
console.log(rubiksCube);
rubiksCube.turnX(1,-1);
rubiksCube.turnY(1,-1);
rubiksCube.turnZ(1,-1);
scene.add(rubiksCube)

const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshPhongMaterial( {color: 0x000000} );
// const cube = new THREE.Mesh(geometry, material);
// const cube2 = new THREE.Mesh(geometry, material);
// cube2.position.add(new THREE.Vector3(-10, -10, 10))
// const cube3 = new THREE.Mesh(geometry, material);
// cube3.position.add(new THREE.Vector3(10, 10, -10))


// scene.add(cube, cube2, cube3);


const pointLight = new THREE.PointLight(0x808080);
pointLight.position.set(12,12,12);
const ambientLight = new THREE.AmbientLight(0x808080);
scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.005;
//   cube.rotation.z += 0.01;
  
  // controls.update();

  renderer.render(scene, camera);
}

animate();