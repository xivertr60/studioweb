// Variables globales
let scene, camera, renderer;
let personaje, coche;
let keys = {};

// Iniciar escena
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaeefff);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Luz
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  // Terreno base
  const groundGeo = new THREE.BoxGeometry(50, 1, 50);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x55aa55 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -0.5;
  scene.add(ground);

  // Obstáculos
  for(let i=0; i<10; i++) {
    const obsGeo = new THREE.BoxGeometry(2, 2, 2);
    const obsMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const obs = new THREE.Mesh(obsGeo, obsMat);
    obs.position.set(Math.random()*40-20, 1, Math.random()*40-20);
    scene.add(obs);
  }

  // Personaje (cubo)
  const persGeo = new THREE.BoxGeometry(1, 2, 1);
  const persMat = new THREE.MeshLambertMaterial({ color: 0x0000ff });
  personaje = new THREE.Mesh(persGeo, persMat);
  personaje.position.set(0, 1, 0);
  scene.add(personaje);

  // Coche (cubo)
  const cocheGeo = new THREE.BoxGeometry(2, 1, 4);
  const cocheMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  coche = new THREE.Mesh(cocheGeo, cocheMat);
  coche.position.set(5, 0.5, 0);
  scene.add(coche);

  // Eventos de teclado
  window.addEventListener('keydown', (e) => { keys[e.key] = true; });
  window.addEventListener('keyup', (e) => { keys[e.key] = false; });

  animate();
}

// Movimiento del personaje
function updatePersonaje() {
  if(keys['w']) personaje.position.z -= 0.2;
  if(keys['s']) personaje.position.z += 0.2;
  if(keys['a']) personaje.position.x -= 0.2;
  if(keys['d']) personaje.position.x += 0.2;
}

// Movimiento del coche
function updateCoche() {
  if(keys['ArrowUp']) coche.position.z -= 0.4;
  if(keys['ArrowDown']) coche.position.z += 0.4;
  if(keys['ArrowLeft']) coche.position.x -= 0.4;
  if(keys['ArrowRight']) coche.position.x += 0.4;
}

function animate() {
  requestAnimationFrame(animate);

  updatePersonaje();
  updateCoche();

  camera.lookAt(personaje.position);

  renderer.render(scene, camera);
}

init();
