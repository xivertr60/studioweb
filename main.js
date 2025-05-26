import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';

// --- ESCENA Y CÁMARA ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- SUELO ---
const geometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x228B22 });
const floor = new THREE.Mesh(geometry, material);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// --- JUGADOR ---
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 1, 0); // altura del cubo
scene.add(player);

// --- COCHE ---
const carGeometry = new THREE.BoxGeometry(2, 1, 4);
const carMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.set(5, 0.5, 0);
scene.add(car);

// --- OBSTÁCULOS ---
const obstacles = [];
function addObstacle(x, z, w = 3, h = 3) {
  const obsGeometry = new THREE.BoxGeometry(w, 2, h);
  const obsMaterial = new THREE.MeshBasicMaterial({ color: 0x666666 });
  const obstacle = new THREE.Mesh(obsGeometry, obsMaterial);
  obstacle.position.set(x, 1, z);
  scene.add(obstacle);
  obstacles.push(obstacle);
}
// Añade varios obstáculos:
addObstacle(0, 7, 6, 2);    // muro horizontal delante
addObstacle(-8, -5, 2, 6);  // muro vertical izquierda
addObstacle(10, 10, 4, 4);  // bloque cuadrado
addObstacle(-6, 12, 3, 3);  // otro bloque

// --- ESTADO ---
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
      ui.textContent = "Muévete con WASD. Acércate al coche para entrar.";
    }
  }
}
updateUI();

// --- CONTROLES ---
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
      // Saca al jugador del coche, cerca de la puerta
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
function animate() {
  requestAnimationFrame(animate);

  let speed = 0.1;
  let rotSpeed = 0.04;

  if (inCar) {
    // Movimiento coche
    let nextPos = car.position.clone();
    let dir = new THREE.Vector3(-Math.sin(car.rotation.y), 0, -Math.cos(car.rotation.y));
    if (keys['w']) {
      nextPos.addScaledVector(dir, speed);
    }
    if (keys['s']) {
      nextPos.addScaledVector(dir, -speed);
    }
    // Colisión coche (tamaño 2x4)
    if (!checkCollision(nextPos, {x:2, z:4})) {
      car.position.copy(nextPos);
    }
    if (keys['a']) car.rotation.y += rotSpeed;
    if (keys['d']) car.rotation.y -= rotSpeed;
    // Cámara sigue coche
    camera.position.x = car.position.x - Math.sin(car.rotation.y) * 8;
    camera.position.y = car.position.y + 7;
    camera.position.z = car.position.z - Math.cos(car.rotation.y) * 8;
    camera.lookAt(car.position.x, car.position.y, car.position.z);
  } else {
    // Movimiento jugador
    let nextPos = player.position.clone();
    if (keys['w']) nextPos.z -= speed;
    if (keys['s']) nextPos.z += speed;
    if (keys['a']) nextPos.x -= speed;
    if (keys['d']) nextPos.x += speed;
    // Colisión jugador (tamaño 1x1)
    if (!checkCollision(nextPos, {x:1, z:1})) {
      player.position.copy(nextPos);
    }
    // Cámara sigue jugador
    camera.position.x = player.position.x;
    camera.position.y = player.position.y + 10;
    camera.position.z = player.position.z + 10;
    camera.lookAt(player.position.x, player.position.y, player.position.z);
  }

  updateUI();
  renderer.render(scene, camera);
}

animate();
