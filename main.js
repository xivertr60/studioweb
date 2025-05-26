import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/controls/OrbitControls.min.js';

// TEXTURAS PÚBLICAS (puedes cambiarlas por otras)
const TEXTURAS = {
  suelo: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/grasslight-big.jpg",
  obstaculo: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/brick_diffuse.jpg",
  coche: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/uv_grid_opengl.jpg",
  personaje: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/crate.gif"
};

const loader = new THREE.TextureLoader();

// --- ESCENA, CÁMARA Y RENDER ---
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb); // color cielo de día
document.body.appendChild(renderer.domElement);

// Cielo: SkyBox sencillo
const skyGeometry = new THREE.SphereGeometry(200, 32, 32);
const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide });
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

// Cámara y controles libres
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 15, 20);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.enableZoom = true;
controls.maxPolarAngle = Math.PI / 2.05;
controls.minDistance = 5;
controls.maxDistance = 150;

// --- LUCES Y EFECTOS ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(0, 40, 0);
directionalLight.castShadow = false;
scene.add(directionalLight);

// --- CICLO DE DÍA/NOCHE ---
let time = 0; // 0 a 1 (donde 0 es medianoche, 0.5 es mediodía)
function updateDayNightCycle(delta) {
  time += delta * 0.01;
  if (time > 1) time -= 1;
  // Luz: dirección y color
  const angle = time * Math.PI * 2;
  directionalLight.position.set(Math.sin(angle) * 50, Math.cos(angle) * 50, 0);
  directionalLight.intensity = Math.max(0.1, Math.cos(angle) * 1.25);
  sky.material.color.setHSL(0.6, 0.8, Math.max(0.2, 0.6 + 0.3 * Math.cos(angle)));
  renderer.setClearColor(sky.material.color);
}

// --- SUELO CON TEXTURA ---
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorTexture = loader.load(TEXTURAS.suelo);
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(20, 20);
const floorMaterial = new THREE.MeshLambertMaterial({ map: floorTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

// --- JUGADOR ---
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshLambertMaterial({ map: loader.load(TEXTURAS.personaje) });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 1, 0);
scene.add(player);

// --- COCHE ---
const carGeometry = new THREE.BoxGeometry(2, 1, 4);
const carMaterial = new THREE.MeshLambertMaterial({ map: loader.load(TEXTURAS.coche) });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.set(5, 0.5, 0);
scene.add(car);

// --- OBSTÁCULOS CON TEXTURA ---
const obstacles = [];
function addObstacle(x, z, w = 3, h = 3) {
  const obsGeometry = new THREE.BoxGeometry(w, 2, h);
  const obsMaterial = new THREE.MeshLambertMaterial({ map: loader.load(TEXTURAS.obstaculo) });
  const obstacle = new THREE.Mesh(obsGeometry, obsMaterial);
  obstacle.position.set(x, 1, z);
  scene.add(obstacle);
  obstacles.push(obstacle);
}
addObstacle(0, 7, 6, 2);
addObstacle(-8, -5, 2, 6);
addObstacle(10, 10, 4, 4);
addObstacle(-6, 12, 3, 3);

let inCar = false;

// --- UI ---
const ui = document.getElementById('ui');
function updateUI() {
  if (inCar) {
    ui.textContent = "Conduciendo el coche. Pulsa 'E' para salir.";
  } else {
    const dist = player.position.distanceTo(car.position);
    if (dist < 2.5) {
      ui.textContent = "Cerca del coche. Pulsa 'E' para entrar.";
    } else {
      ui.textContent = "Muévete con WASD. Acércate al coche para entrar. Cámara: Mouse y Rueda.";
    }
  }
}
updateUI();

// --- CONTROLES DE PERSONAJE Y COCHE ---
let keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Entrar/salir del coche
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'e') {
    const dist = player.position.distanceTo(car.position);
    if (!inCar && dist < 2.5) {
      inCar = true;
      player.visible = false;
      updateUI();
    } else if (inCar) {
      inCar = false;
      player.position.set(
        car.position.x - Math.sin(car.rotation.y) * 2,
        1,
        car.position.z - Math.cos(car.rotation.y) * 2
      );
      player.visible = true;
      updateUI();
    }
  }
});

// --- COLISIONES ---
function checkCollision(pos, size = {x:1, z:1}) {
  for (const obs of obstacles) {
    const obsMinX = obs.position.x - obs.scale.x * 1.5;
    const obsMaxX = obs.position.x + obs.scale.x * 1.5;
    const obsMinZ = obs.position.z - obs.scale.z * 1.5;
    const obsMaxZ = obs.position.z + obs.scale.z * 1.5;
    if (
      pos.x + size.x/2 > obsMinX &&
      pos.x - size.x/2 < obsMaxX &&
      pos.z + size.z/2 > obsMinZ &&
      pos.z - size.z/2 < obsMaxZ
    ) {
      return true;
    }
  }
  return false;
}

// --- GAME LOOP ---
let lastFrame = performance.now();
function animate(now) {
  const delta = (now - lastFrame) / 1000;
  lastFrame = now;
  requestAnimationFrame(animate);

  updateDayNightCycle(delta);

  let speed = 0.1;
  let rotSpeed = 0.04;

  if (inCar) {
    // Movimiento coche
    let nextPos = car.position.clone();
    let dir = new THREE.Vector3(-Math.sin(car.rotation.y), 0, -Math.cos(car.rotation.y));
    if (keys['w']) nextPos.addScaledVector(dir, speed);
    if (keys['s']) nextPos.addScaledVector(dir, -speed);
    if (!checkCollision(nextPos, {x:2, z:4})) car.position.copy(nextPos);
    if (keys['a']) car.rotation.y += rotSpeed;
    if (keys['d']) car.rotation.y -= rotSpeed;
    // Si quieres que la cámara siga al coche, puedes actualizar los controles.target:
    if (!controls.dragging) {
      controls.target.copy(car.position);
    }
  } else {
    // Movimiento jugador
    let nextPos = player.position.clone();
    if (keys['w']) nextPos.z -= speed;
    if (keys['s']) nextPos.z += speed;
    if (keys['a']) nextPos.x -= speed;
    if (keys['d']) nextPos.x += speed;
    if (!checkCollision(nextPos, {x:1, z:1})) player.position.copy(nextPos);
    // Puedes hacer que la cámara siga al jugador:
    if (!controls.dragging) {
      controls.target.copy(player.position);
    }
  }

  updateUI();
  controls.update();
  renderer.render(scene, camera);
}
animate(performance.now());

// --- AJUSTE DE VENTANA ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
