import React, { useState, useRef, useEffect, useMemo, lazy, Suspense } from 'react';
import {
  UserCircleIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  BellIcon,
  ChartBarIcon,
  PencilSquareIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon,
  BoltIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const recentActivity = [
  {
    timestamp: '2024-03-15 10:23 AM',
    action: 'Poll Created',
    user: 'Admin User',
    details: "New poll 'City Council Election' created",
  },
  {
    timestamp: '2024-03-15 11:45 AM',
    action: 'User Registered',
    user: 'System',
    details: "New user 'Emily Carter' registered",
  },
  {
    timestamp: '2024-03-15 01:12 PM',
    action: 'Vote Cast',
    user: 'Emily Carter',
    details: "Vote cast in 'City Council Election'",
  },
  {
    timestamp: '2024-03-15 02:30 PM',
    action: 'Security Log',
    user: 'System',
    details: 'Login attempt from unknown IP address',
  },
  {
    timestamp: '2024-03-15 03:48 PM',
    action: 'Poll Closed',
    user: 'Admin User',
    details: "Poll 'Student Body President' closed",
  },
];

// Advanced: Rich activity avatar system with emoji, color, and accessibility label
const activityAvatars = [
  {
    icon: ChartBarIcon,
    color: 'bg-blue-500 text-white',
    label: 'Poll Activity',
    keywords: ['Poll Created', 'Poll Closed', 'Vote Cast'],
  },
  {
    icon: UserCircleIcon,
    color: 'bg-green-500 text-white',
    label: 'User Activity',
    keywords: ['User Registered', 'User Updated', 'User Deleted'],
  },
  {
    icon: ShieldCheckIcon,
    color: 'bg-purple-500 text-white',
    label: 'Security Event',
    keywords: ['Security Log', 'Login Attempt', 'Password Changed'],
  },
  {
    icon: BoltIcon,
    color: 'bg-yellow-400 text-gray-900',
    label: 'System Alert',
    keywords: ['System Alert', 'Performance Spike', 'Downtime'],
  },
  {
    icon: GlobeAltIcon,
    color: 'bg-pink-500 text-white',
    label: 'Results',
    keywords: ['Results Published', 'Results Updated'],
  },
  {
    icon: PencilSquareIcon,
    color: 'bg-indigo-500 text-white',
    label: 'Edit',
    keywords: ['Poll Edited', 'User Edited'],
  },
  {
    icon: CheckBadgeIcon,
    color: 'bg-emerald-500 text-white',
    label: 'Success',
    keywords: ['Success', 'Completed'],
  },
  {
    icon: XMarkIcon,
    color: 'bg-red-500 text-white',
    label: 'Error',
    keywords: ['Error', 'Failed', 'Rejected'],
  },
  {
    icon: BellIcon,
    color: 'bg-orange-400 text-white',
    label: 'Notification',
    keywords: ['Notification', 'Reminder'],
  },
  {
    icon: ClockIcon,
    color: 'bg-gray-500 text-white',
    label: 'Time',
    keywords: ['Scheduled', 'Delayed'],
  },
];

// Helper: Get avatar by activity action
export function getActivityAvatar(action) {
  for (const avatar of activityAvatars) {
    if (avatar.keywords.some(keyword => action.includes(keyword))) {
      return avatar;
    }
  }
  // Default fallback
  return {
    icon: InformationCircleIcon,
    color: 'bg-blue-300 text-white',
    label: 'Activity',
  };
}

// Move keyframes to a global style tag outside the component
if (typeof document !== 'undefined' && !document.getElementById('admindashboard-keyframes')) {
  const style = document.createElement('style');
  style.id = 'admindashboard-keyframes';
  style.innerHTML = `
    @keyframes typing {
      from { width: 0 }
      to { width: 100% }
    }
    @keyframes blink-caret {
      from, to { border-color: transparent }
      50% { border-color: #3b82f6; }
    }
    @keyframes wave {
      0% { transform: rotate(0.0deg) }
      10% { transform: rotate(14.0deg) }
      20% { transform: rotate(-8.0deg) }
      30% { transform: rotate(14.0deg) }
      40% { transform: rotate(-4.0deg) }
      50% { transform: rotate(10.0deg) }
      60% { transform: rotate(0.0deg) }
      100% { transform: rotate(0.0deg) }
    }
  `;
  document.head.appendChild(style);
}

const UsersPage = lazy(() => import('./UsersPage'));
const PollsPage = lazy(() => import('./PollsPage'));
const ResultsPage = lazy(() => import('./ResultsPage'));
const SecurityPage = lazy(() => import('./SecurityPage'));
const SettingsPage = lazy(() => import('./SettingsPage'));

const AdminDashboard = React.memo(({ isDarkMode }) => {
  // Memoize theme-dependent variables
  const themeVars = useMemo(() => ({
    accent: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    bg: isDarkMode ? 'bg-gray-900' : 'bg-white',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    subtext: isDarkMode ? 'text-gray-400' : 'text-gray-500',
  }), [isDarkMode]);
  const { accent, border, bg, text, subtext } = themeVars;

  // Stats
  const [pollsCount, setPollsCount] = useState(12);
  const [votersCount, setVotersCount] = useState(5230);
  const [votesCount, setVotesCount] = useState(4100);
  const [showNewPollModal, setShowNewPollModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  // Activity
  const [activityList, setActivityList] = useState(recentActivity);

  // Greeting
  const hour = new Date().getHours();
  let greeting = 'Welcome back';
  if (hour < 5) greeting = 'Good night';
  else if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  return (
    <div className={`min-h-screen p-8 ${bg} ${text} transition-colors`}>  
      {/* Advanced Animated Header */}
      <div className="mb-8 flex flex-col gap-2 relative">
        {/* Animated Glow Accent */}
        <div
          className={`absolute -top-6 -left-6 w-40 h-20 rounded-full blur-2xl pointer-events-none z-0 ${
            isDarkMode
              ? 'bg-gradient-to-tr from-blue-700/30 via-blue-500/20 to-purple-700/10'
              : 'bg-gradient-to-tr from-blue-300/30 via-blue-200/20 to-purple-200/10'
          } animate-pulse`}
          aria-hidden="true"
        />
        {/* Greeting with Emoji and Typewriter Effect */}
        <div className="flex items-center gap-3 z-10">
          <span
            className="text-3xl md:text-4xl animate-wave"
            role="img"
            aria-label="Waving hand"
            style={{
              display: 'inline-block',
              animation: 'wave 2s infinite',
              transformOrigin: '70% 70%',
            }}
          >
            👋
          </span>
          <h1
            className={`text-2xl md:text-3xl font-extrabold tracking-tight ${accent} flex items-center gap-2`}
            aria-live="polite"
          >
            <span className="typewriter" style={{
              borderRight: '2px solid',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              animation: 'typing 1.5s steps(30, end), blink-caret .75s step-end infinite'
            }}>
              {greeting}, Admin
            </span>
            <span className="sr-only">{greeting}, Admin</span>
          </h1>
        </div>
        {/* Subtext with Icon and Tooltip */}
        <div className="flex items-center gap-2 mt-1 z-10">
          <InformationCircleIcon className={`h-5 w-5 ${subtext} animate-bounce`} aria-hidden="true" />
          <p className={`text-sm ${subtext} relative group`}>
            <span>Advanced dashboard overview</span>
            <span className="absolute left-1/2 -translate-x-1/2 mt-1 w-max px-3 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
              See real-time stats, activity, and quick actions
            </span>
          </p>
        </div>
        {/* Accessibility: Visually hidden description */}
        <span className="sr-only">
          This dashboard provides a real-time overview of polls, voters, and system activity for administrators.
        </span>
      </div>

      {/* Advanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Active Polls */}
        <div
          className={`relative border ${border} rounded-2xl p-6 flex flex-col gap-2 shadow-lg overflow-hidden group transition-all duration-300 hover:scale-[1.025] hover:shadow-2xl`}
          tabIndex={0}
          aria-label="Active Polls"
        >
          {/* Animated Accent Ring */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-tr from-blue-400/20 to-blue-600/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
          {/* Icon */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ChartBarIcon className={`h-7 w-7 ${accent} drop-shadow`} aria-hidden="true" />
              <span className={`text-xs font-semibold uppercase tracking-wide ${subtext}`}>Active Polls</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 animate-pulse">
              Live
            </span>
          </div>
          {/* Value */}
          <span className="text-3xl font-extrabold tracking-tight mb-1">{pollsCount}</span>
          {/* Mini Trendline */}
          <div className="h-8">
            <svg viewBox="0 0 80 32" fill="none" className="w-full h-full">
              <polyline
                points="0,28 10,20 20,24 30,12 40,16 50,8 60,18 70,6 80,10"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="opacity-80"
              />
              <circle cx="80" cy="10" r="2.5" fill="#3b82f6" />
            </svg>
          </div>
          {/* Tooltip */}
          <span className="absolute top-3 right-3 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {pollsCount > 1 ? 'Multiple polls running' : 'Single poll running'}
          </span>
        </div>

        {/* Registered Voters */}
        <div
          className={`relative border ${border} rounded-2xl p-6 flex flex-col gap-2 shadow-lg overflow-hidden group transition-all duration-300 hover:scale-[1.025] hover:shadow-2xl`}
          tabIndex={0}
          aria-label="Registered Voters"
        >
          {/* Animated Accent Ring */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-tr from-green-400/20 to-green-600/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
          {/* Icon */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <UserCircleIcon className="h-7 w-7 text-green-500 dark:text-green-300 drop-shadow" aria-hidden="true" />
              <span className={`text-xs font-semibold uppercase tracking-wide ${subtext}`}>Registered Voters</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
              +{(votersCount * 0.012).toFixed(0)} today
            </span>
          </div>
          {/* Value */}
          <span className="text-3xl font-extrabold tracking-tight mb-1">{votersCount.toLocaleString()}</span>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
              style={{ width: `${Math.min(100, (votersCount / 6000) * 100)}%` }}
            />
          </div>
          {/* Tooltip */}
          <span className="absolute top-3 right-3 text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {votersCount.toLocaleString()} total
          </span>
        </div>

        {/* Total Votes */}
        <div
          className={`relative border ${border} rounded-2xl p-6 flex flex-col gap-2 shadow-lg overflow-hidden group transition-all duration-300 hover:scale-[1.025] hover:shadow-2xl`}
          tabIndex={0}
          aria-label="Total Votes"
        >
          {/* Animated Accent Ring */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-tr from-purple-400/20 to-purple-600/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
          {/* Icon */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckBadgeIcon className="h-7 w-7 text-purple-500 dark:text-purple-300 drop-shadow" aria-hidden="true" />
              <span className={`text-xs font-semibold uppercase tracking-wide ${subtext}`}>Total Votes</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
              {((votesCount / votersCount) * 100).toFixed(1)}%
            </span>
          </div>
          {/* Value */}
          <span className="text-3xl font-extrabold tracking-tight mb-1">{votesCount.toLocaleString()}</span>
          {/* Animated Sparkline */}
          <div className="h-8">
            <svg viewBox="0 0 80 32" fill="none" className="w-full h-full">
              <polyline
                points="0,30 10,28 20,24 30,20 40,16 50,12 60,8 70,6 80,4"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="opacity-80"
              />
              <circle cx="80" cy="4" r="2.5" fill="#a78bfa" />
            </svg>
          </div>
          {/* Tooltip */}
          <span className="absolute top-3 right-3 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {votesCount.toLocaleString()} votes cast
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-8 flex gap-2">
        <button
          onClick={() => setShowNewPollModal(true)}
          className={`px-4 py-2 rounded border ${border} ${accent} font-medium bg-transparent hover:bg-blue-50 dark:hover:bg-gray-800 transition`}
        >
          + New Poll
        </button>
      </div>

      {/* Advanced Activity Feed */}
      <div className={`border ${border} rounded-lg p-5 mb-8`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BellIcon className="h-6 w-6 text-blue-400 dark:text-blue-300" aria-hidden="true" />
            Recent Activity
          </h2>
          <button
            className={`text-xs px-3 py-1 rounded-full font-medium border ${border} ${accent} hover:bg-blue-50 dark:hover:bg-gray-800 transition`}
            onClick={() => setShowActivityModal(true)}
            aria-label="View all activity"
          >
            View All
          </button>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {activityList.length === 0 && (
            <li className={`py-6 text-center ${subtext}`}>No recent activity.</li>
          )}
          {activityList.slice(0, 5).map((activity, idx) => {
            // Find avatar/icon for this activity
            const avatar = activityAvatars.find(a =>
              a.keywords.some(keyword => activity.action.includes(keyword))
            ) || {
              icon: InformationCircleIcon,
              color: 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300',
              label: 'Other',
            };
            const Icon = avatar.icon;
            // Status color for timeline dot
            let statusColor = 'bg-gray-300';
            if (avatar.color.includes('bg-blue')) statusColor = 'bg-blue-400';
            if (avatar.color.includes('bg-green')) statusColor = 'bg-green-400';
            if (avatar.color.includes('bg-purple')) statusColor = 'bg-purple-400';
            if (avatar.color.includes('bg-yellow')) statusColor = 'bg-yellow-300';
            if (avatar.color.includes('bg-pink')) statusColor = 'bg-pink-400';
            if (avatar.color.includes('bg-indigo')) statusColor = 'bg-indigo-400';
            if (avatar.color.includes('bg-emerald')) statusColor = 'bg-emerald-400';
            if (avatar.color.includes('bg-red')) statusColor = 'bg-red-400';
            if (avatar.color.includes('bg-orange')) statusColor = 'bg-orange-400';

            return (
              <li
                key={idx}
                className="py-4 flex items-start gap-4 group relative"
                tabIndex={0}
                aria-label={`${activity.action} by ${activity.user} at ${activity.timestamp}`}
              >
                {/* Timeline Dot */}
                <div className="flex flex-col items-center mr-2">
                  <span
                    className={`w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-900 ${statusColor} shadow-md transition-transform group-hover:scale-110`}
                    aria-label={avatar.label}
                  />
                  {idx < Math.min(activityList.length, 5) - 1 && (
                    <span className="flex-1 w-0.5 bg-gray-200 dark:bg-gray-700 mt-1 mb-1" />
                  )}
                </div>
                {/* Icon Avatar */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow ${avatar.color} text-lg font-bold transition-transform group-hover:scale-105`}
                  aria-label={avatar.label}
                  title={avatar.label}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base">{activity.action}</span>
                    {activity.user && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 font-medium">
                        {activity.user}
                      </span>
                    )}
                  </div>
                  <span className={`block text-sm ${subtext}`}>{activity.details}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <ClockIcon className="h-4 w-4 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                    <span className="text-xs text-gray-400 dark:text-gray-500">{activity.timestamp}</span>
                  </div>
                </div>
                {/* Tooltip on hover/focus */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-900 text-white text-xs shadow-lg">
                    {avatar.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        {/* Animated "See More" if more activity */}
        {activityList.length > 5 && (
          <div className="flex justify-center mt-3">
            <button
              className="text-xs text-blue-500 hover:underline font-medium flex items-center gap-1 animate-pulse"
              onClick={() => setShowActivityModal(true)}
              aria-label="Show more activity"
            >
              Show more
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {/* Activity Modal (advanced, animated, accessible) */}
      {showActivityModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
            onClick={() => setShowActivityModal(false)}
            aria-label="Close activity modal"
          />
          {/* Modal Content */}
          <div
            className={`relative rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8 transition-all duration-300 transform scale-100 ${
              isDarkMode
                ? 'bg-gradient-to-br from-[#232b36] via-[#2c353f] to-[#1a202c] border border-gray-700'
                : 'bg-gradient-to-br from-white via-gray-50 to-blue-50 border border-gray-200'
            } animate-modalPop`}
            role="document"
            aria-labelledby="activity-modal-title"
            aria-describedby="activity-modal-desc"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowActivityModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Close"
              tabIndex={0}
            >
              <XMarkIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
            {/* Modal Title */}
            <div className="flex items-center gap-2 mb-6">
              <BellIcon className="h-7 w-7 text-blue-400 dark:text-blue-300" aria-hidden="true" />
              <h3 id="activity-modal-title" className="text-xl font-bold">
                All Recent Activity
              </h3>
            </div>
            {/* Activity List */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[60vh] overflow-y-auto pr-2">
              {activityList.length === 0 && (
                <li className={`py-6 text-center ${subtext}`}>No recent activity.</li>
              )}
              {activityList.map((activity, idx) => {
                const avatar = activityAvatars.find(a =>
                  a.keywords.some(keyword => activity.action.includes(keyword))
                ) || {
                  icon: InformationCircleIcon,
                  color: 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300',
                  label: 'Other',
                };
                const Icon = avatar.icon;
                let statusColor = 'bg-gray-300';
                if (avatar.color.includes('bg-blue')) statusColor = 'bg-blue-400';
                if (avatar.color.includes('bg-green')) statusColor = 'bg-green-400';
                if (avatar.color.includes('bg-purple')) statusColor = 'bg-purple-400';
                if (avatar.color.includes('bg-yellow')) statusColor = 'bg-yellow-300';
                if (avatar.color.includes('bg-pink')) statusColor = 'bg-pink-400';
                if (avatar.color.includes('bg-indigo')) statusColor = 'bg-indigo-400';
                if (avatar.color.includes('bg-emerald')) statusColor = 'bg-emerald-400';
                if (avatar.color.includes('bg-red')) statusColor = 'bg-red-400';
                if (avatar.color.includes('bg-orange')) statusColor = 'bg-orange-400';

                return (
                  <li
                    key={idx}
                    className="py-4 flex items-start gap-4 group relative"
                    tabIndex={0}
                    aria-label={`${activity.action} by ${activity.user} at ${activity.timestamp}`}
                  >
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center mr-2">
                      <span
                        className={`w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-900 ${statusColor} shadow-md transition-transform group-hover:scale-110`}
                        aria-label={avatar.label}
                      />
                      {idx < activityList.length - 1 && (
                        <span className="flex-1 w-0.5 bg-gray-200 dark:bg-gray-700 mt-1 mb-1" />
                      )}
                    </div>
                    {/* Icon Avatar */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow ${avatar.color} text-lg font-bold transition-transform group-hover:scale-105`}
                      aria-label={avatar.label}
                      title={avatar.label}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base">{activity.action}</span>
                        {activity.user && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 font-medium">
                            {activity.user}
                          </span>
                        )}
                      </div>
                      <span className={`block text-sm ${subtext}`}>{activity.details}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <ClockIcon className="h-4 w-4 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                        <span className="text-xs text-gray-400 dark:text-gray-500">{activity.timestamp}</span>
                      </div>
                    </div>
                    {/* Tooltip on hover/focus */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-900 text-white text-xs shadow-lg">
                        {avatar.label}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* New Poll Modal */}
      {showNewPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-sm shadow-xl border ${border}`}>
            <h3 className="text-lg font-semibold mb-4">Create New Poll</h3>
            <form
              className="flex flex-col gap-4"
              onSubmit={e => {
                e.preventDefault();
                setShowNewPollModal(false);
              }}
            >
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none"
                placeholder="Poll Title"
              />
              <textarea
                required
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none"
                placeholder="Description"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPollModal(false)}
                  className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdminDashboard; 