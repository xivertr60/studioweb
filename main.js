// Configuración básica
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x181818);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 4, 13);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controles de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Luces
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(-8, 12, 8);
scene.add(dirLight);

// Materiales
const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffd800, metalness: 0.6, roughness: 0.3 });
const blackMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.4 });
const glassMat = new THREE.MeshStandardMaterial({ color: 0x99bbff, transparent: true, opacity: 0.45, metalness: 0.2 });
const grayMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.5 });
const redMat = new THREE.MeshStandardMaterial({ color: 0xff2d2d, metalness: 0.5, roughness: 0.3 });
const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.2 });

// Funciones para crear partes del Lamborghini
function crearCuerpo() {
  const grupo = new THREE.Group();

  // Cuerpo principal
  const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1, 3.2), yellowMat);
  cuerpo.position.y = 1.0;
  grupo.add(cuerpo);

  // Capó
  const capo = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.34, 3.1), yellowMat);
  capo.position.set(-2.18, 1.25, 0);
  capo.rotation.z = Math.PI / 16;
  grupo.add(capo);

  // Techo
  const techo = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.45, 2.4), yellowMat);
  techo.position.set(0.2, 1.67, 0);
  techo.rotation.z = Math.PI / 60;
  grupo.add(techo);

  // Maletero trasero
  const maletero = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.32, 2.6), yellowMat);
  maletero.position.set(2.25, 1.2, 0);
  maletero.rotation.z = -Math.PI / 24;
  grupo.add(maletero);

  // Parachoques delantero
  const pd = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 3.45), blackMat);
  pd.position.set(-3.53, 0.7, 0);
  grupo.add(pd);

  // Parachoques trasero
  const pt = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 3.3), blackMat);
  pt.position.set(3.53, 0.75, 0);
  grupo.add(pt);

  // Laterales inferiores
  const lateral1 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.22, 0.3), blackMat);
  lateral1.position.set(0, 0.63, -1.65);
  grupo.add(lateral1);

  const lateral2 = lateral1.clone();
  lateral2.position.z = 1.65;
  grupo.add(lateral2);

  return grupo;
}

function crearCabina() {
  const grupo = new THREE.Group();

  // Parabrisas
  const parabrisas = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.4, 2.4), glassMat);
  parabrisas.position.set(-1, 1.65, 0);
  parabrisas.rotation.z = Math.PI / 15;
  grupo.add(parabrisas);

  // Ventanas laterales
  const ventanaIzq = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 2.1), glassMat);
  ventanaIzq.position.set(0.8, 1.67, -1.18);
  grupo.add(ventanaIzq);

  const ventanaDer = ventanaIzq.clone();
  ventanaDer.position.z = 1.18;
  grupo.add(ventanaDer);

  // Luneta trasera
  const luneta = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.35, 2.15), glassMat);
  luneta.position.set(1.55, 1.57, 0);
  luneta.rotation.z = -Math.PI / 15;
  grupo.add(luneta);

  return grupo;
}

function crearRueda() {
  const grupo = new THREE.Group();
  // Llanta
  const llanta = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.19, 12, 32), blackMat);
  llanta.rotation.x = Math.PI / 2;
  grupo.add(llanta);

  // Rin
  const rin = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.22, 20), grayMat);
  rin.rotation.x = Math.PI / 2;
  grupo.add(rin);

  // Detalles rin
  for (let i = 0; i < 5; i++) {
    const radio = 0.19;
    const ang = (i / 5) * Math.PI * 2;
    const rayo = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.18), whiteMat);
    rayo.position.set(Math.cos(ang) * radio, 0, Math.sin(ang) * radio);
    rayo.rotation.y = ang;
    grupo.add(rayo);
  }
  return grupo;
}

function crearRuedas() {
  const grupo = new THREE.Group();
  const posiciones = [
    [-2.4, 0.35, -1.3],
    [-2.4, 0.35, 1.3],
    [2.4, 0.35, -1.3],
    [2.4, 0.35, 1.3],
  ];
  for (const pos of posiciones) {
    const rueda = crearRueda();
    rueda.position.set(...pos);
    grupo.add(rueda);
  }
  return grupo;
}

function crearFaros() {
  const grupo = new THREE.Group();

  // Faros delanteros
  for (let side of [-1, 1]) {
    const faro = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.45), whiteMat);
    faro.position.set(-3.84, 1.03, side * 0.7);
    grupo.add(faro);
  }

  // Luces traseras
  for (let side of [-1, 1]) {
    const luz = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.5), redMat);
    luz.position.set(3.84, 1.03, side * 0.8);
    grupo.add(luz);
  }

  return grupo;
}

function crearSpoiler() {
  const grupo = new THREE.Group();

  // Soportes
  for (let side of [-1, 1]) {
    const soporte = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.34, 0.08), blackMat);
    soporte.position.set(3.5, 1.47, side * 0.69);
    grupo.add(soporte);
  }

  // Ala
  const ala = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.1, 0.32), blackMat);
  ala.position.set(3.5, 1.65, 0);
  grupo.add(ala);

  return grupo;
}

function crearRetrovisores() {
  const grupo = new THREE.Group();
  for (let side of [-1, 1]) {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.33), blackMat);
    base.position.set(-1.6, 1.45, side * 1.7);
    grupo.add(base);

    const espejo = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.07, 0.25), glassMat);
    espejo.position.set(-1.68, 1.47, side * 1.73);
    grupo.add(espejo);
  }
  return grupo;
}

function crearEntradaAireLateral() {
  const grupo = new THREE.Group();
  for (let side of [-1, 1]) {
    const entrada = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.32, 0.13), blackMat);
    entrada.position.set(1.2, 1.0, side * 1.69);
    entrada.rotation.z = -Math.PI / 10 * side;
    grupo.add(entrada);
  }
  return grupo;
}

function crearDetallesCapo() {
  const grupo = new THREE.Group();
  for (let side of [-1, 1]) {
    const raya = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.03, 0.13), blackMat);
    raya.position.set(-2.35, 1.32, side * 0.55);
    grupo.add(raya);
  }
  return grupo;
}

function crearLamborghini() {
  const auto = new THREE.Group();

  auto.add(crearCuerpo());
  auto.add(crearCabina());
  auto.add(crearRuedas());
  auto.add(crearFaros());
  auto.add(crearSpoiler());
  auto.add(crearRetrovisores());
  auto.add(crearEntradaAireLateral());
  auto.add(crearDetallesCapo());

  return auto;
}

// Crear y agregar el auto a la escena
const lamborghini = crearLamborghini();
scene.add(lamborghini);

// Sombra suave
renderer.shadowMap.enabled = true;
dirLight.castShadow = true;

// Responsivo
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animación
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
