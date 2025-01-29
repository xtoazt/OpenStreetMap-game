import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r146/three.module.js";

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 100); // Starting position
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// Overpass API URL (adjusted for your location)
const overpassUrl = "https://overpass-api.de/api/interpreter?data=[out:json];way[\"building\"](35.7250,-78.8490,35.7260,-78.8470);out geom;";

// Load OpenStreetMap data
fetch(overpassUrl)
  .then((response) => response.json())
  .then((data) => {
    data.elements.forEach((building) => {
      if (building.type === "way") {
        const shape = new THREE.Shape();
        building.geometry.forEach((point, index) => {
          if (index === 0) {
            shape.moveTo(point.lon * 1000, point.lat * 1000);
          } else {
            shape.lineTo(point.lon * 1000, point.lat * 1000);
          }
        });

        // Extrude the building to make it 3D
        const extrudeSettings = { depth: Math.random() * 20 + 10, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      }
    });
  });

// FPS Camera Controls
let keys = {};
document.addEventListener("keydown", (e) => (keys[e.code] = true));
document.addEventListener("keyup", (e) => (keys[e.code] = false));

function moveCamera(delta) {
  if (keys["KeyW"]) camera.position.z -= delta;
  if (keys["KeyS"]) camera.position.z += delta;
  if (keys["KeyA"]) camera.position.x -= delta;
  if (keys["KeyD"]) camera.position.x += delta;
}

function animate() {
  const delta = 0.5; // Movement speed
  moveCamera(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
