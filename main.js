import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js';

// Crear escena, cámara y renderizador
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Cielo azul

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 80, 120);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Terreno
const terrenoGeo = new THREE.PlaneGeometry(200, 200, 64, 64);

// Modificar vértices para crear montañas y valles
for (let i = 0; i < terrenoGeo.vertices?.length || terrenoGeo.attributes.position.count; i++) {
  let z = Math.random() * 3;
  const idx = i * 3 + 2;
  if (terrenoGeo.attributes && terrenoGeo.attributes.position) {
    terrenoGeo.attributes.position.array[idx] += z;
  }
}

const terrenoMat = new THREE.MeshLambertMaterial({ color: 0x228B22, flatShading: true });
const terreno = new THREE.Mesh(terrenoGeo, terrenoMat);
terreno.rotation.x = -Math.PI / 2;
scene.add(terreno);

// Agua (lago)
const aguaGeo = new THREE.CircleGeometry(30, 64);
const aguaMat = new THREE.MeshPhongMaterial({ color: 0x1ca3ec, opacity: 0.8, transparent: true });
const agua = new THREE.Mesh(aguaGeo, aguaMat);
agua.position.set(-40, 0.1, 40);
agua.rotation.x = -Math.PI / 2;
scene.add(agua);

// Edificios
function crearEdificio(x, z, w = 6, d = 6, h = 18) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshPhongMaterial({ color: 0xc0c0c0 });
  const edificio = new THREE.Mesh(geo, mat);
  edificio.position.set(x, h / 2, z);
  scene.add(edificio);
}
crearEdificio(10, 20);
crearEdificio(18, 25, 8, 8, 30);
crearEdificio(25, 15, 6, 6, 14);

// Casas
function crearCasa(x, z) {
  const geo = new THREE.BoxGeometry(5, 4, 5);
  const mat = new THREE.MeshLambertMaterial({ color: 0xfff5e1 });
  const casa = new THREE.Mesh(geo, mat);
  casa.position.set(x, 2, z);
  scene.add(casa);
}
crearCasa(-20, -15);
crearCasa(-28, -20);

// Carretera
const carreteraGeo = new THREE.BoxGeometry(80, 0.3, 6);
const carreteraMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
const carretera = new THREE.Mesh(carreteraGeo, carreteraMat);
carretera.position.set(0, 0.2, 0);
scene.add(carretera);

// Puente
const puenteGeo = new THREE.BoxGeometry(16, 1, 5);
const puenteMat = new THREE.MeshPhongMaterial({ color: 0x888888 });
const puente = new THREE.Mesh(puenteGeo, puenteMat);
puente.position.set(-36, 1.6, 40);
scene.add(puente);

// Estatua
const estatuaGeo = new THREE.CylinderGeometry(0, 2, 10, 8);
const estatuaMat = new THREE.MeshPhongMaterial({ color: 0xb8860b });
const estatua = new THREE.Mesh(estatuaGeo, estatuaMat);
estatua.position.set(50, 5, -10);
scene.add(estatua);

// Luces
const luz = new THREE.DirectionalLight(0xffffff, 1);
luz.position.set(100, 200, 100);
scene.add(luz);

const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(luzAmbiental);

// Render loop
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
