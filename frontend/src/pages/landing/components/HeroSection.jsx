import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useInViewPause } from '../../../hooks/useInViewPause';

// --- Shader Definition ---

const ParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#ffffff'),
    uMouse: new THREE.Vector3(0, 0, 0),
    uMixShape1: 0,
    uMixShape2: 0,
    uMixShape3: 0,
    uMixStart: 1, // Start fully in "Start" mode
    uPixelRatio: 1
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform vec3 uMouse;
    uniform float uMixShape1;
    uniform float uMixShape2;
    uniform float uMixShape3;
    uniform float uMixStart;
    uniform float uPixelRatio;

    attribute vec3 aShape1;
    attribute vec3 aShape2;
    attribute vec3 aShape3;
    attribute vec3 aStart; // New Start Position
    attribute float aRandom;

    varying float vAlpha;

    // Simplex 3D Noise 
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); } 
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v){ 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;

        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        //  x0 = x0 - 0.0 + 0.0 * C 
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

        // Permutations
        i = mod(i, 289.0 ); 
        vec4 p = permute( permute( permute( 
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        // Gradients
        float n_ = 1.0/7.0; // N=7
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                        dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      // Morphing Logic: Now includes aStart
      vec3 targetPos = aStart * uMixStart + 
                       aShape1 * uMixShape1 + 
                       aShape2 * uMixShape2 + 
                       aShape3 * uMixShape3;
      
      // Floating / Noise Motion
      float noiseFreq = 0.15;
      float noiseAmp = 0.12; 
      vec3 noisePos = vec3(
        snoise(vec3(targetPos.x * noiseFreq + uTime * 0.1, targetPos.y * noiseFreq, targetPos.z)),
        snoise(vec3(targetPos.x * noiseFreq, targetPos.y * noiseFreq + uTime * 0.1, targetPos.z)),
        snoise(vec3(targetPos.x * noiseFreq, targetPos.y * noiseFreq, targetPos.z + uTime * 0.1))
      );
      
      vec3 finalPos = targetPos + noisePos * noiseAmp;

      // Mouse Repulsion
      float distanceToMouse = distance(finalPos.xy, uMouse.xy);
      float repulsionRadius = 2.0; 
      float repulsionStrength = 1.5;
      
      if (distanceToMouse < repulsionRadius) {
        vec3 dir = normalize(finalPos - uMouse);
        float force = (1.0 - distanceToMouse / repulsionRadius) * repulsionStrength;
        finalPos += dir * force;
      }

      vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
      gl_PointSize = (40.0 * aRandom + 20.0) * (1.0 / -mvPosition.z) * uPixelRatio;
      gl_Position = projectionMatrix * mvPosition;

      vAlpha = 0.6 + 0.4 * sin(uTime + aRandom * 10.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor;
    varying float vAlpha;

    void main() {
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
      
      if (alpha < 0.01) discard;

      gl_FragColor = vec4(uColor, alpha * vAlpha);
    }
  `
);

extend({ ParticleMaterial });

// --- Zero-Allocation Helpers ---
// Write directly to the buffer at offset index*3
const writePointOnThickLine = (buffer, idx, p1x, p1y, p1z, p2x, p2y, p2z, radius, t, angle) => {
  const bx = p1x + (p2x - p1x) * t;
  const by = p1y + (p2y - p1y) * t;
  const bz = p1z + (p2z - p1z) * t;

  const r = radius + (Math.random() - 0.5) * 0.01;

  buffer[idx * 3] = (bx + Math.cos(angle) * r) * 1.2 + 3.5;
  buffer[idx * 3 + 1] = (by + Math.sin(angle) * r) * 1.2 + 0.5;
  buffer[idx * 3 + 2] = bz + Math.sin(angle * 3.0) * 0.02 + (Math.random() - 0.5) * 0.05;
};

const writePointOnThickArc = (buffer, idx, cx, cy, cz, arcRadius, startAng, endAng, tubeRadius, t, angle) => {
  const charAng = startAng + (endAng - startAng) * t;
  const acx = cx + Math.cos(charAng) * arcRadius;
  const acy = cy + Math.sin(charAng) * arcRadius;

  const r = tubeRadius + (Math.random() - 0.5) * 0.01;
  const px = acx + Math.cos(angle) * r;
  const py = acy + Math.sin(angle) * r;
  const pz = cz + (Math.random() - 0.5) * 0.05;

  buffer[idx * 3] = px * 1.2 + 3.5;
  buffer[idx * 3 + 1] = py * 1.2 + 0.5;
  buffer[idx * 3 + 2] = pz;
};

const writePointOnBezier = (buffer, idx, p0x, p0y, p1x, p1y, p2x, p2y, tubeRadius, t, angle) => {
  const mt = 1 - t;
  const lx = mt * mt * p0x + 2 * mt * t * p1x + t * t * p2x;
  const ly = mt * mt * p0y + 2 * mt * t * p1y + t * t * p2y;

  const r = tubeRadius + (Math.random() - 0.5) * 0.01;
  const px = lx + Math.cos(angle) * r;
  const py = ly + Math.sin(angle) * r;
  const pz = (Math.random() - 0.5) * 0.05;

  buffer[idx * 3] = px * 1.2 + 3.5;
  buffer[idx * 3 + 1] = py * 1.2 + 0.5;
  buffer[idx * 3 + 2] = pz;
};


// --- Text Point Generation ---
// Optimized to read once and fill buffer
const fillTextPoints = (buffer, startIndex, text, count) => {
  const canvas = document.createElement('canvas');
  const width = 800; // Keep high res for text quality
  const height = 200;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true }); // Hint for optimization

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  ctx.font = 'bold 100px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const pixels = []; // Still need temp array for shuffling, but it's integers not objects

  // Collect white pixels
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 128) {
      // Pack x/y into a single integer to save object overhead? 
      // 800 is < 2^10, 200 is < 2^8. 
      // val = y * 1000 + x
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      pixels.push((y << 12) | x); // Bit packing
    }
  }

  // Shuffle
  for (let i = pixels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = pixels[i];
    pixels[i] = pixels[j];
    pixels[j] = temp;
  }

  const numPixels = pixels.length;
  if (numPixels === 0) return; // Fail safe

  for (let i = 0; i < count; i++) {
    const val = pixels[i % numPixels];
    const px = val & 0xFFF; // Unpack x
    const py = val >> 12;   // Unpack y

    const scale = 0.008;
    const wx = (px - width / 2) * scale + 3.5;
    const wy = -(py - height / 2) * scale - 2.5;

    const idx = startIndex + i;
    buffer[idx * 3] = wx;
    buffer[idx * 3 + 1] = wy;
    buffer[idx * 3 + 2] = 0;
  }
};

// --- Shape Generation ---
const generateShapePoints = (count, shapeIndex) => {
  const points = new Float32Array(count * 3);
  const SHAPE_COUNT = 3000;
  const TEXT_COUNT = count - SHAPE_COUNT;
  const r = 0.16; // Tube radius
  const phi = Math.PI * (3 - Math.sqrt(5));

  let textLabel = "";

  if (shapeIndex === 0) { // Shield
    textLabel = "SECURITY";
    const topCount = Math.floor(SHAPE_COUNT * 0.2);
    const sideCount = Math.floor(SHAPE_COUNT * 0.3);
    const curveCount = SHAPE_COUNT - topCount - sideCount;

    for (let i = 0; i < SHAPE_COUNT; i++) {
      const angle = i * phi;
      if (i < topCount) {
        const t = (i / topCount) + (Math.random() * 0.1 - 0.05);
        // p1(-1,1,0) p2(1,1,0)
        writePointOnThickLine(points, i, -1, 1, 0, 1, 1, 0, r, Math.max(0, Math.min(1, t)), angle);
      } else if (i < topCount + sideCount) {
        const k = i - topCount;
        const t = (k / sideCount);
        if (k % 2 === 0) writePointOnThickLine(points, i, -1, 0.2, 0, -1, 1, 0, r, t, angle);
        else writePointOnThickLine(points, i, 1, 0.2, 0, 1, 1, 0, r, t, angle);
      } else {
        const k = i - (topCount + sideCount);
        const t = (k / curveCount);
        if (k % 2 === 0) writePointOnBezier(points, i, -1, 0.2, -1, -1.2, 0, -1.5, r, t, angle);
        else writePointOnBezier(points, i, 1, 0.2, 1, -1.2, 0, -1.5, r, t, angle);
      }
    }

  } else if (shapeIndex === 1) { // Checkmark
    textLabel = "VOTING";
    const shortCount = Math.floor(SHAPE_COUNT * 0.3);
    const longCount = SHAPE_COUNT - shortCount;

    for (let i = 0; i < SHAPE_COUNT; i++) {
      const angle = i * phi;
      if (i < shortCount) {
        const t = (i / shortCount) + (Math.random() * 0.1 - 0.05);
        writePointOnThickLine(points, i, -1.1, 0.1, 0, -0.4, -0.9, 0, r, Math.max(0, Math.min(1, t)), angle);
      } else {
        const k = i - shortCount;
        const t = (k / longCount) + (Math.random() * 0.1 - 0.05);
        writePointOnThickLine(points, i, -0.4, -0.9, 0, 1.3, 1.3, 0, r, Math.max(0, Math.min(1, t)), angle);
      }
    }

  } else { // Lock
    textLabel = "INTEGRITY";
    const bodyCount = Math.floor(SHAPE_COUNT * 0.5);
    const shackleCount = Math.floor(SHAPE_COUNT * 0.3);

    const c1x = -0.9, c1y = 0.3;
    const c2x = 0.9, c2y = 0.3;
    const c3x = 0.9, c3y = -1.1;
    const c4x = -0.9, c4y = -1.1;

    for (let i = 0; i < SHAPE_COUNT; i++) {
      const angle = i * phi;
      if (i < bodyCount) {
        const k = i;
        const side = k % 4;
        const t = (Math.floor(k / 4) / (bodyCount / 4));
        if (side === 0) writePointOnThickLine(points, i, c1x, c1y, 0, c2x, c2y, 0, r, t, angle);
        else if (side === 1) writePointOnThickLine(points, i, c2x, c2y, 0, c3x, c3y, 0, r, t, angle);
        else if (side === 2) writePointOnThickLine(points, i, c3x, c3y, 0, c4x, c4y, 0, r, t, angle);
        else writePointOnThickLine(points, i, c4x, c4y, 0, c1x, c1y, 0, r, t, angle);
      } else if (i < bodyCount + shackleCount) {
        const k = i - bodyCount;
        const t = k / shackleCount;
        writePointOnThickArc(points, i, 0, 0.3, 0, 0.7, 0, Math.PI, r, t, angle);
      } else {
        const k = i - (bodyCount + shackleCount);
        const mid = Math.floor((SHAPE_COUNT - (bodyCount + shackleCount)) * 0.6);
        if (k < mid) {
          const t = k / mid;
          writePointOnThickArc(points, i, 0, -0.3, 0, 0.25, 0, Math.PI * 2, r * 0.6, t, angle);
        } else {
          const t = (k - mid) / (SHAPE_COUNT - (bodyCount + shackleCount) - mid);
          writePointOnThickLine(points, i, 0, -0.5, 0, 0, -0.8, 0, r * 0.6, t, angle);
        }
      }
    }
  }

  if (TEXT_COUNT > 0) {
    fillTextPoints(points, SHAPE_COUNT, textLabel, TEXT_COUNT);
  }

  return points;
};


const ParticleSystem = ({ themeColor, isPaused }) => {
  const COUNT = 4000;
  const meshRef = useRef();
  const materialRef = useRef();
  const { viewport, mouse, gl } = useThree();

  // --- Pre-calculate Attributes ---
  const [positions, aShape1, aShape2, aShape3, aRandom] = useMemo(() => {
    // Initial random positions
    const pos = new Float32Array(COUNT * 3);
    const rnd = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30 + 3.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      rnd[i] = Math.random();
    }

    const s1 = generateShapePoints(COUNT, 0);
    const s2 = generateShapePoints(COUNT, 1);
    const s3 = generateShapePoints(COUNT, 2);

    return [pos, s1, s2, s3, rnd];
  }, []);

  const [targetShape, setTargetShape] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    // Swap shapes every 6s
    const interval = setInterval(() => {
      setTargetShape(prev => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]); // Restart interval if pause state changes

  // Frame Loop
  useFrame((state, delta) => {
    if (isPaused || !materialRef.current) return; // KILL SWITCH for CPU

    const time = state.clock.getElapsedTime();
    materialRef.current.uTime = time;
    materialRef.current.uPixelRatio = Math.min(window.devicePixelRatio, 2);

    const mx = (mouse.x * viewport.width) / 2;
    const my = (mouse.y * viewport.height) / 2;

    const mouseSmoothness = 1.0 - Math.exp(-5.0 * delta);
    const currentMouse = materialRef.current.uMouse;
    currentMouse.x += (mx - currentMouse.x) * mouseSmoothness;
    currentMouse.y += (my - currentMouse.y) * mouseSmoothness;

    const morphSmoothness = 1.0 - Math.exp(-2.0 * delta);

    let t1 = targetShape === 0 ? 1 : 0;
    let t2 = targetShape === 1 ? 1 : 0;
    let t3 = targetShape === 2 ? 1 : 0;

    materialRef.current.uMixShape1 += (t1 - materialRef.current.uMixShape1) * morphSmoothness;
    materialRef.current.uMixShape2 += (t2 - materialRef.current.uMixShape2) * morphSmoothness;
    materialRef.current.uMixShape3 += (t3 - materialRef.current.uMixShape3) * morphSmoothness;
  });

  return (
    <points ref={meshRef} position={[0, 0.4, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aShape1" count={COUNT} array={aShape1} itemSize={3} />
        <bufferAttribute attach="attributes-aShape2" count={COUNT} array={aShape2} itemSize={3} />
        <bufferAttribute attach="attributes-aShape3" count={COUNT} array={aShape3} itemSize={3} />
        <bufferAttribute attach="attributes-aRandom" count={COUNT} array={aRandom} itemSize={1} />
      </bufferGeometry>
      {/* 
         @ts-ignore - Custom material 
      */}
      <particleMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uColor={new THREE.Color(themeColor)}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};


// --- Main Hero Component ---
const HeroSection = ({ isVisible }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 500]);
  const { isDarkMode } = useTheme();

  // Use the hook to pause when off-screen
  const [containerRef, isPaused] = useInViewPause({ threshold: 0.1 });

  const bcgColor = isDarkMode ? '#000000' : '#ffffff';
  const finalParticleColor = isDarkMode ? '#ffffff' : '#111827';

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-white dark:bg-black grid grid-cols-12 gap-4 p-4 lg:p-8 overflow-hidden transition-colors duration-500"
    >

      {/* 1. Typography (Left) */}
      <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col justify-center z-20 pointer-events-none pb-24 lg:pb-0 pl-12 lg:pl-28">
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-[8rem] 2xl:text-[10rem] tracking-tighter font-black text-gray-900 dark:text-white leading-[0.9] lg:leading-[0.85] select-none transition-colors duration-500">
            DECIDE.<br />
            VERIFY.<br />
            COMMIT.
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 0.7 : 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-6 lg:mt-8 text-base sm:text-lg lg:text-xl font-medium text-gray-600 dark:text-gray-400 tracking-widest uppercase pl-1 lg:pl-2 transition-colors duration-500"
          >
            Immutable Consensus
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 pointer-events-auto"
          >
            <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold tracking-tight rounded-full hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-2xl">
              Launch App
            </button>
            <button className="px-8 py-4 border border-gray-300 dark:border-white/30 text-gray-900 dark:text-white font-medium tracking-tight rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm">
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* 2. Visualization (Right / Full Overlay) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <div className="w-full h-full relative">
          <Canvas
            className="pointer-events-auto"
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              preserveDrawingBuffer: false
            }}
            dpr={[1, 2]} // Dynamic pixel ratio for performance
            camera={{ position: [0, 0, 10], fov: 45 }}
            frameloop={isPaused ? "never" : "always"} // Optimization: Stop the loop entirely
          >
            <color attach="background" args={[bcgColor]} />

            {/* Minimal lights just in case, though standard material doesn't need them, shader ignores them unless coded */}
            <ambientLight intensity={0.5} />

            <ParticleSystem themeColor={finalParticleColor} isPaused={isPaused} />

          </Canvas>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent dark:from-black dark:via-black/50 dark:to-transparent pointer-events-none w-full lg:w-2/3 transition-colors duration-500" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-gray-400/0 via-gray-400 dark:via-white/50 to-gray-400/0 animate-pulse" />
      </motion.div>

    </section>
  );
};

export default HeroSection;
