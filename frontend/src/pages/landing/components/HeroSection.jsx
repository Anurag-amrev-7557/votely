import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useInViewPause } from '../../../hooks/useInViewPause';

import ParticleSystem from '../../../components/visuals/ParticleSystem';


// --- Main Hero Component ---
const HeroSection = ({ isVisible }) => {
  const navigate = useNavigate();
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
      <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col justify-center z-20 pointer-events-none pb-40 lg:pb-0 pl-0 lg:pl-28">
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {/* Mobile Layout: Stacked (Heading -> Buttons -> Animation implicitly via canvas) */}
          <div className="w-full">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-[8rem] 2xl:text-[10rem] tracking-tighter font-black text-gray-900 dark:text-white leading-[0.9] lg:leading-[0.85] select-none transition-colors duration-500 text-left will-change-transform">
              DECIDE.<br />
              VERIFY.<br />
              COMMIT.
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 0.7 : 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-6 lg:mt-8 text-base sm:text-lg lg:text-xl font-medium text-gray-700 dark:text-gray-300 tracking-widest uppercase pl-1 lg:pl-2 transition-colors duration-500 text-left"
            >
              Immutable Consensus
            </motion.p>
          </div>

          {/* CTAs - Properly below everything */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 lg:mt-10 flex flex-col sm:flex-row gap-4 pointer-events-auto w-full lg:w-auto items-start lg:items-center"
          >
            <button
              onClick={() => navigate('/polls')}
              className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold tracking-tight rounded-full hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-2xl w-full sm:w-auto"
            >
              Vote Now
            </button>
            <button
              onClick={() => navigate('/admin-login')}
              className="px-8 py-4 border border-gray-300 dark:border-white/30 text-gray-900 dark:text-white font-medium tracking-tight rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm w-full sm:w-auto"
            >
              Admin Access
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
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/50 lg:to-transparent dark:from-black/90 dark:via-black/50 dark:to-transparent dark:lg:from-black dark:lg:via-black/50 dark:lg:to-transparent pointer-events-none w-full lg:w-2/3 transition-colors duration-500" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-gray-400/0 via-gray-600 dark:via-white/50 to-gray-400/0 animate-pulse" />
      </motion.div>

    </section>
  );
};

export default HeroSection;
