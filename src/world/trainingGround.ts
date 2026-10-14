import * as THREE from 'three';

// Static preview of the Training Ground: turf, yard lines and a few props.
// The endless lane track replaces this in milestone 1.
export function createTrainingGround(): THREE.Group {
  const g = new THREE.Group();

  const turf = new THREE.Mesh(new THREE.PlaneGeometry(40, 80), new THREE.MeshStandardMaterial({ color: '#2f7a3a', roughness: 0.9 }));
  turf.rotation.x = -Math.PI / 2;
  turf.receiveShadow = true;
  g.add(turf);

  const lineMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  for (let z = -40; z <= 40; z += 5) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(40, 0.12), lineMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.01, z);
    g.add(line);
  }

  // tackling dummies and cones
  const dummyMat = new THREE.MeshStandardMaterial({ color: '#d43b2a' });
  const coneMat = new THREE.MeshStandardMaterial({ color: '#ff8a1f' });
  for (const [x, z] of [[-3, -6], [3, -9], [-1.5, -14]]) {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 1.6, 16), dummyMat);
    d.position.set(x, 0.8, z);
    d.castShadow = true;
    g.add(d);
  }
  for (let i = 0; i < 6; i++) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 12), coneMat);
    c.position.set(i % 2 ? 1.5 : -1.5, 0.225, -3 - i * 2);
    c.castShadow = true;
    g.add(c);
  }
  return g;
}
