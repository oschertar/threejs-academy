import * as THREE from "three";

//https://solar-system-simulator.herokuapp.com

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  125,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);

const radius = 5,
  segments = 32,
  rotation = 6;

const sphereTextureLoader = new THREE.TextureLoader();

const earth = createSphere(
  radius,
  segments,
  new THREE.MeshPhongMaterial({
    map: sphereTextureLoader.load("../assets/textures/2_no_clouds_4k.jpg"),
    bumpMap: sphereTextureLoader.load("../assets/textures/elev_bump_4k.jpg"),
    bumpScale: 0.005,
    specularMap: sphereTextureLoader.load("../assets/textures/water_4k.png"),
    specular: new THREE.Color("grey"),
  })
);
earth.rotation.y = rotation;
scene.add(earth);

// const earth = createSphere(
//   radius,
//   segments,
//   new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// );

const moon = createSphere(
  1,
  segments,
  new THREE.MeshPhongMaterial({
    map: sphereTextureLoader.load("../assets/textures/moon_texture.jpg"),
    specular: new THREE.Color("grey"),
  })
);
moon.rotation.y = rotation;

const moonOrbit = new THREE.Object3D();
scene.add(moonOrbit);
moonOrbit.add(moon);
moon.position.set(10, 0, 0);

const clouds = createClouds(radius, segments);
clouds.rotation.y = rotation;
scene.add(clouds);

const stars = createStars(90, 64);
scene.add(stars);

camera.position.z = 15;

scene.add(new THREE.AmbientLight(0x333333));

const controls = new OrbitControls(camera, renderer.domElement);

controls.update();

const animate = function () {
  earth.rotation.y += 0.0005;
  clouds.rotation.y += 0.0005;
  moonOrbit.rotation.y += 0.0005;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

window.addEventListener("resize", function () {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});

animate();

function createSphere(radius, segments, textures) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, segments),
    textures
  );
}

function createClouds(radius, segments) {
  const cloudsTextureLoader = new THREE.TextureLoader();
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius + 0.003, segments, segments),
    new THREE.MeshPhongMaterial({
      map: cloudsTextureLoader.load("../assets/textures/fair_clouds_4k.png"),
      transparent: true,
    })
  );
}

function createStars(radius, segments) {
  const startTextureLoader = new THREE.TextureLoader();
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, segments),
    new THREE.MeshBasicMaterial({
      map: startTextureLoader.load("../assets/textures/galaxy_starfield.png"),
      side: THREE.BackSide,
    })
  );
}
