import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Sparkles, Eye, EyeOff } from 'lucide-react';

interface Islamic3DSceneProps {
  className?: string;
  isCompact?: boolean;
}

export const Islamic3DScene: React.FC<Islamic3DSceneProps> = ({
  className = '',
  isCompact = false,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x18181b, 0.045);

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- 2. LIGHTING RIG ---
    // Warm directional key light
    const keyLight = new THREE.DirectionalLight(0xfff1b0, 2.4);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Cool fill light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    // Hemisphere light (sky vs ground)
    const hemiLight = new THREE.HemisphereLight(0x10b981, 0x09090b, 0.6);
    scene.add(hemiLight);

    // Golden inner sanctum glow
    const sanctumGlow = new THREE.PointLight(0xf59e0b, 2.2, 8, 1.2);
    sanctumGlow.position.set(0, 0.8, 0);
    scene.add(sanctumGlow);

    // --- 3. PROCEDURAL PROCEDURES & TEXTURES ---
    // Create procedural arabesque gold band texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 0, 512, 64);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 24px Amiri, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 40; i < 512; i += 128) {
        ctx.fillText('لا إله إلا الله', i, 32);
      }
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, 504, 56);
    }
    const kiswahBandTexture = new THREE.CanvasTexture(canvas);
    kiswahBandTexture.wrapS = THREE.RepeatWrapping;
    kiswahBandTexture.wrapT = THREE.ClampToEdgeWrapping;
    kiswahBandTexture.repeat.set(2, 1);

    // Create radial soft contact shadow texture
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const gradient = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      gradient.addColorStop(0, 'rgba(0,0,0,0.75)');
      gradient.addColorStop(0.5, 'rgba(0,0,0,0.3)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = gradient;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

    // --- 4. PROCEDURAL 3D MODEL (COMPOSITE GROUP) ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Octagonal Marble Stepped Pedestal
    const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.2, 8);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.35,
      metalness: 0.2,
    });
    const pedestal = new THREE.Mesh(baseGeo, baseMat);
    pedestal.position.y = -0.1;
    pedestal.receiveShadow = true;
    rootGroup.add(pedestal);

    const baseTier2Geo = new THREE.CylinderGeometry(1.35, 1.45, 0.15, 8);
    const baseTier2Mat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.25,
      metalness: 0.4,
    });
    const pedestalTier2 = new THREE.Mesh(baseTier2Geo, baseTier2Mat);
    pedestalTier2.position.y = 0.05;
    pedestalTier2.receiveShadow = true;
    rootGroup.add(pedestalTier2);

    // 2. Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -0.21;
    rootGroup.add(contactShadow);

    // 3. Central Sanctum (Holy Kaaba cube motif)
    const cubeGeo = new THREE.BoxGeometry(1.3, 1.45, 1.3);
    const cubeMat = new THREE.MeshStandardMaterial({
      color: 0x111113,
      roughness: 0.4,
      metalness: 0.25,
    });
    const sanctumCube = new THREE.Mesh(cubeGeo, cubeMat);
    sanctumCube.position.y = 0.85;
    sanctumCube.castShadow = true;
    sanctumCube.receiveShadow = true;
    rootGroup.add(sanctumCube);

    // 4. Golden Calligraphy Kiswah Band
    const bandGeo = new THREE.BoxGeometry(1.32, 0.22, 1.32);
    const bandMat = new THREE.MeshStandardMaterial({
      map: kiswahBandTexture,
      color: 0xffd700,
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0x78350f,
      emissiveIntensity: 0.35,
    });
    const kiswahBand = new THREE.Mesh(bandGeo, bandMat);
    kiswahBand.position.y = 1.25;
    rootGroup.add(kiswahBand);

    // 5. Golden Arch Bevels / Pilasters on Corners
    const cornerPillarGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.45, 8);
    const goldPillarMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const corners = [
      [-0.65, -0.65],
      [0.65, -0.65],
      [0.65, 0.65],
      [-0.65, 0.65],
    ];
    corners.forEach(([cx, cz]) => {
      const pillar = new THREE.Mesh(cornerPillarGeo, goldPillarMat);
      pillar.position.set(cx, 0.85, cz);
      rootGroup.add(pillar);
    });

    // 6. Sacred Crescent Finial (Hilal) atop the sanctum
    const crescentGroup = new THREE.Group();
    crescentGroup.position.set(0, 1.85, 0);

    const torusGeo = new THREE.TorusGeometry(0.24, 0.038, 16, 32, Math.PI * 1.55);
    const crescentMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0xb45309,
      emissiveIntensity: 0.4,
    });
    const crescent = new THREE.Mesh(torusGeo, crescentMat);
    crescent.rotation.z = -Math.PI / 4;
    crescentGroup.add(crescent);

    // Star inside crescent
    const starGeo = new THREE.OctahedronGeometry(0.07, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.6,
    });
    const crescentStar = new THREE.Mesh(starGeo, starMat);
    crescentStar.position.set(0.08, 0.08, 0);
    crescentGroup.add(crescentStar);

    rootGroup.add(crescentGroup);

    // 7. Celestial Orbital Rings (Gimbal Rings with Geometric Motifs)
    const celestialGroup = new THREE.Group();
    celestialGroup.position.set(0, 0.9, 0);
    rootGroup.add(celestialGroup);

    const ring1Geo = new THREE.TorusGeometry(1.7, 0.018, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x064e3b,
      emissiveIntensity: 0.25,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    celestialGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.0, 0.015, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x78350f,
      emissiveIntensity: 0.25,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    celestialGroup.add(ring2);

    // 8. Sacred Floating Light Particles
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 1.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      particlePositions[i] = radius * Math.cos(theta) * Math.cos(phi);
      particlePositions[i + 1] = 0.4 + Math.random() * 2.2;
      particlePositions[i + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // --- 5. INTERACTION & ANIMATION LOOP ---
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    let isPointerDown = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isPointerDown = true;
      setIsInteracting(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevPointerX = clientX;
      prevPointerY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isPointerDown) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevPointerX;
      const deltaY = clientY - prevPointerY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.006;
      targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX));

      prevPointerX = clientX;
      prevPointerY = clientY;
    };

    const onPointerUp = () => {
      isPointerDown = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domEl.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Clock
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth camera damping
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      // Auto slow celestial drift when user is not manually rotating
      if (!isPointerDown) {
        targetRotationY += dt * 0.12;
      }

      rootGroup.rotation.y = currentRotationY;
      rootGroup.rotation.x = currentRotationX;

      // Independent micro-movements
      crescentStar.rotation.y += dt * 1.2;
      ring1.rotation.z += dt * 0.18;
      ring2.rotation.y += dt * -0.22;
      particles.rotation.y += dt * 0.05;

      // Gentle floating levitation
      sanctumCube.position.y = 0.85 + Math.sin(time * 1.5) * 0.03;
      kiswahBand.position.y = 1.25 + Math.sin(time * 1.5) * 0.03;
      crescentGroup.position.y = 1.85 + Math.sin(time * 1.5 + 0.3) * 0.03;
      sanctumGlow.intensity = 2.0 + Math.sin(time * 3) * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    // --- 6. CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      domEl.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domEl.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      renderer.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      baseTier2Geo.dispose();
      baseTier2Mat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      cubeGeo.dispose();
      cubeMat.dispose();
      bandGeo.dispose();
      bandMat.dispose();
      cornerPillarGeo.dispose();
      goldPillarMat.dispose();
      torusGeo.dispose();
      crescentMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      ring1Geo.dispose();
      ringMat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      kiswahBandTexture.dispose();
      shadowTexture.dispose();

      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, []);

  return (
    <div className={`relative select-none ${className}`}>
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="থ্রিডি ইসলামিক দৃশ্য (ঘুরিয়ে দেখতে ক্লিক ও ড্র্যাগ করুন)"
      />

      {/* Floating Minimalist 3D HUD Controls */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10">
        <div className="px-2 py-0.5 rounded-full bg-zinc-900/80 border border-zinc-700/60 text-[10px] text-zinc-400 font-medium backdrop-blur-xs flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
          <span>3D Sanctum</span>
        </div>
      </div>
    </div>
  );
};
