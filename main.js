// main.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Agrega el suelo y el jugador usando los scripts separados
createGround(scene);
const player = createPlayer(scene);

camera.position.set(0, 5, 10);
camera.lookAt(player.position);

function animate() {
  requestAnimationFrame(animate);
  // Aquí puedes agregar controles de movimiento
  renderer.render(scene, camera);
}
animate();
