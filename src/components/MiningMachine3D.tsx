import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, Zap, Activity, Thermometer, Fan, ShieldCheck } from 'lucide-react';

interface MiningMachine3DProps {
  isMining: boolean;
  hashrate: string;
  rigName?: string;
}

export const MiningMachine3D: React.FC<MiningMachine3DProps> = ({
  isMining,
  hashrate,
  rigName = 'Antminer S21 Pro Hydro'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [coreTemp, setCoreTemp] = useState<number>(64.2);
  const [fanRpm, setFanRpm] = useState<number>(isMining ? 5820 : 1200);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 3, 10);
    cyanPointLight.position.set(2, 2, 3);
    scene.add(cyanPointLight);

    const emeraldPointLight = new THREE.PointLight(0x10b981, 3.5, 10);
    emeraldPointLight.position.set(-2, 1, 2);
    scene.add(emeraldPointLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 1.5, 8);
    amberLight.position.set(0, -2, -2);
    scene.add(amberLight);

    // Machine Group
    const machineGroup = new THREE.Group();
    scene.add(machineGroup);

    // 1. Main Chassis (Heavy Aluminum Extrusion Body)
    const chassisGeo = new THREE.BoxGeometry(3.2, 1.8, 2.2);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    machineGroup.add(chassis);

    // 2. Front Face Plate (Matte Carbon Fiber Style)
    const faceGeo = new THREE.BoxGeometry(3.24, 1.84, 0.05);
    const faceMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.95,
      roughness: 0.15
    });
    const facePlate = new THREE.Mesh(faceGeo, faceMat);
    facePlate.position.z = 1.1;
    machineGroup.add(facePlate);

    // 3. Dual High-Speed Industrial Fans (Intake Left & Right)
    const fanBlades: THREE.Group[] = [];
    const fanCylGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.1, 32);
    const fanCylMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.5,
      roughness: 0.5
    });

    [-0.85, 0.85].forEach((posX) => {
      // Fan Frame
      const ringGeo = new THREE.TorusGeometry(0.68, 0.05, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.8,
        roughness: 0.2
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(posX, 0, 1.14);
      machineGroup.add(ring);

      // Rotating Blades
      const bladeGroup = new THREE.Group();
      bladeGroup.position.set(posX, 0, 1.12);

      const hubGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16);
      const hubMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
      const hub = new THREE.Mesh(hubGeo, hubMat);
      hub.rotation.x = Math.PI / 2;
      bladeGroup.add(hub);

      for (let i = 0; i < 7; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 0.45, 0.02);
        const bladeMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          metalness: 0.6,
          roughness: 0.3
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 0.26;
        blade.rotation.z = (i * Math.PI * 2) / 7;
        blade.rotation.x = 0.35;
        bladeGroup.add(blade);
      }

      machineGroup.add(bladeGroup);
      fanBlades.push(bladeGroup);
    });

    // 4. Power Supply Unit (Top Mounted APW12 Style)
    const psuGeo = new THREE.BoxGeometry(2.8, 0.5, 1.8);
    const psuMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3
    });
    const psu = new THREE.Mesh(psuGeo, psuMat);
    psu.position.set(0, 1.15, 0);
    machineGroup.add(psu);

    // 5. LED Status Array (Neon Activity Diodes)
    const leds: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const ledGeo = new THREE.SphereGeometry(0.04, 16, 16);
      const ledMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x10b981 : 0x06b6d4
      });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(-0.25 + i * 0.1, 0.68, 1.14);
      machineGroup.add(led);
      leds.push(led);
    }

    // 6. Copper Heat Dissipation Fins (Top & Sides)
    for (let i = -12; i <= 12; i++) {
      const finGeo = new THREE.BoxGeometry(0.03, 0.25, 1.9);
      const finMat = new THREE.MeshStandardMaterial({
        color: 0xb45309,
        metalness: 0.9,
        roughness: 0.2
      });
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(i * 0.11, 0.85, 0);
      machineGroup.add(fin);
    }

    // 7. Floating Data Hash Stream Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 6;

      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = Math.random() * 0.02 + 0.005;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse drag interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      machineGroup.rotation.y += deltaX * 0.008;
      machineGroup.rotation.x += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    currentMount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Responsive Resize
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto gentle floating rotation when not dragging
      if (!isDragging) {
        machineGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.35 + 0.2;
        machineGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08 - 0.05;
      }

      // Rotate cooling fan blades
      const fanSpeed = isMining ? 0.38 : 0.05;
      fanBlades.forEach((bladeGroup, idx) => {
        bladeGroup.rotation.z += idx % 2 === 0 ? fanSpeed : -fanSpeed;
      });

      // Blink status LEDs
      if (isMining) {
        leds.forEach((led, idx) => {
          led.visible = Math.sin(elapsedTime * 12 + idx) > -0.2;
        });
      } else {
        leds.forEach((led, idx) => {
          led.visible = idx === 0;
        });
      }

      // Animate Hash Particles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i + 1] += velocities[i + 1];
        if (posArray[i + 1] > 2.5) {
          posArray[i + 1] = -2.5;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMining]);

  // Telemetry updates
  useEffect(() => {
    if (!isMining) {
      setCoreTemp(38.5);
      setFanRpm(1200);
      return;
    }

    const interval = setInterval(() => {
      setCoreTemp(prev => {
        const delta = (Math.random() - 0.49) * 0.8;
        return parseFloat(Math.min(72.5, Math.max(62.0, prev + delta)).toFixed(1));
      });
      setFanRpm(prev => {
        const delta = Math.floor((Math.random() - 0.5) * 80);
        return Math.min(6200, Math.max(5400, prev + delta));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isMining]);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-6 group select-none">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Machine Status Bar */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2.5 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-md">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-100">{rigName}</span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded">
            3nm ASIC
          </span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${isMining ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span className={isMining ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
            {isMining ? 'HASHING ACTIVE' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pointer-events-none">
        <div className="bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800/80 font-mono">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" /> Active Throughput
          </div>
          <div className="text-sm sm:text-base font-bold text-cyan-400 mt-0.5">
            {isMining ? hashrate : '0.00 TH/s'}
          </div>
        </div>

        <div className="bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800/80 font-mono">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-amber-400" /> Die Temp
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-200 mt-0.5">
            {coreTemp}°C <span className="text-[10px] text-emerald-400 font-normal">Optimal</span>
          </div>
        </div>

        <div className="bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800/80 font-mono">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Fan className="w-3 h-3 text-indigo-400 animate-spin" /> Hydro Fan
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-200 mt-0.5">
            {fanRpm} <span className="text-[10px] text-slate-500">RPM</span>
          </div>
        </div>

        <div className="bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800/80 font-mono">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Hash Efficiency
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5">
            21.5 <span className="text-[10px] text-slate-400">J/TH</span>
          </div>
        </div>
      </div>
    </div>
  );
};
