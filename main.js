// Escena básica
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaadfff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(10, 20, 10);
scene.add(sunlight);

// Suelo
const groundGeometry = new THREE.PlaneGeometry(40, 40);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Cargar modelo con animación
let mixer;
const loader = new THREE.GLTFLoader();
loader.load('personaje.glb', function(gltf) {
  const model = gltf.scene;
  model.position.set(0, 0, 0);
  scene.add(model);

  // Animación
  mixer = new THREE.AnimationMixer(model);
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();
}, undefined, function(error) {
  console.error(error);
});

// Animar
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}
animate();

// Ajuste de ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
