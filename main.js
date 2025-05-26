// GTA SA 3D DEMO - Escena básica con Three.js

// Setup básico
const container = document.getElementById('game-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222233);

const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Renderizado
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// Suelo
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x228822 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Luz
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Coche "placeholder"
const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
const carMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.set(0, 0.25, 0);
scene.add(car);

// Controles básicos del coche
let velocity = 0;
let angle = 0;
const maxSpeed = 0.15;
const turnSpeed = 0.03;

const keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function updateCar() {
  if (keys['w']) velocity = Math.min(velocity + 0.01, maxSpeed);
  else if (keys['s']) velocity = Math.max(velocity - 0.01, -maxSpeed / 2);
  else velocity *= 0.95; // fricción

  if (keys['a']) angle += turnSpeed * (velocity / maxSpeed);
  if (keys['d']) angle -= turnSpeed * (velocity / maxSpeed);

  car.rotation.y = angle;
  car.position.x += Math.sin(angle) * velocity;
  car.position.z += Math.cos(angle) * velocity;
  // Cámara sigue al coche
  camera.position.x = car.position.x - Math.sin(angle) * 5;
  camera.position.z = car.position.z - Math.cos(angle) * 5;
  camera.position.y = 2.5;
  camera.lookAt(car.position.x, car.position.y, car.position.z);
}

// Animación
function animate() {
  requestAnimationFrame(animate);
  updateCar();
  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', () => {
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
});
