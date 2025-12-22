import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Vote,
  ShieldCheck,
  Activity,
  ArrowRight,
  Clock,
  Zap,
  Lock,
  Search,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminAxios from '../../utils/api/adminAxios';

// --- VISUAL UTILITIES ---
// NoiseTexture and SpotlightEffect removed - imported from AdminWidgets

import { DashboardWidget, StatValue, NoiseTexture, SpotlightEffect } from './AdminWidgets';

const AdminDashboard = ({ isDarkMode }) => {
  const { adminEmail } = useAdminAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real stats mock data - replaced with real API calls in production
  const stats = {
    activePolls: 12,
    totalVotes: 14502,
    registeredVoters: 8903,
    securityScore: 98
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen py-4 px-3 pr-1 space-y-8">

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600 dark:text-zinc-400 mb-2">
            Command Center
          </h2>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
            Welcome back, <span className="text-gray-500 dark:text-zinc-500">Admin.</span>
          </h1>
        </div>

        <div className="flex flex-col-reverse md:flex-row md:items-center gap-4">
          {/* Pill Styled Stats */}
          <div className="flex items-center gap-4 bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-full px-5 py-2.5 shadow-sm overflow-x-auto max-w-full custom-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              <Vote className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.activePolls}</span>
                <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium hidden sm:inline-block">active</span>
              </div>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-zinc-800 shrink-0"></div>
            <div className="flex items-center gap-2 shrink-0">
              <Activity className="w-4 h-4 text-blue-500" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.totalVotes.toLocaleString()}</span>
                <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium hidden sm:inline-block">votes</span>
              </div>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-zinc-800 shrink-0"></div>
            <div className="flex items-center gap-2 shrink-0">
              <Users className="w-4 h-4 text-purple-500" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.registeredVoters.toLocaleString()}</span>
                <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium hidden sm:inline-block">voters</span>
              </div>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-zinc-800 shrink-0"></div>
            <div className="flex items-center gap-2 shrink-0">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.securityScore}%</span>
                <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium hidden sm:inline-block">security</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-900/50 px-4 py-2 rounded-full border border-gray-200 dark:border-zinc-800 self-start md:self-auto shadow-sm">
            <Clock className="w-4 h-4" />
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="w-px h-4 bg-gray-300 dark:bg-zinc-700 mx-1"></span>
            <span>{currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      {/* Main Grid - Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">


        {/* Live Activity Pulse */}
        <DashboardWidget title="Live Vote Velocity" span="md:col-span-2 md:row-span-2">
          <div className="flex-1 flex items-end gap-1.5 h-full min-h-[200px] w-full pt-4">
            {/* Creating a more 'system' look for the chart */}
            {[...Array(24)].map((_, i) => {
              const height = Math.max(10, Math.random() * 100);
              return (
                <motion.div
                  key={i}
                  initial={{ height: '0%' }}
                  animate={{
                    height: `${height}%`,
                    opacity: i > 20 ? 0.3 : 1
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.05
                  }}
                  className="flex-1 rounded-sm bg-gray-900 dark:bg-white"
                  role="presentation"
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs font-mono text-gray-500 dark:text-zinc-500 uppercase tracking-wider">
            <span>T-60m</span>
            <span>Now</span>
          </div>
        </DashboardWidget>

        {/* System Health Matrix */}
        <DashboardWidget title="System Health" span="md:col-span-1 md:row-span-2">
          <div className="flex flex-col gap-6">
            <HealthItem label="CPU Load" value={34} />
            <HealthItem label="Memory Usage" value={56} />
            <HealthItem label="Node Consensus" value={100} />
            <HealthItem label="Encryption Layer" value={100} color="green" />
          </div>
          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-mono text-green-600 dark:text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              ALL SYSTEMS OPERATIONAL
            </div>
          </div>
        </DashboardWidget>

        {/* Recent Audit Log */}
        <DashboardWidget title="Audit Log" span="md:col-span-1 md:row-span-2">
          <ul className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <li key={i} className="flex gap-3 text-sm group/item">
                <span className="font-mono text-xs text-gray-500 dark:text-zinc-400 pt-0.5">
                  10:{14 + i}
                </span>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-white">New Vote Cast</span>
                  <span className="text-xs text-gray-500 dark:text-zinc-500">Hash: 8f3a...9d2e</span>
                </div>
              </li>
            ))}
          </ul>
        </DashboardWidget>

        {/* Quick Actions */}
        <DashboardWidget title="Command Console" span="md:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ActionButton icon={Zap} label="New Poll" />
            <ActionButton icon={Users} label="Manage Users" />
            <ActionButton icon={ShieldCheck} label="Security Scan" />
            <ActionButton icon={Lock} label="Emergency Stop" variant="danger" />
          </div>
        </DashboardWidget>

        <div className="md:col-span-2 flex items-center justify-between p-6 rounded-3xl bg-gray-100 dark:bg-zinc-900 border border-transparent dark:border-zinc-800/50">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Admin Protocol v2.1.0</h4>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Last security audit passed 2 hours ago.</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-gray-500 dark:text-zinc-500" />
          </div>
        </div>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const HealthItem = ({ label, value, color = 'blue' }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600 dark:text-zinc-400">{label}</span>
      <span className="font-mono text-gray-900 dark:text-white">{value}%</span>
    </div>
    <div className="h-1 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gray-900 dark:bg-white rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const ActionButton = ({ icon: Icon, label, variant = 'primary' }) => (
  <button className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-200 border group ${variant === 'danger'
    ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/20'
    : 'bg-white dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700/50 hover:bg-gray-50 dark:hover:bg-zinc-800'
    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900`}>
    <Icon className={`w-6 h-6 ${variant === 'danger' ? 'text-red-500' : 'text-gray-700 dark:text-zinc-300'
      }`} />
    <span className={`text-sm font-medium ${variant === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
      }`}>{label}</span>
  </button>
);
// End of file
export default AdminDashboard;
