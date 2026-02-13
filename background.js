// 3D Interactive Background: Hyper-Immersive (Bloom + Speed)
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { EffectComposer } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/GlitchPass.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;
document.getElementById('bg-canvas').innerHTML = ''; // Clear old canvas if any
document.getElementById('bg-canvas').appendChild(renderer.domElement);

// --- POST PROCESSING SETUP (BLOOM + GLITCH) ---
const renderScene = new RenderPass(scene, camera);

// 1. Bloom (Neon Glow)
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0;
bloomPass.strength = 1.8; // High intensity
bloomPass.radius = 0.5;

// 2. Glitch (Cyber Disturbance)
const glitchPass = new GlitchPass();
glitchPass.goWild = false; // Random occasional glitch
glitchPass.curF = 0; // Start at 0
glitchPass.randX = 0;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(glitchPass);

// --- PARTICLES ---
const particlesCount = 400;
const particlesGeometry = new THREE.BufferGeometry();
// Use additive blending material for glow
const particlesMaterial = new THREE.PointsMaterial({
    color: 0x64ffda,
    size: 0.1, // Larger for bloom to catch
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
});

const particlePositions = new Float32Array(particlesCount * 3);
const particleVelocities = [];

for (let i = 0; i < particlesCount; i++) {
    const x = (Math.random() - 0.5) * 30;
    const y = (Math.random() - 0.5) * 30;
    const z = (Math.random() - 0.5) * 15;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    particleVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
        baseX: (Math.random() - 0.5) * 0.02,
        baseY: (Math.random() - 0.5) * 0.02,
        baseZ: (Math.random() - 0.5) * 0.02
    });
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// --- LINES ---
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x64ffda,
    transparent: true,
    opacity: 0.3, // Higher opacity to stand out against bloom
    blending: THREE.AdditiveBlending
});
let linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
scene.add(linesMesh);

// --- COMETS ---
const cometsCount = 8;
const cometsData = [];

for (let i = 0; i < cometsCount; i++) {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    const trailLength = 30;
    for (let j = 0; j < trailLength; j++) points.push(new THREE.Vector3(0, 0, 0));
    geometry.setFromPoints(points);

    // Bright white for maximum brightness/bloom
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    cometsData.push({
        mesh: line,
        active: false,
        velocity: new THREE.Vector3(),
        position: new THREE.Vector3(),
        timer: Math.random() * 200
    });
}

function resetComet(comet) {
    comet.active = true;
    comet.mesh.material.opacity = 1;
    const startX = (Math.random() - 0.5) * 50;
    const startY = (Math.random() - 0.5) * 50;
    const startZ = -5 + Math.random() * 10;
    comet.position.set(startX, startY, startZ);
    comet.velocity.set((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, 0);

    const positions = comet.mesh.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i] = startX;
        positions[i + 1] = startY;
        positions[i + 2] = startZ;
    }
    comet.mesh.geometry.attributes.position.needsUpdate = true;
}

// --- ANIMATION ---
camera.position.z = 5;

let mouseX = 0;
let mouseY = 0;
let targetSpeedY = 0;
let targetSpeedX = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Tilt Logic for Card
    const card = document.querySelector('.slide');
    if (card) {
        const tiltX = mouseY * 10; // degrees
        const tiltY = mouseX * -10;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    }
});

const clock = new THREE.Clock();

function animate() {
    // Warp Speed Effect
    // Increase velocity based on mouse distance from center
    const speedMultiplier = 1 + (Math.abs(mouseX) + Math.abs(mouseY)) * 2;

    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
        // Apply warp speed
        positions[i * 3] += particleVelocities[i].baseX * speedMultiplier;
        positions[i * 3 + 1] += particleVelocities[i].baseY * speedMultiplier;
        positions[i * 3 + 2] += particleVelocities[i].baseZ * speedMultiplier;

        // Bounce
        if (Math.abs(positions[i * 3]) > 20) particleVelocities[i].baseX *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 20) particleVelocities[i].baseY *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 10) particleVelocities[i].baseZ *= -1;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    // Lines (Optimized)
    const linePositions = [];
    const connectionDistance = 4;
    // Check fewer particles for connections to save performance with bloom
    for (let i = 0; i < particlesCount; i += 2) {
        for (let j = i + 1; j < particlesCount; j += 2) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            if (dx * dx + dy * dy + dz * dz < connectionDistance * connectionDistance) {
                linePositions.push(
                    positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                    positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                );
            }
        }
    }
    linesMesh.geometry.dispose();
    linesMesh.geometry = new THREE.BufferGeometry();
    linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    // Comets
    cometsData.forEach(comet => {
        if (!comet.active) {
            comet.timer--;
            if (comet.timer <= 0) resetComet(comet);
        } else {
            comet.position.add(comet.velocity);
            const positions = comet.mesh.geometry.attributes.position.array;
            for (let i = positions.length - 3; i >= 3; i -= 3) {
                positions[i] = positions[i - 3];
                positions[i + 1] = positions[i - 2];
                positions[i + 2] = positions[i - 1];
            }
            positions[0] = comet.position.x;
            positions[1] = comet.position.y;
            positions[2] = comet.position.z;
            comet.mesh.geometry.attributes.position.needsUpdate = true;
            if (Math.abs(comet.position.x) > 30 || Math.abs(comet.position.y) > 30) {
                comet.active = false;
                comet.mesh.material.opacity = 0;
                comet.timer = 50 + Math.random() * 150;
            }
        }
    });

    // Camera move
    scene.rotation.y = THREE.MathUtils.lerp(scene.rotation.y, mouseX * 0.1, 0.05);
    scene.rotation.x = THREE.MathUtils.lerp(scene.rotation.x, mouseY * 0.1, 0.05);

    // Use Composer for Bloom
    composer.render();
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
