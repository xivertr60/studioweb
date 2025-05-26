import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Suelo
const geometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x228B22 });
const floor = new THREE.Mesh(geometry, material);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Jugador (cubo)
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 1, 0); // altura del cubo
scene.add(player);

// Coche (cubo azul)
const carGeometry = new THREE.BoxGeometry(2, 1, 4);
const carMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.set(5, 0.5, 0);
scene.add(car);

// Estado del jugador
let inCar = false;

// UI
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

// Controles
let keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Entrar/salir del coche
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'e') {
    const dist = player.position.distanceTo(car.position);
    if (!inCar && dist < 2.5) {
      inCar = true;
      // Coloca al jugador dentro del coche (invisible)
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

function animate() {
  requestAnimationFrame(animate);

  let speed = 0.1;
  let rotSpeed = 0.04;

  if (inCar) {
    // Mover coche
    if (keys['w']) {
      car.position.x -= Math.sin(car.rotation.y) * speed;
      car.position.z -= Math.cos(car.rotation.y) * speed;
    }
    if (keys['s']) {
      car.position.x += Math.sin(car.rotation.y) * speed;
      car.position.z += Math.cos(car.rotation.y) * speed;
    }
    if (keys['a']) {
      car.rotation.y += rotSpeed;
    }
    if (keys['d']) {
      car.rotation.y -= rotSpeed;
    }
    // Cámara sigue el coche
    camera.position.x = car.position.x - Math.sin(car.rotation.y) * 8;
    camera.position.y = car.position.y + 7;
    camera.position.z = car.position.z - Math.cos(car.rotation.y) * 8;
    camera.lookAt(car.position.x, car.position.y, car.position.z);
  } else {
    // Mover jugador
    if (keys['w']) player.position.z -= speed;
    if (keys['s']) player.position.z += speed;
    if (keys['a']) player.position.x -= speed;
    if (keys['d']) player.position.x += speed;
    // Cámara sigue al jugador
    camera.position.x = player.position.x;
    camera.position.y = player.position.y + 10;
    camera.position.z = player.position.z + 10;
    camera.lookAt(player.position.x, player.position.y, player.position.z);
  }

  updateUI();
  renderer.render(scene, camera);
}

animate();
