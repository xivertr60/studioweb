import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 80, 120);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Terreno plano (sin deformación para prueba)
const terrenoGeo = new THREE.PlaneGeometry(100, 100, 1, 1);
const terrenoMat = new THREE.MeshLambertMaterial({ color: 0x228B22 });
const terreno = new THREE.Mesh(terrenoGeo, terrenoMat);
terreno.rotation.x = -Math.PI / 2;
scene.add(terreno);

// Luz
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(100, 200, 100);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
