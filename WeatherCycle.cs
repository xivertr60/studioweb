import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';

export function createBetterCar() {
  const car = new THREE.Group();

  // Car body (lower)
  const bodyLowerGeometry = new THREE.BoxGeometry(2.4, 0.5, 5);
  const bodyLowerMaterial = new THREE.MeshPhongMaterial({ color: 0x263238 });
  const bodyLower = new THREE.Mesh(bodyLowerGeometry, bodyLowerMaterial);
  bodyLower.position.y = 0.5;
  car.add(bodyLower);

  // Car body (upper/cabin)
  const bodyUpperGeometry = new THREE.BoxGeometry(1.7, 0.7, 2.5);
  const bodyUpperMaterial = new THREE.MeshPhongMaterial({ color: 0x37474f });
  const bodyUpper = new THREE.Mesh(bodyUpperGeometry, bodyUpperMaterial);
  bodyUpper.position.set(0, 1.1, 0.5);
  car.add(bodyUpper);

  // Parabrisas delantero
  const glassFrontGeometry = new THREE.BoxGeometry(1.6, 0.65, 0.08);
  const glassFrontMaterial = new THREE.MeshPhongMaterial({ color: 0x90caf9, opacity: 0.7, transparent: true });
  const glassFront = new THREE.Mesh(glassFrontGeometry, glassFrontMaterial);
  glassFront.position.set(0, 1.1, 1.4);
  glassFront.rotation.x = -Math.PI / 12;
  car.add(glassFront);

  // Parabrisas trasero
  const glassBackGeometry = new THREE.BoxGeometry(1.6, 0.65, 0.08);
  const glassBackMaterial = new THREE.MeshPhongMaterial({ color: 0x90caf9, opacity: 0.6, transparent: true });
  const glassBack = new THREE.Mesh(glassBackGeometry, glassBackMaterial);
  glassBack.position.set(0, 1.08, -1.1);
  glassBack.rotation.x = Math.PI / 10;
  car.add(glassBack);

  // Ventanas laterales
  const glassSideGeometry = new THREE.BoxGeometry(0.08, 0.65, 2.0);
  const glassSideMaterial = new THREE.MeshPhongMaterial({ color: 0xb3e5fc, opacity: 0.45, transparent: true });
  const glassLeft = new THREE.Mesh(glassSideGeometry, glassSideMaterial);
  glassLeft.position.set(-0.85, 1.1, 0.23);
  car.add(glassLeft);
  const glassRight = glassLeft.clone();
  glassRight.position.x = 0.85;
  car.add(glassRight);

  // Ruedas
  const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 24);
  const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
  const wheelPositions = [
    [1.05, 0.25, 1.8],   // front right
    [-1.05, 0.25, 1.8],  // front left
    [1.05, 0.25, -1.8],  // rear right
    [-1.05, 0.25, -1.8], // rear left
  ];
  for (const [x, y, z] of wheelPositions) {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, y, z);
    car.add(wheel);
  }

  // Parachoques delantero
  const bumperFrontGeometry = new THREE.BoxGeometry(2.4, 0.23, 0.26);
  const bumperFrontMaterial = new THREE.MeshPhongMaterial({ color: 0x757575 });
  const bumperFront = new THREE.Mesh(bumperFrontGeometry, bumperFrontMaterial);
  bumperFront.position.set(0, 0.26, 2.55);
  car.add(bumperFront);

  // Parachoques trasero
  const bumperBack = bumperFront.clone();
  bumperBack.position.z = -2.55;
  car.add(bumperBack);

  // Faros delanteros
  const headlightGeometry = new THREE.CylinderGeometry(0.13, 0.13, 0.1, 12);
  const headlightMaterial = new THREE.MeshPhongMaterial({ color: 0xffffcc, emissive: 0xffff99 });
  for (const x of [-0.55, 0.55]) {
    const light = new THREE.Mesh(headlightGeometry, headlightMaterial);
    light.rotation.x = Math.PI / 2;
    light.position.set(x, 0.5, 2.65);
    car.add(light);
  }

  // Luces traseras
  const tailLightGeometry = new THREE.CylinderGeometry(0.13, 0.13, 0.1, 12);
  const tailLightMaterial = new THREE.MeshPhongMaterial({ color: 0xff1744, emissive: 0xff1744 });
  for (const x of [-0.55, 0.55]) {
    const light = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
    light.rotation.x = Math.PI / 2;
    light.position.set(x, 0.5, -2.65);
    car.add(light);
  }

  // Espejos retrovisores
  const mirrorGeometry = new THREE.BoxGeometry(0.1, 0.13, 0.35);
  const mirrorMaterial = new THREE.MeshPhongMaterial({ color: 0xb0bec5 });
  const mirrorLeft = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
  mirrorLeft.position.set(-1.1, 1.08, 0.85);
  car.add(mirrorLeft);
  const mirrorRight = mirrorLeft.clone();
  mirrorRight.position.x = 1.1;
  car.add(mirrorRight);

  // Manijas de puerta
  const handleGeometry = new THREE.BoxGeometry(0.22, 0.06, 0.06);
  const handleMaterial = new THREE.MeshPhongMaterial({ color: 0x616161 });
  const handleLeft = new THREE.Mesh(handleGeometry, handleMaterial);
  handleLeft.position.set(-0.89, 0.9, 0.3);
  car.add(handleLeft);
  const handleRight = handleLeft.clone();
  handleRight.position.x = 0.89;
  car.add(handleRight);

  return car;
}
