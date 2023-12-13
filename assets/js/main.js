import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let model;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdbdbdb);
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();

loader.load(
  "../assets/models/glasses.glb",
  function (gltf) {
    model = gltf.scene;
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);

controls.update();
controls.addEventListener("change", light_update);

function light_update() {
  light.position.copy(camera.position);
}

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  if (model) {
    //model.rotation.x += 0.01;
    model.rotation.y += 0.005;
  }

  renderer.render(scene, camera);
}

animate();
