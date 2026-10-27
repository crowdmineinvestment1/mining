import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Cpu, Zap, Activity, HardDrive, ShieldCheck, CheckCircle2, 
  Play, Pause, ArrowRight, RefreshCw, Eye, Layers, Box, Globe, ChevronRight, Sparkles,
  Users, Award, TrendingUp, Clock, HelpCircle, BarChart2, Volume2, VolumeX, Maximize2
} from 'lucide-react';

interface MiningExplainer3DProps {
  isMining?: boolean;
  onNavigate?: (page: string) => void;
}

export const MiningExplainer3D: React.FC<MiningExplainer3DProps> = ({ isMining = true, onNavigate }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [xrayMode, setXrayMode] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<'orbit' | 'hardware' | 'network' | 'ledger'>('orbit');
  
  // Real-time simulated telemetry
  const [liveHashrate, setLiveHashrate] = useState<number>(110.4);
  const [solvedBlocks, setSolvedBlocks] = useState<number>(142);
  const [currentBlockNonce, setCurrentBlockNonce] = useState<string>('0x000000008f4c2e');
  const [activeMinersInPool, setActiveMinersInPool] = useState<number>(18420);

  // CHAPTERS embodying the exact briefing text from Eunji
  const CHAPTERS = [
    {
      id: 0,
      badge: 'WELCOME TO CROWDMINE',
      title: 'Forefront of the Cryptocurrency Revolution',
      subtitle: 'Harnessing the Power of Mining for Financial Growth',
      quote: 'Crowd Mine Investment: We are proud to be at the forefront of the cryptocurrency revolution, helping our clients harness the power of cryptocurrency mining for financial growth.',
      body: 'Our mission is to provide a seamless and profitable mining experience, enabling both beginners and experienced investors to tap into the lucrative world of digital currencies with zero hardware hassle or electric overhead.',
      icon: Sparkles,
      color: 'emerald',
      metrics: [
        { label: 'Global Capacity', value: '240,000 TH/s' },
        { label: 'Energy Source', value: '100% Geothermal & Hydro' },
        { label: 'Active Investors', value: '50,000+' }
      ],
      sceneMode: 'intro'
    },
    {
      id: 1,
      badge: 'FUNDAMENTALS OF MINING',
      title: 'What is Cryptocurrency Mining?',
      subtitle: 'Decentralized Proof-of-Work & Ledger Verification',
      quote: 'Cryptocurrency mining is the process through which new cryptocurrency transactions are verified and added to the blockchain, the decentralized ledger that underpins all digital currencies.',
      body: 'In simple terms, mining involves using powerful computers to solve complex mathematical problems, which in turn validate transactions and secure the network. Miners are rewarded with newly minted coins or tokens for their efforts, which can then be held or traded on various exchanges.',
      icon: Box,
      color: 'cyan',
      metrics: [
        { label: 'Algorithm', value: 'Bitcoin SHA-256' },
        { label: 'Block Reward', value: '3.125 BTC + Fees' },
        { label: 'Consensus', value: 'Proof-of-Work' }
      ],
      sceneMode: 'mining_math'
    },
    {
      id: 2,
      badge: 'HARDWARE EXCELLENCE',
      title: 'Latest High-Performance Mining Hardware',
      subtitle: 'Maximum Computational Efficiency & Lower Operating Costs',
      quote: 'We invest in the latest mining hardware to ensure maximum efficiency and profitability for our clients. Our equipment is optimized for high performance, allowing us to mine digital currencies more effectively and at lower operational costs.',
      body: 'Crowd Mine deploys industrial Antminer S21 Pro Hydro nodes, WhatsMiner liquid clusters, and specialized GPU pods. Immersion hydro-cooling lowers chip junction temperatures to 34°C, extending hardware lifespan and maintaining a stellar 21.5 Joules/TH efficiency.',
      icon: Cpu,
      color: 'amber',
      metrics: [
        { label: 'Rig Standard', value: 'Antminer S21 Pro Hydro' },
        { label: 'Cooling Tech', value: 'Immersion Liquid Hydro' },
        { label: 'Power Ratio', value: '21.5 J / TH' }
      ],
      sceneMode: 'hardware'
    },
    {
      id: 3,
      badge: 'SHARED COMPUTATIONAL POWER',
      title: 'Mining Pool Integration for Regular Payouts',
      subtitle: 'Combining Global Hashrates to Secure Blocks Consistently',
      quote: 'By joining a mining pool through our platform, clients can increase their chances of successfully mining new blocks and earning rewards. We combine resources with other miners, making it possible to receive regular payouts, even for those with limited hardware.',
      body: 'Rather than facing the extreme variance of solo mining, your compute power is seamlessly aggregated with global mining pools including F2Pool and Braiins Pool. When our collective cluster solves a block, rewards are mathematically split and distributed daily to your personal balance.',
      icon: Users,
      color: 'indigo',
      metrics: [
        { label: 'Pool Architecture', value: 'PPS+ / FPPS Shared' },
        { label: 'Distribution Cycle', value: 'Daily Every 24 Hours' },
        { label: 'Participant Scale', value: '18,000+ Linked Nodes' }
      ],
      sceneMode: 'pool'
    },
    {
      id: 4,
      badge: '24/7 TECHNICAL ASSURANCE',
      title: 'Around-the-Clock Monitoring & Zero Downtime',
      subtitle: 'Industrial Reliability Engineered by Senior Hardware Architects',
      quote: 'Our team of experts is available around the clock to monitor mining operations and address any technical issues that may arise. This ensures a smooth and continuous mining experience, with minimal downtime.',
      body: 'Autonomous AI diagnostics continuously inspect thermal dissipation, fan speeds, hashboard voltages, and network difficulty. Any hashboard anomaly is instantly isolated and rerouted without interrupting investor yield generation.',
      icon: Activity,
      color: 'emerald',
      metrics: [
        { label: 'Facility Uptime', value: '99.98% SLA' },
        { label: 'Response Protocol', value: '< 60 Seconds Automated' },
        { label: 'Data Center Locations', value: 'Iceland · Quebec · Sweden' }
      ],
      sceneMode: 'operations'
    },
    {
      id: 5,
      badge: 'FULL FINANCIAL AUDITABILITY',
      title: 'Radical Transparency & Real-Time Performance',
      subtitle: 'Inspect Hashrates, Block Discoveries, and Earnings Live',
      quote: 'We believe in maintaining transparency with our clients. Our operations are fully secure, and we provide detailed reports of mining activities, earnings, and performance. You can always access your account and monitor your progress in real-time.',
      body: 'Every single satoshi credited to your portfolio corresponds to a verifiable on-chain blockchain transaction. You have complete transparency into your portfolio with real-time analytics, instant deposit crediting, and zero hidden clearance fees.',
      icon: ShieldCheck,
      color: 'cyan',
      metrics: [
        { label: 'Verification', value: 'On-Chain Ledger Hash' },
        { label: 'Reporting', value: 'Real-Time Telemetry' },
        { label: 'Custody', value: 'Institutional Cold Vaults' }
      ],
      sceneMode: 'transparency'
    },
    {
      id: 6,
      badge: 'STRATEGIC OPTIMIZATION',
      title: 'Personalized Guidance & Adaptive ROI Strategies',
      subtitle: 'Dynamic Yield Switching to Mine the Most Profitable Digital Assets',
      quote: 'Cryptocurrency mining can be intimidating, but we are here to help you every step of the way. Our team offers personalized guidance and resources to help you understand the mining process, optimize your investments, and make informed decisions about your mining strategy.',
      body: 'With our experience and the right technology, we help our clients maximize their returns on investment. We continually adjust our strategies to ensure that you are mining the most profitable cryptocurrencies at any given time, whether Bitcoin, Kaspa, or alternative high-yield proof-of-work assets.',
      icon: TrendingUp,
      color: 'amber',
      metrics: [
        { label: 'Guidance', value: '1-on-1 Portfolio Concierge' },
        { label: 'Multi-Asset Support', value: 'BTC, KAS, ETC, LTC' },
        { label: 'Profit Re-allocation', value: 'Auto-Switching Engine' }
      ],
      sceneMode: 'adaptive'
    },
    {
      id: 7,
      badge: 'WHY CHOOSE CROWDMINE',
      title: 'Expertise, Reliability, Customer-Centric & Growth',
      subtitle: 'Your Trusted Partner in Navigating the World of Cryptocurrency',
      quote: 'At Crowd Mine Investment, we are not just another mining company; we are your trusted partner in navigating the exciting world of cryptocurrency. Whether you’re just starting your journey or looking to optimize your mining operations, we’re here to help you succeed.',
      body: '1. Expertise: Industry professionals with years of experience in high-density computing.\n2. Reliability: Mining operations running 24/7 so investments are always working.\n3. Customer-Centric: Tailored packages designed for your individual investment goals.\n4. Growth-Oriented: Continuously upgrading hardware to keep you ahead of the curve.',
      icon: Award,
      color: 'purple',
      metrics: [
        { label: 'Pillars', value: 'Expertise · Reliability · Care' },
        { label: 'Minimum Entry', value: 'From $10 USD' },
        { label: 'Disbursement', value: 'Standard Bank Wire / Crypto' }
      ],
      sceneMode: 'why_choose'
    }
  ];

  // Sound synthesizer for cybernetic UI feedback
  const playChime = (freq = 440) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio context ignored if blocked
    }
  };

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % CHAPTERS.length);
    }, 11000);
    return () => clearInterval(timer);
  }, [isAutoPlay, CHAPTERS.length]);

  // Live telemetry ticker interval
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveHashrate(prev => parseFloat((110.0 + (Math.random() - 0.49) * 3).toFixed(2)));
      setActiveMinersInPool(prev => Math.floor(18400 + Math.random() * 80));
      if (Math.random() > 0.6) {
        setSolvedBlocks(prev => prev + 1);
        setCurrentBlockNonce('0x' + Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0'));
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // --------------------------------------------------------------------------
  // THREE.JS 3D WORLD
  // --------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.032);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2.0, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. High-Tech Dynamic Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const emeraldKeyLight = new THREE.PointLight(0x10b981, 4.5, 20);
    emeraldKeyLight.position.set(-4, 3, 5);
    scene.add(emeraldKeyLight);

    const cyanRimLight = new THREE.PointLight(0x06b6d4, 4.5, 20);
    cyanRimLight.position.set(4, 2, 5);
    scene.add(cyanRimLight);

    const goldAccentLight = new THREE.PointLight(0xf59e0b, 3.5, 15);
    goldAccentLight.position.set(0, 4, -2);
    scene.add(goldAccentLight);

    const purpleBottomLight = new THREE.PointLight(0xa855f7, 2.5, 12);
    purpleBottomLight.position.set(0, -3, 2);
    scene.add(purpleBottomLight);

    // 3. Central Pivot Master Group
    const masterWorldGroup = new THREE.Group();
    scene.add(masterWorldGroup);

    // =========================================================================
    // SUB-SCENE 1: DETAILED ASIC MINER HARDWARE RIG (Center)
    // =========================================================================
    const rigGroup = new THREE.Group();
    masterWorldGroup.add(rigGroup);

    // Main Chassis
    const chassisGeo = new THREE.BoxGeometry(3.4, 1.85, 2.2);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.88,
      roughness: 0.22,
      transparent: true,
      opacity: xrayMode ? 0.35 : 1.0,
      wireframe: xrayMode
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    rigGroup.add(chassis);

    // Front Bezel Plate
    const faceGeo = new THREE.BoxGeometry(3.44, 1.88, 0.06);
    const faceMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.95,
      roughness: 0.15,
      transparent: true,
      opacity: xrayMode ? 0.2 : 1.0
    });
    const facePlate = new THREE.Mesh(faceGeo, faceMat);
    facePlate.position.z = 1.12;
    rigGroup.add(facePlate);

    // Dual High-Speed Turbines
    const fanRotors: THREE.Group[] = [];
    [-0.9, 0.9].forEach((fanX) => {
      const ringGeo = new THREE.TorusGeometry(0.66, 0.05, 16, 48);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(fanX, 0, 1.16);
      rigGroup.add(ring);

      const bladeRotor = new THREE.Group();
      bladeRotor.position.set(fanX, 0, 1.15);

      const hubGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 24);
      const hubMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
      const hub = new THREE.Mesh(hubGeo, hubMat);
      hub.rotation.x = Math.PI / 2;
      bladeRotor.add(hub);

      for (let i = 0; i < 9; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.07, 0.45, 0.02);
        const bladeMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          metalness: 0.75,
          roughness: 0.25,
          emissive: 0x0284c7,
          emissiveIntensity: 0.2
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 0.25;
        blade.rotation.z = (i * Math.PI * 2) / 9;
        blade.rotation.x = 0.32;
        bladeRotor.add(blade);
      }
      rigGroup.add(bladeRotor);
      fanRotors.push(bladeRotor);
    });

    // Top APW12 Industrial Power Supply
    const psuGeo = new THREE.BoxGeometry(2.9, 0.48, 1.7);
    const psuMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2 });
    const psu = new THREE.Mesh(psuGeo, psuMat);
    psu.position.set(0, 1.15, 0);
    rigGroup.add(psu);

    // Internal ASIC Hashboards (Visible through X-Ray)
    const hashboards: THREE.Mesh[] = [];
    [-0.5, 0, 0.5].forEach((hbY) => {
      const hbGeo = new THREE.BoxGeometry(3.0, 0.06, 1.8);
      const hbMat = new THREE.MeshStandardMaterial({
        color: 0x064e3b,
        metalness: 0.6,
        roughness: 0.4,
        emissive: 0x059669,
        emissiveIntensity: 0.3
      });
      const hb = new THREE.Mesh(hbGeo, hbMat);
      hb.position.set(0, hbY, 0);
      rigGroup.add(hb);
      hashboards.push(hb);

      // Microchips on board
      for (let mx = -1.2; mx <= 1.2; mx += 0.4) {
        for (let mz = -0.6; mz <= 0.6; mz += 0.4) {
          const chipGeo = new THREE.BoxGeometry(0.16, 0.04, 0.16);
          const chipMat = new THREE.MeshStandardMaterial({
            color: 0x020617,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x10b981,
            emissiveIntensity: 0.5
          });
          const chip = new THREE.Mesh(chipGeo, chipMat);
          chip.position.set(mx, hbY + 0.04, mz);
          rigGroup.add(chip);
        }
      }
    });

    // Glowing Liquid Immersion Hydro Tubes
    const hydroTubes: THREE.Mesh[] = [];
    [-1.1, 1.1].forEach((tubeX) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(tubeX, -0.7, 1.0),
        new THREE.Vector3(tubeX * 1.1, 0, 1.2),
        new THREE.Vector3(tubeX, 0.7, 1.0),
        new THREE.Vector3(tubeX * 0.8, 1.0, 0.5),
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.07, 12, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.4,
        roughness: 0.1,
        transparent: true,
        opacity: 0.85,
        emissive: 0x0284c7,
        emissiveIntensity: 0.7
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      rigGroup.add(tubeMesh);
      hydroTubes.push(tubeMesh);
    });

    // Heat sink fins
    for (let i = -14; i <= 14; i++) {
      const finGeo = new THREE.BoxGeometry(0.03, 0.28, 1.8);
      const finMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.92, roughness: 0.18 });
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(i * 0.09, 0.9, 0);
      rigGroup.add(fin);
    }

    // Active status diodes
    const diodeLights: THREE.Mesh[] = [];
    for (let i = 0; i < 10; i++) {
      const diodeGeo = new THREE.SphereGeometry(0.04, 16, 16);
      const diodeMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x10b981 : 0x06b6d4 });
      const diode = new THREE.Mesh(diodeGeo, diodeMat);
      diode.position.set(-0.5 + i * 0.11, 0.7, 1.15);
      rigGroup.add(diode);
      diodeLights.push(diode);
    }

    // =========================================================================
    // SUB-SCENE 2: TRANSACTION MEMPOOL & BLOCKCHAIN STREAM (Bottom)
    // =========================================================================
    const ledgerGroup = new THREE.Group();
    ledgerGroup.position.set(0, -2.1, 0);
    masterWorldGroup.add(ledgerGroup);

    const chainBlocks: THREE.Mesh[] = [];
    const chainLinks: THREE.Mesh[] = [];
    for (let b = 0; b < 6; b++) {
      const bGeo = new THREE.BoxGeometry(0.85, 0.6, 0.6);
      const bMat = new THREE.MeshStandardMaterial({
        color: b === 3 ? 0xf59e0b : 0x0369a1,
        metalness: 0.85,
        roughness: 0.2,
        transparent: true,
        opacity: 0.92,
        emissive: b === 3 ? 0xb45309 : 0x075985,
        emissiveIntensity: 0.35
      });
      const blockMesh = new THREE.Mesh(bGeo, bMat);
      blockMesh.position.set((b - 2.5) * 1.35, 0, 0);
      ledgerGroup.add(blockMesh);
      chainBlocks.push(blockMesh);

      if (b < 5) {
        const linkGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.5, 16);
        const linkMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const linkMesh = new THREE.Mesh(linkGeo, linkMat);
        linkMesh.rotation.z = Math.PI / 2;
        linkMesh.position.set((b - 2.5) * 1.35 + 0.675, 0, 0);
        ledgerGroup.add(linkMesh);
        chainLinks.push(linkMesh);
      }
    }

    // Minted Reward Coins (Pulsing Golden Tokens)
    const coinTokens: THREE.Mesh[] = [];
    for (let c = 0; c < 3; c++) {
      const coinGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.05, 32);
      const coinMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.1,
        emissive: 0xd97706,
        emissiveIntensity: 0.6
      });
      const coin = new THREE.Mesh(coinGeo, coinMat);
      coin.position.set(0.68 + c * 0.45, 0.65, 0);
      coin.rotation.x = Math.PI / 4;
      ledgerGroup.add(coin);
      coinTokens.push(coin);
    }

    // =========================================================================
    // SUB-SCENE 3: MINING POOL CLUSTER NODES (Orbiting Satellites)
    // =========================================================================
    const poolGroup = new THREE.Group();
    masterWorldGroup.add(poolGroup);

    // Central Pool Hologram Core
    const poolCoreGeo = new THREE.IcosahedronGeometry(0.65, 2);
    const poolCoreMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: true,
      emissive: 0x059669,
      emissiveIntensity: 0.6
    });
    const poolCore = new THREE.Mesh(poolCoreGeo, poolCoreMat);
    poolCore.position.set(0, 0, -2.8);
    poolGroup.add(poolCore);

    // Satellite Rigs Connecting to Pool
    const satelliteNodes: THREE.Mesh[] = [];
    const satelliteBeams: THREE.Line[] = [];
    const nodeAngles = [0, (Math.PI * 2) / 4, (Math.PI * 4) / 4, (Math.PI * 6) / 4];

    nodeAngles.forEach((ang) => {
      const nGeo = new THREE.BoxGeometry(0.4, 0.25, 0.35);
      const nMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        metalness: 0.8,
        roughness: 0.3,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4
      });
      const nodeMesh = new THREE.Mesh(nGeo, nMat);
      const dist = 3.2;
      nodeMesh.position.set(Math.cos(ang) * dist, Math.sin(ang) * 0.8, Math.sin(ang) * dist - 2.8);
      poolGroup.add(nodeMesh);
      satelliteNodes.push(nodeMesh);

      // Connecting laser beam line
      const points = [
        new THREE.Vector3(poolCore.position.x, poolCore.position.y, poolCore.position.z),
        nodeMesh.position
      ];
      const beamGeo = new THREE.BufferGeometry().setFromPoints(points);
      const beamMat = new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.65 });
      const beamLine = new THREE.Line(beamGeo, beamMat);
      poolGroup.add(beamLine);
      satelliteBeams.push(beamLine);
    });

    // =========================================================================
    // SUB-SCENE 4: FLOATING HASH DATA PARTICLES HIGHWAY
    // =========================================================================
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 10;
      particlePositions[i + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;

      particleVelocities[i] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i + 1] = Math.random() * 0.025 + 0.008;
      particleVelocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.065,
      transparent: true,
      opacity: 0.85
    });
    const hashDataParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(hashDataParticles);

    // =========================================================================
    // MOUSE DRAG & ORBIT CONTROLS
    // =========================================================================
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
      masterWorldGroup.rotation.y += deltaX * 0.007;
      masterWorldGroup.rotation.x = Math.max(-0.45, Math.min(0.45, masterWorldGroup.rotation.x + deltaY * 0.007));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile devices
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      masterWorldGroup.rotation.y += deltaX * 0.007;
      masterWorldGroup.rotation.x = Math.max(-0.45, Math.min(0.45, masterWorldGroup.rotation.x + deltaY * 0.007));
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // RENDER LOOP & REAL-TIME ANIMATION
    // =========================================================================
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera view transition based on active chapter or camera preset
      let targetCamX = 0;
      let targetCamY = 1.8;
      let targetCamZ = 6.8;
      let targetLookAtY = 0.2;

      if (cameraPreset === 'hardware' || activeChapter === 2) {
        targetCamY = 0.8;
        targetCamZ = 4.8;
        targetLookAtY = 0.2;
      } else if (cameraPreset === 'network' || activeChapter === 3 || activeChapter === 4) {
        targetCamY = 3.2;
        targetCamZ = 8.5;
        targetLookAtY = -0.5;
      } else if (cameraPreset === 'ledger' || activeChapter === 1 || activeChapter === 5) {
        targetCamY = -0.8;
        targetCamZ = 5.2;
        targetLookAtY = -1.8;
      }

      // Smooth camera interpolation
      camera.position.x += (targetCamX - camera.position.x) * 0.045;
      camera.position.y += (targetCamY - camera.position.y) * 0.045;
      camera.position.z += (targetCamZ - camera.position.z) * 0.045;
      camera.lookAt(0, targetLookAtY, 0);

      // Idle world rotation when not dragging
      if (!isDragging) {
        masterWorldGroup.rotation.y = Math.sin(elapsed * 0.35) * 0.22 + 0.1;
      }

      // 1. Fan Rotation
      fanRotors.forEach((rotor, idx) => {
        rotor.rotation.z += idx % 2 === 0 ? 0.38 : -0.38;
      });

      // 2. Diode Blinking
      diodeLights.forEach((diode, idx) => {
        diode.visible = Math.sin(elapsed * 16 + idx * 1.4) > -0.15;
      });

      // 3. Chain Block subtle float & pulsation
      chainBlocks.forEach((mesh, idx) => {
        mesh.rotation.y = Math.sin(elapsed * 1.6 + idx) * 0.08;
        mesh.position.y = Math.sin(elapsed * 2 + idx * 0.6) * 0.05;
      });

      // 4. Mined coins rotation
      coinTokens.forEach((cMesh, idx) => {
        cMesh.rotation.y += 0.035;
        cMesh.position.y = 0.65 + Math.sin(elapsed * 3 + idx) * 0.1;
      });

      // 5. Pool Hologram Core Rotation & Pulsing Beams
      poolCore.rotation.x = elapsed * 0.6;
      poolCore.rotation.y = elapsed * 0.8;

      satelliteNodes.forEach((sNode, idx) => {
        sNode.rotation.y += 0.02;
        sNode.position.y = Math.sin(elapsed * 2 + idx) * 0.15;
      });

      // 6. Hydro coolant tubes glowing intensity
      hydroTubes.forEach((tube, idx) => {
        const mat = tube.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.5 + Math.sin(elapsed * 4 + idx) * 0.35;
      });

      // 7. Particle Data Streaming
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        posArr[i + 1] += particleVelocities[i + 1];
        if (posArr[i + 1] > 3.5) {
          posArr[i + 1] = -3.5;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [cameraPreset, activeChapter, xrayMode]);

  const curr = CHAPTERS[activeChapter];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl relative overflow-hidden font-sans">
      
      {/* Visual Accent Glow Top-Right */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* TOP HEADER: Title & Quick Control Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 rounded-full uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              3D CINEMATIC EXPLAINER
            </span>
            <span className="text-xs font-mono text-cyan-400">Crowd Mine Investment Masterclass</span>
            <span className="text-xs font-mono text-slate-500">· Chapter {activeChapter + 1} of {CHAPTERS.length}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 font-heading tracking-tight">
            How Cryptocurrency Mining & CrowdMine Works in 3D
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1 max-w-2xl">
            Interactive 3D presentation: Follow the complete blockchain consensus lifecycle, inspect industrial ASIC hardware, and explore our shared mining pool infrastructure.
          </p>
        </div>

        {/* Action Controls: Presets, Sound, X-Ray */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* X-Ray Chassis Toggle */}
          <button
            onClick={() => {
              setXrayMode(!xrayMode);
              playChime(600);
            }}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              xrayMode 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg' 
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{xrayMode ? 'Solid Chassis' : 'X-Ray Internals'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playChime(880);
            }}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Sound Synthesizer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Camera Perspective Presets */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setCameraPreset('orbit');
                playChime(500);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] font-bold ${
                cameraPreset === 'orbit' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setCameraPreset('hardware');
                playChime(550);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] font-bold ${
                cameraPreset === 'hardware' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              ASIC Rig
            </button>
            <button
              onClick={() => {
                setCameraPreset('network');
                playChime(600);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] font-bold ${
                cameraPreset === 'network' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Global Pool
            </button>
            <button
              onClick={() => {
                setCameraPreset('ledger');
                playChime(650);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] font-bold ${
                cameraPreset === 'ledger' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Blockchain
            </button>
          </div>
        </div>
      </div>

      {/* 3D CANVAS STAGE WITH HUD OVERLAYS */}
      <div className="relative w-full h-[420px] sm:h-[500px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-inner group">
        <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

        {/* HUD Top-Left: Live Mining Telemetry */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none font-mono">
          <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-md text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-400">Total Hash Throughput:</span>
            <span className="text-emerald-400 font-bold">{liveHashrate} TH/s</span>
          </div>
          <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-md text-xs">
            <span className="text-slate-400">Golden Nonce Target:</span>
            <span className="text-amber-400 font-bold ml-1.5">{currentBlockNonce}</span>
          </div>
          <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-md text-xs">
            <span className="text-slate-400">CrowdMine Pool Nodes:</span>
            <span className="text-cyan-400 font-bold ml-1.5">{activeMinersInPool.toLocaleString()} Connected</span>
          </div>
        </div>

        {/* HUD Top-Right: Chapter Title Pill */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none font-mono hidden sm:block">
          <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 shadow-md text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">{curr.badge}</div>
            <div className="text-xs font-bold text-slate-200 mt-0.5">{curr.title}</div>
          </div>
        </div>

        {/* Drag Hint Overlay */}
        <div className="absolute bottom-16 right-4 z-10 pointer-events-none font-mono text-[11px] text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
          <span>Drag in 3D to rotate perspective</span>
        </div>

        {/* BOTTOM HUD: Step Progress & Autoplay Toolbar */}
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 font-mono text-xs overflow-x-auto">
          {/* Autoplay toggle */}
          <button
            onClick={() => {
              setIsAutoPlay(!isAutoPlay);
              playChime(isAutoPlay ? 400 : 700);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap ${
              isAutoPlay 
                ? 'bg-emerald-500 text-slate-950 shadow-md' 
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlay ? 'Auto-Tour: ON' : 'Auto-Tour: OFF'}</span>
          </button>

          {/* Quick Chapter Selector Buttons */}
          <div className="flex items-center gap-1.5">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChapter(idx);
                  setIsAutoPlay(false);
                  playChime(440 + idx * 40);
                }}
                className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer transition-all whitespace-nowrap ${
                  activeChapter === idx
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={ch.title}
              >
                <span>{ch.id + 1}</span>
                <span className="hidden md:inline ml-1">{ch.badge.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Prev / Next buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setActiveChapter((prev) => (prev > 0 ? prev - 1 : CHAPTERS.length - 1));
                setIsAutoPlay(false);
                playChime(420);
              }}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
            >
              Prev
            </button>
            <button
              onClick={() => {
                setActiveChapter((prev) => (prev + 1) % CHAPTERS.length);
                setIsAutoPlay(false);
                playChime(520);
              }}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* EXPANDED EXPLANATORY TEXT & BRIEFING CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Full Briefing Content & Quote */}
        <div className="lg:col-span-8 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4 font-mono flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider">
                {curr.badge}
              </span>
              <span className="text-xs text-slate-500">
                Chapter {activeChapter + 1} of {CHAPTERS.length}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-100 font-heading tracking-tight">
              {curr.title}
            </h3>
            <div className="text-xs sm:text-sm font-bold text-cyan-400">
              {curr.subtitle}
            </div>

            {/* Official Briefing Quote Banner */}
            <div className="bg-slate-900/90 border-l-4 border-emerald-500 p-4 rounded-r-xl my-3 text-xs sm:text-sm text-slate-200 italic font-sans leading-relaxed">
              "{curr.quote}"
            </div>

            {/* Detailed Body Explanation */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
              {curr.body}
            </p>
          </div>

          {/* Interactive Navigation & CTAs */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveChapter((prev) => (prev > 0 ? prev - 1 : CHAPTERS.length - 1));
                  playChime(420);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                Previous Chapter
              </button>
              <button
                onClick={() => {
                  setActiveChapter((prev) => (prev + 1) % CHAPTERS.length);
                  playChime(520);
                }}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
              >
                <span>Continue Presentation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/10"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join Crowd Mine Today</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Key Technical Specs for this Chapter */}
        <div className="lg:col-span-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 font-mono flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400 uppercase font-bold text-[11px] tracking-wider">Chapter Metrics</span>
              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>

            <div className="space-y-4 mt-4">
              {curr.metrics.map((m, idx) => (
                <div key={idx} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">{m.label}</div>
                  <div className="text-sm font-bold text-slate-100 mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick summary takeaway */}
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300">
            <span className="font-bold">CrowdMine Advantage:</span> Our industrial scale combines cutting-edge hardware with 24/7 technical monitoring so investors maximize their net crypto yield with complete peace of mind.
          </div>
        </div>

      </div>

    </div>
  );
};
