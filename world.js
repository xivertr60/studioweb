// world.js
function createGround(scene) {
  const geometry = new THREE.BoxGeometry(100, 1, 100);
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  const ground = new THREE.Mesh(geometry, material);
  ground.position.y = -0.5;
  scene.add(ground);
  return ground;
}
