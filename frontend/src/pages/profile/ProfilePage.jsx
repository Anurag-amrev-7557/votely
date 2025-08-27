import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  BellIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  KeyIcon,
  MoonIcon,
  SunIcon,
  EyeIcon,
  EyeSlashIcon,
  FireIcon,
  ClockIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  SparklesIcon,
  TrophyIcon,
  BoltIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  WifiIcon,
  LockClosedIcon,
  EyeDropperIcon,
  LanguageIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArchiveBoxIcon,
  DocumentArrowDownIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  MinusIcon,
  UserIcon,
  FingerPrintIcon,
  CreditCardIcon,
  ShieldExclamationIcon,
  BellSlashIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import axiosInstance from '../../utils/api/axiosConfig';
import { useTheme } from '../../context/ThemeContext';
import { getBestProfilePhoto, handlePhotoError, handlePhotoLoad } from '../../utils/ui/photoUtils';

const sidebarOptions = [
  { key: 'profile', label: 'Profile', icon: UserCircleIcon, color: 'blue' },
  { key: 'account', label: 'Account', icon: Cog6ToothIcon, color: 'gray' },
  { key: 'security', label: 'Security', icon: ShieldCheckIcon, color: 'green' },
  { key: 'preferences', label: 'Preferences', icon: AdjustmentsHorizontalIcon, color: 'purple' },
  { key: 'activity', label: 'Activity', icon: ChartBarIcon, color: 'orange' },
];

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { setTheme: setThemeContext } = useTheme ? useTheme() : { setTheme: () => {} };
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [theme, setTheme] = useState('system');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('UTC-8 (Pacific Time)');

  // Profile state
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [googlePhotoFailed, setGooglePhotoFailed] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [bio, setBio] = useState('Passionate about democratic decision-making and community engagement through digital voting platforms.');
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    linkedin: '',
    github: '',
    website: ''
  });
  const [accountStatus, setAccountStatus] = useState({
    isVerified: true,
    isPremium: false,
    lastActive: new Date().toISOString(),
    joinDate: user?.createdAt || new Date().toISOString()
  });
  const [activityStats, setActivityStats] = useState({
    totalVotes: 47,
    pollsCreated: 8,
    comments: 23,
    shares: 12,
    totalPolls: 156,
    participationRate: 78,
    streakDays: 15,
    averageRating: 4.2,
    monthlyGrowth: 12.5,
    topCategory: 'Technology',
    engagementScore: 87
  });
  const [profileCompletion, setProfileCompletion] = useState(85);

  // Loading and notification states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showNotificationState, setShowNotificationState] = useState(false);

  // Enhanced activity state
  const [activityFilter, setActivityFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Activity data state
  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState(null);
  const [activityPagination, setActivityPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  // Security state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isTfaLoading, setIsTfaLoading] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'MacBook Pro', location: 'San Francisco, CA', lastActive: '2 minutes ago', current: true },
    { id: 2, device: 'iPhone 14', location: 'San Francisco, CA', lastActive: '1 hour ago', current: false },
    { id: 3, device: 'Chrome on Windows', location: 'New York, NY', lastActive: '3 days ago', current: false },
  ]);

  // Refs
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Map type to icon and color
  const activityTypeMap = {
    Voted: { icon: CheckBadgeIcon, color: 'green' },
    Created: { icon: PlusIcon, color: 'blue' },
    Commented: { icon: ChatBubbleLeftRightIcon, color: 'purple' },
    Shared: { icon: ArrowUpTrayIcon, color: 'orange' },
  };

  // Fetch activity from backend
  const fetchActivity = useCallback(async (page = 1) => {
    setActivityLoading(true);
    setActivityError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', activityPagination.limit);
      if (activityFilter && activityFilter !== 'all') params.append('type', activityFilter.charAt(0).toUpperCase() + activityFilter.slice(1));
      if (dateRange && dateRange !== 'all') params.append('dateRange', dateRange);
      const res = await axiosInstance.get(`/profile/activity?${params.toString()}`);
      let activities = res.data.activities || [];
      // Add icon/color
      activities = activities.map(item => {
        const map = activityTypeMap[item.type] || { icon: InformationCircleIcon, color: 'gray' };
        return { ...item, icon: map.icon, color: map.color };
      });
      // Search and category filter (client-side)
      let filtered = activities;
      if (searchQuery) {
        filtered = filtered.filter(item => item.desc?.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(item => selectedCategories.includes(item.category));
      }
      setActivity(filtered);
      setActivityPagination(res.data.pagination || { page, limit: activityPagination.limit, total: filtered.length, pages: 1 });
    } catch (err) {
      setActivityError('Failed to load activity.');
      setActivity([]);
    } finally {
      setActivityLoading(false);
    }
  }, [activityFilter, dateRange, searchQuery, selectedCategories, activityPagination.limit]);

  // Fetch activity when section/filter/search/page changes
  useEffect(() => {
    if (activeSection === 'activity') {
      fetchActivity(activityPagination.page);
    }
    // eslint-disable-next-line
  }, [activeSection, activityFilter, dateRange, searchQuery, selectedCategories, activityPagination.page]);

  // Pagination handlers
  const handleActivityPageChange = (newPage) => {
    setActivityPagination(prev => ({ ...prev, page: newPage }));
  };

  // Calculate profile completion with enhanced logic
  const calculateProfileCompletion = useCallback(() => {
    let completion = 0;
    if (user?.name) completion += 20;
    if (user?.email) completion += 15;
    if (profilePhoto) completion += 20;
    if (bio && bio.length > 10) completion += 15;
    if (socialLinks.twitter || socialLinks.linkedin || socialLinks.github || socialLinks.website) completion += 10;
    if (accountStatus.isVerified) completion += 10;
    if (user?.createdAt) completion += 10;
    return Math.min(completion, 100);
  }, [user, profilePhoto, bio, socialLinks, accountStatus]);

  // Update profile completion when dependencies change
  useEffect(() => {
    const newCompletion = calculateProfileCompletion();
    setProfileCompletion(newCompletion);
  }, [calculateProfileCompletion]);

  // Enhanced notification system
  const showNotification = useCallback((message, type = 'success', duration = 3000) => {
    setNotification({ message, type });
    setShowNotificationState(true);
    
    setTimeout(() => {
      setShowNotificationState(false);
      setTimeout(() => setNotification(null), 300);
    }, duration);
  }, []);

  // Enhanced drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handlePhotoUpload({ target: { files } });
    }
  }, []);

  // Enhanced photo upload handler
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Photo upload started:', file.name, file.size, file.type);
    console.log('Current user state:', user);
    console.log('User authenticated:', !!user);

    if (!user) {
      showNotification('Please log in to upload a profile photo', 'error');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('Please select a valid image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size must be less than 5MB', 'error');
      return;
    }

    setIsUploadingPhoto(true);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append('profilePhoto', file); // Fixed: Changed from 'photo' to 'profilePhoto'
      
      console.log('Sending request to /api/profile/photo');
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await fetch('/api/profile/photo', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        const photoUrl = getPhotoUrl(data.profilePhoto);
        setProfilePhoto(photoUrl); // Fixed: Changed from 'photoUrl' to 'profilePhoto'
        showNotification('Profile photo updated successfully!', 'success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      showNotification(`Failed to upload photo: ${error.message}`, 'error');
      setProfilePhotoPreview(null);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Enhanced profile update
  const updateProfile = async (profileData) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const data = await response.json();
        showNotification('Profile updated successfully!', 'success');
        return data;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showNotification('Failed to update profile. Please try again.', 'error');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Further enhanced save handler with validation, loading, and scroll-to-error
  const handleSave = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    // Simple validation example (expand as needed)
    let errors = {};
    if (typeof bio === 'string' && bio.length > 500) {
      errors.bio = 'Bio must be 500 characters or less.';
    }
    if (socialLinks) {
      Object.entries(socialLinks).forEach(([platform, value]) => {
        if (value && !/^https?:\/\//.test(value)) {
          errors[platform] = 'Please enter a valid URL (must start with http:// or https://)';
        }
      });
    }

    if (Object.keys(errors).length > 0) {
      // Optionally, set error state and scroll to first error
      showNotification(
        Object.values(errors).join(' '),
        'error'
      );
      // Scroll to the first error field if needed
      const firstErrorKey = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    setIsSaving(true);
    try {
      const profileData = {
        bio,
        socialLinks,
        accountStatus
      };

      await updateProfile(profileData);
      setEditing(false);
      setHasUnsavedChanges(false);
      showNotification('Your profile has been saved!', 'success');
    } catch (error) {
      // Error already handled in updateProfile
      // Optionally, add extra error handling here
    } finally {
      setIsSaving(false);
    }
  };

  // Enhanced social link handler
  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
    setHasUnsavedChanges(true);
  };

  // Enhanced section navigation
  const handleSectionChange = (section) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        setActiveSection(section);
        setHasUnsavedChanges(false);
      }
    } else {
      setActiveSection(section);
    }
  };

  // Enhanced activity filtering
  const filteredActivity = activity.filter(item => {
    const matchesFilter = activityFilter === 'all' || item.type.toLowerCase() === activityFilter;
    const matchesSearch = item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    
    return matchesFilter && matchesSearch && matchesCategory;
  });

  // Enhanced session management
  const terminateSession = (sessionId) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    showNotification('Session terminated successfully', 'success');
  };

  // Fetch 2FA status on mount
  useEffect(() => {
    const fetchTfaStatus = async () => {
      if (!user) {
        console.log('No user found, skipping 2FA status fetch');
        return;
      }
      
      // Check if user has an ID (indicating they're properly authenticated)
      if (!user.id && !user._id) {
        console.log('User object missing ID, skipping 2FA status fetch');
        return;
      }
      
      try {
        console.log('Fetching 2FA status for user:', user.id || user._id);
        const res = await axiosInstance.get('/profile/twofactor');
        console.log('2FA status response:', res.data);
        setTwoFactorEnabled(!!res.data.twoFactorEnabled);
      } catch (err) {
        console.error('Error fetching 2FA status:', err.response?.status, err.response?.data || err.message);
        if (err.response?.status === 401) {
          console.log('User not authenticated, setting 2FA to false');
        }
        setTwoFactorEnabled(false);
      }
    };
    fetchTfaStatus();
  }, [user]);

  // Enhanced 2FA toggle (persistent)
  const toggleTwoFactor = async () => {
    if (!user) {
      showNotification('Please log in to change 2FA settings', 'error');
      return;
    }
    setIsTfaLoading(true);
    try {
      const newStatus = !twoFactorEnabled;
      console.log('Toggling 2FA to:', newStatus);
      const res = await axiosInstance.post('/profile/twofactor', { enabled: newStatus });
      console.log('2FA toggle response:', res.data);
      setTwoFactorEnabled(res.data.twoFactorEnabled);
      showNotification(
        res.data.twoFactorEnabled ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled',
        'success'
      );
    } catch (err) {
      console.error('Error toggling 2FA:', err.response?.status, err.response?.data || err.message);
      if (err.response?.status === 401) {
        showNotification('Please log in to change 2FA settings', 'error');
      } else {
        showNotification('Failed to update 2FA status', 'error');
      }
    } finally {
      setIsTfaLoading(false);
    }
  };

  // Track unsaved changes
  // Store initial values after user loads
  const initialProfileRef = useRef({ bio: '', socialLinks: { twitter: '', linkedin: '', github: '', website: '' } });
  const [userLoaded, setUserLoaded] = useState(false);
  useEffect(() => {
    if (user) {
      initialProfileRef.current = {
        bio: user.bio || '',
        socialLinks: user.socialLinks || { twitter: '', linkedin: '', github: '', website: '' }
      };
      setUserLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (!userLoaded) return; // Don't check until user is loaded
    const hasChanges = editing ||
      bio !== initialProfileRef.current.bio ||
      Object.keys(initialProfileRef.current.socialLinks).some(
        key => (socialLinks[key] || '') !== (initialProfileRef.current.socialLinks[key] || '')
      );
    setHasUnsavedChanges(hasChanges);
  }, [editing, bio, socialLinks, userLoaded]);

  // Check if user is properly authenticated
  useEffect(() => {
    if (user) {
      console.log('User data from context:', {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        googlePhoto: user.googlePhoto,
        photoURL: user.photoURL,
        avatarUrl: user.avatarUrl,
        hasToken: !!document.cookie.includes('token'),
        cookies: document.cookie,
        allUserProps: Object.keys(user)
      });
    } else {
      console.log('No user data in context');
    }
  }, [user]);

  // Helper function to get full photo URL with improved Google photo handling
  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    
    // If it's already a full URL, return as is
    if (photoPath.startsWith('http')) {
      return photoPath;
    }
    
    // If it's a relative path, make it absolute
    if (photoPath.startsWith('/uploads/')) {
      return photoPath;
    }
    
    return photoPath;
  };

  // Enhanced function to get the best available profile photo
  const getBestProfilePhotoCallback = useCallback(() => {
    return getBestProfilePhoto(user, profilePhoto, profilePhotoPreview, googlePhotoFailed);
  }, [user, profilePhoto, profilePhotoPreview, googlePhotoFailed]);

  // Enhanced photo error handler
  const handlePhotoErrorCallback = useCallback((e, photoUrl) => {
    handlePhotoError(e, photoUrl, setGooglePhotoFailed);
  }, []);

  // Enhanced photo load handler
  const handlePhotoLoadCallback = useCallback((e, photoUrl) => {
    handlePhotoLoad(e, photoUrl, setGooglePhotoFailed);
  }, []);

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      console.log('Initializing profile data from user:', {
        name: user.name,
        bio: user.bio,
        profilePhoto: user.profilePhoto,
        googlePhoto: user.googlePhoto,
        photoURL: user.photoURL,
        avatarUrl: user.avatarUrl,
        socialLinks: user.socialLinks,
        userObject: user
      });
      
      setBio(user.bio || '');
      setSocialLinks(user.socialLinks || {
        twitter: '',
        linkedin: '',
        github: '',
        website: ''
      });
      
      // Get the best available profile photo
      const bestPhoto = getBestProfilePhotoCallback();
      console.log('Best available photo:', bestPhoto);
      setProfilePhoto(bestPhoto);
      
      setAccountStatus({
        isVerified: user.isVerified || false,
        isPremium: user.isPremium || false,
        joinDate: user.createdAt || new Date(),
        lastActive: user.lastActive || new Date()
      });
      setActivityStats(user.activityStats || {
        totalVotes: 0,
        pollsCreated: 0,
        comments: 0,
        shares: 0,
        totalPolls: 0,
        participationRate: 0,
        streakDays: 0,
        averageRating: 0,
        monthlyGrowth: 0,
        topCategory: '',
        engagementScore: 0
      });
    } else {
      console.log('No user data available for profile initialization');
    }
  }, [user, getBestProfilePhotoCallback]);

  // Load preferences from user object
  useEffect(() => {
    if (user && user.preferences) {
      setTheme(user.preferences.theme || 'system');
      setEmailAlerts(user.preferences.emailNotifications !== undefined ? user.preferences.emailNotifications : true);
      setPushNotifications(user.preferences.pushNotifications !== undefined ? user.preferences.pushNotifications : false);
      setLanguage(
        user.preferences.language === 'en' ? 'English' :
        user.preferences.language === 'es' ? 'Spanish' :
        user.preferences.language === 'fr' ? 'French' :
        user.preferences.language === 'de' ? 'German' : 'English'
      );
      setTimezone(
        user.preferences.timezone === 'UTC-8' ? 'UTC-8 (Pacific Time)' :
        user.preferences.timezone === 'UTC-5' ? 'UTC-5 (Eastern Time)' :
        user.preferences.timezone === 'UTC+0' ? 'UTC+0 (GMT)' :
        user.preferences.timezone === 'UTC+1' ? 'UTC+1 (Central European Time)' : 'UTC-8 (Pacific Time)'
      );
    }
  }, [user]);

  // Monitor profile photo state changes
  useEffect(() => {
    console.log('Profile photo state changed:', {
      profilePhoto,
      profilePhotoPreview,
      hasPhoto: !!(profilePhotoPreview || profilePhoto)
    });
  }, [profilePhoto, profilePhotoPreview]);

  // Ensure profile photo is set when user changes
  useEffect(() => {
    if (user) {
      const bestPhoto = getBestProfilePhotoCallback();
      if (bestPhoto && bestPhoto !== profilePhoto) {
        console.log('Setting profile photo from user change:', bestPhoto);
        setProfilePhoto(bestPhoto);
      }
    }
  }, [user, getBestProfilePhotoCallback, profilePhoto]);

  // Save preferences handler
  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // Map language and timezone to backend values
      const langMap = { 'English': 'en', 'Spanish': 'es', 'French': 'fr', 'German': 'de' };
      const tzMap = {
        'UTC-8 (Pacific Time)': 'UTC-8',
        'UTC-5 (Eastern Time)': 'UTC-5',
        'UTC+0 (GMT)': 'UTC+0',
        'UTC+1 (Central European Time)': 'UTC+1',
      };
      const preferences = {
        theme,
        emailNotifications: emailAlerts,
        pushNotifications,
        language: langMap[language] || 'en',
        timezone: tzMap[timezone] || 'UTC-8',
      };
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ preferences })
      });
      if (response.ok) {
        // Update theme in ThemeContext and localStorage
        if (setThemeContext) setThemeContext(theme);
        localStorage.setItem('theme', theme);
        showNotification('Preferences updated successfully!', 'success');
      } else {
        let errorMsg = 'Failed to update preferences';
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) errorMsg = errorData.error;
          else if (errorData && errorData.message) errorMsg = errorData.message;
        } catch {}
        showNotification(errorMsg, 'error');
      }
    } catch (error) {
      showNotification('Failed to update preferences. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (setThemeContext) setThemeContext(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setHasUnsavedChanges(false);
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Enhanced notification component
  const NotificationToast = () => (
    <AnimatePresence>
      {notification && showNotificationState && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border-l-4 flex items-center space-x-3 ${
            notification.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200' 
              : notification.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckIcon className="w-5 h-5 text-green-500" />
          ) : notification.type === 'error' ? (
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
          ) : (
            <InformationCircleIcon className="w-5 h-5 text-blue-500" />
          )}
          <span className="font-medium">{notification.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Enhanced loading overlay
  const LoadingOverlay = () => (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl flex flex-col items-center space-y-4"
          >
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">Loading...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderProfileSection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
          <div className="absolute top-4 right-4 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
          {/* Profile Photo */}
          <div className="relative group flex-shrink-0">
            <motion.div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 shadow-lg ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105' 
                  : 'border-gray-200 dark:border-gray-700'
              } ${isUploadingPhoto ? 'animate-pulse' : ''}`}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
            >
              {getBestProfilePhotoCallback() ? (
                <img
                  src={getBestProfilePhotoCallback()}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => handlePhotoErrorCallback(e, getBestProfilePhotoCallback())}
                  onLoad={(e) => handlePhotoLoadCallback(e, getBestProfilePhotoCallback())}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                  {user?.name ? (
                    <span className="text-2xl font-bold text-white">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  ) : (
                    <UserCircleIcon className="w-16 h-16 text-white" />
                  )}
                </div>
              )}
              {/* Upload Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isDragOver ? 1 : 0 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm pointer-events-none"
              >
                <div className="text-center text-white">
                  <ArrowUpTrayIcon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Drop image here</p>
                </div>
              </motion.div>
              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center focus:outline-none focus:opacity-100"
                aria-label="Change profile photo"
                tabIndex={0}
              >
                <div className="text-center text-white">
                  <PhotoIcon className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-xs">Change Photo</p>
                </div>
              </button>
            </motion.div>
            {/* Upload Progress */}
            {isUploadingPhoto && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </motion.div>
            )}
            {/* Profile Photo Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg"
            >
              Active
            </motion.div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          {/* Main Info */}
          <div className="flex-1 space-y-3 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold text-gray-900 dark:text-white truncate"
              >
                {user?.name || 'User Name'}
              </motion.h2>
              {accountStatus.isVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full"
                  title="Verified Account"
                >
                  <CheckBadgeIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Verified</span>
                </motion.div>
              )}
              {accountStatus.isPremium && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full"
                  title="Premium User"
                >
                  <TrophyIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Premium</span>
                </motion.div>
              )}
            </div>
            <motion.div className="flex items-center gap-2">
              <EnvelopeIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400 truncate">{user?.email || 'user@example.com'}</span>
              <button
                type="button"
                className="ml-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Copy email"
                onClick={() => navigator.clipboard.writeText(user?.email || '')}
              >
                <DocumentDuplicateIcon className="w-4 h-4 text-gray-400" />
              </button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
            >
              <span className="flex items-center gap-1">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>Joined {new Date(accountStatus.joinDate).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>Last active {new Date(accountStatus.lastActive).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center gap-1">
                <FireIcon className="w-4 h-4 text-orange-500" />
                <span>{activityStats.streakDays} day streak</span>
              </span>
            </motion.div>
          </div>
          {/* Profile Completion */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-right min-w-[180px]"
          >
            <div className="flex items-center space-x-2 mb-3">
              <SparklesIcon className="w-6 h-6 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Completion
              </span>
            </div>
            <div className="relative w-36 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner group">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profileCompletion}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </motion.div>
              {/* Tooltip on hover */}
              <div className="absolute left-1/2 -top-8 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg z-10">
                {profileCompletion < 100 ? `${100 - profileCompletion}% left to complete your profile` : 'Profile complete!'}
              </div>
            </div>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-lg font-bold text-gray-900 dark:text-white"
            >
              {profileCompletion}%
            </motion.span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {profileCompletion < 100 ? `${100 - profileCompletion}% to complete` : 'Profile complete!'}
            </p>
          </motion.div>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Me Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 relative"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  About Me
                </h3>
              </div>
              {editing && (
                <button
                  onClick={() => setEditing(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Cancel editing"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-blue-500 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ml-2"
                  title="Edit bio"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            {editing ? (
              <div className="space-y-3">
                <textarea
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-colors"
                  placeholder="Tell us about yourself, your interests, and what drives you..."
                  maxLength={500}
                />
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{bio.length}/500 characters</span>
                  <span className={`${bio.length > 450 ? 'text-orange-500' : 'text-green-500'}`}> 
                    {bio.length > 450 ? 'Getting long!' : 'Good length'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {bio || "No bio added yet. Click 'Edit Profile' to add your story!"}
                </p>
                {!bio && (
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-sm">
                    <InformationCircleIcon className="w-4 h-4" />
                    <span>Adding a bio helps others get to know you better</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
          {/* Social Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <GlobeAltIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Social Links
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'twitter', label: 'Twitter', icon: '🐦', placeholder: 'https://twitter.com/username', color: 'blue' },
                { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/username', color: 'blue' },
                { key: 'github', label: 'GitHub', icon: '💻', placeholder: 'https://github.com/username', color: 'gray' },
                { key: 'website', label: 'Website', icon: '🌐', placeholder: 'https://yourwebsite.com', color: 'green' }
              ].map(({ key, label, icon, placeholder, color }) => (
                <motion.div 
                  key={key} 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  title={label}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <span>{icon}</span>
                    <span>{label}</span>
                  </label>
                  {editing ? (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={socialLinks[key]}
                        onChange={(e) => handleSocialLinkChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                      />
                      {socialLinks[key] && (
                        <div className="text-xs text-green-600 dark:text-green-400 flex items-center space-x-1">
                          <CheckIcon className="w-3 h-3" />
                          <span>Valid URL format</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {socialLinks[key] ? (
                        <a
                          href={socialLinks[key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate flex items-center space-x-2 group"
                          title={`Visit ${label}`}
                        >
                          <span>{socialLinks[key]}</span>
                          <ArrowUpTrayIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 italic flex items-center space-x-2">
                          <span>Not added</span>
                          <PlusIcon className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* Achievements Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-yellow-900/10 dark:via-gray-900 dark:to-blue-900/10 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Achievements & Stats
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: CheckBadgeIcon, label: 'Votes Cast', value: activityStats.totalVotes, color: 'blue' },
                { icon: PlusIcon, label: 'Polls Created', value: activityStats.pollsCreated, color: 'green' },
                { icon: ChatBubbleLeftRightIcon, label: 'Comments', value: activityStats.comments, color: 'purple' },
                { icon: FireIcon, label: 'Day Streak', value: activityStats.streakDays, color: 'orange' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`text-center p-4 rounded-lg shadow-sm hover:shadow-md transition-colors bg-${stat.color}-50 dark:bg-${stat.color}-900/10`}
                  title={stat.label}
                >
                  <div className={`w-8 h-8 mx-auto mb-2 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Sidebar: Account Status & Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6 lg:sticky lg:top-24 h-fit"
        >
          {/* Account Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Status
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Verification</span>
                <div className="flex items-center space-x-2">
                  {accountStatus.isVerified ? (
                    <CheckBadgeIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    accountStatus.isVerified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {accountStatus.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Plan</span>
                <div className="flex items-center space-x-2">
                  {accountStatus.isPremium ? (
                    <TrophyIcon className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <UserCircleIcon className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    accountStatus.isPremium ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {accountStatus.isPremium ? 'Premium' : 'Free'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(accountStatus.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <BoltIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEditing(!editing)}
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                title={editing ? 'Cancel editing' : 'Edit profile'}
              >
                <div className="flex items-center space-x-3">
                  <PencilSquareIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {editing ? 'Cancel Editing' : 'Edit Profile'}
                  </span>
                </div>
                <ArrowRightOnRectangleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </motion.button>
              {editing && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
                  title="Save changes"
                >
                  {isSaving ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderAccountSection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Enhanced Account Overview with Animated Stats */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <UserCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Information</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Account Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                      <UserIcon className="w-4 h-4" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                      <EnvelopeIcon className="w-4 h-4" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                      <FingerPrintIcon className="w-4 h-4" />
                      <span>User ID</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={user?._id || 'N/A'}
                        disabled
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(user?._id || '')}
                        className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="Copy User ID"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                      <StarIcon className="w-4 h-4" />
                      <span>Account Type</span>
                    </label>
                    <div className={`flex items-center space-x-3 px-4 py-3 border rounded-lg transition-all duration-300 ${
                      accountStatus.isPremium 
                        ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' 
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600'
                    }`}>
                      {accountStatus.isPremium ? (
                        <TrophyIcon className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <UserCircleIcon className="w-5 h-5 text-gray-400" />
                      )}
                      <span className={`font-medium ${
                        accountStatus.isPremium 
                          ? 'text-yellow-700 dark:text-yellow-300' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {accountStatus.isPremium ? 'Premium' : 'Free'}
                      </span>
                      {accountStatus.isPremium && (
                        <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                          Pro
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Enhanced Account Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5 text-blue-600" />
                  <span>Account Stats</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(accountStatus.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Active</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(accountStatus.lastActive).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Verification</span>
                    <span className="flex items-center space-x-1">
                      {accountStatus.isVerified ? (
                        <>
                          <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Verified</span>
                        </>
                      ) : (
                        <>
                          <ExclamationCircleIcon className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Password Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <KeyIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Password & Security</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account password and security settings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Confirm new password"
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <KeyIcon className="w-4 h-4" />
              <span>{isChangingPassword ? 'Changing...' : 'Change Password'}</span>
            </motion.button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                <span>Password Strength</span>
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">At least 8 characters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Contains uppercase letter</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Contains number</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Contains special character</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Subscription & Billing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <CreditCardIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subscription & Billing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your subscription plan and billing information</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Plan */}
          <div className="space-y-4">
            <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${
              accountStatus.isPremium 
                ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' 
                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {accountStatus.isPremium ? (
                    <TrophyIcon className="w-8 h-8 text-yellow-500" />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {accountStatus.isPremium ? 'Premium Plan' : 'Free Plan'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {accountStatus.isPremium ? 'Unlimited features' : 'Basic features'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {accountStatus.isPremium ? '$9.99' : '$0'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">per month</div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {accountStatus.isPremium ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <CheckIcon className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Unlimited polls</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckIcon className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Advanced analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckIcon className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Priority support</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <CheckIcon className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">5 polls per month</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckIcon className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Basic analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <XMarkIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Community support</span>
                    </div>
                  </>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  accountStatus.isPremium 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {accountStatus.isPremium ? 'Manage Plan' : 'Upgrade to Premium'}
              </motion.button>
            </div>
          </div>

          {/* Billing History */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <ClockIcon className="w-4 h-4" />
              <span>Billing History</span>
            </h4>
            <div className="space-y-3">
              {accountStatus.isPremium ? (
                <>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Premium Plan</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">June 2024</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">$9.99</div>
                      <div className="text-sm text-green-600 dark:text-green-400">Paid</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Premium Plan</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">May 2024</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">$9.99</div>
                      <div className="text-sm text-green-600 dark:text-green-400">Paid</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <CreditCardIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No billing history</p>
                  <p className="text-sm">Upgrade to see your billing information</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Data & Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <ShieldExclamationIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Data & Privacy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your data and privacy settings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <DocumentArrowDownIcon className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <span className="text-gray-900 dark:text-white font-medium">Export My Data</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Download all your data</p>
                </div>
              </div>
              <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <EyeSlashIcon className="w-5 h-5 text-orange-600" />
                <div className="text-left">
                  <span className="text-gray-900 dark:text-white font-medium">Privacy Settings</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your privacy</p>
                </div>
              </div>
              <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400" />
            </motion.button>
          </div>
          
          <div className="space-y-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <BellSlashIcon className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <span className="text-gray-900 dark:text-white font-medium">Deactivate Account</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Temporarily disable account</p>
                </div>
              </div>
              <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <TrashIcon className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <span className="text-red-700 dark:text-red-300 font-medium">Delete Account</span>
                  <p className="text-sm text-red-600 dark:text-red-400">Permanently delete account</p>
                </div>
              </div>
              <ArrowRightOnRectangleIcon className="w-4 h-4 text-red-400" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Data Privacy Controls */}
      <div className="mt-10 flex flex-col md:flex-row gap-4">
        <button
          onClick={handleExportData}
          disabled={isExporting}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isExporting ? 'Exporting...' : 'Export My Data'}
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={isDeleting}
          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Delete My Account'}
        </button>
      </div>
    </motion.div>
  );

  const renderSecuritySection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Security Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <ShieldCheckIcon className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-green-900 dark:text-green-100">Account Secure</h3>
            <p className="text-sm text-green-700 dark:text-green-300">Your account is protected</p>
          </div>
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <KeyIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Strong Password</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">Password meets requirements</p>
          </div>
          <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <BellIcon className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Login Alerts</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Get notified of new logins</p>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
            <p className="text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
          </div>
          <button
            onClick={toggleTwoFactor}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              twoFactorEnabled
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            disabled={isTfaLoading}
          >
            {isTfaLoading ? 'Saving...' : (twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA')}
          </button>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {twoFactorEnabled ? (
            <CheckIcon className="w-5 h-5 text-green-600" />
          ) : (
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
          )}
          <span className="text-gray-700 dark:text-gray-300">
            {twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
          </span>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Active Sessions</h3>
        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <ComputerDesktopIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{session.device}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{session.location} • {session.lastActive}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {session.current && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full">
                    Current
                  </span>
                )}
                {!session.current && (
                  <button
                    onClick={() => terminateSession(session.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderPreferencesSection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Theme & Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Preferences</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme & Appearance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['light', 'dark', 'system'].map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    theme === themeOption
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {themeOption === 'light' && <SunIcon className="w-5 h-5 text-yellow-500" />}
                    {themeOption === 'dark' && <MoonIcon className="w-5 h-5 text-blue-500" />}
                    {themeOption === 'system' && <ComputerDesktopIcon className="w-5 h-5 text-gray-500" />}
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{themeOption}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailAlerts ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BellIcon className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notified in real-time</p>
                  </div>
                </div>
                <button
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    pushNotifications ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Language & Region</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Zone</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                >
                  <option>UTC-8 (Pacific Time)</option>
                  <option>UTC-5 (Eastern Time)</option>
                  <option>UTC+0 (GMT)</option>
                  <option>UTC+1 (Central European Time)</option>
                </select>
              </div>
            </div>
          </div>
          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderActivitySection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Activity Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Activity Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{activityStats.totalVotes}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Votes</div>
          </div>
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{activityStats.pollsCreated}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Polls Created</div>
          </div>
          <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{activityStats.comments}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Comments</div>
          </div>
          <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">{activityStats.streakDays}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Activity Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Activities</option>
            <option value="Voted">Votes</option>
            <option value="Created">Created</option>
            <option value="Commented">Comments</option>
            <option value="Shared">Shares</option>
          </select>
          {/* Date range filter (optional) */}
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {activityLoading && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading activity...</div>
          )}
          {activityError && (
            <div className="p-6 text-center text-red-500 dark:text-red-400">{activityError}</div>
          )}
          {!activityLoading && !activityError && activity.length === 0 && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">No activity found.</div>
          )}
          {!activityLoading && !activityError && activity.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${item.color}-100 dark:bg-${item.color}-900/20`}>
                    <Icon className={`w-5 h-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.desc}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.date} at {item.time} • {item.category}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                      item.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    }`}>
                      {item.impact} impact
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Pagination */}
        {activityPagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4">
            <button
              onClick={() => handleActivityPageChange(Math.max(1, activityPagination.page - 1))}
              disabled={activityPagination.page === 1}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700 dark:text-gray-200">
              Page {activityPagination.page} of {activityPagination.pages}
            </span>
            <button
              onClick={() => handleActivityPageChange(Math.min(activityPagination.pages, activityPagination.page + 1))}
              disabled={activityPagination.page === activityPagination.pages}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    setNotification(null);
    try {
      const res = await axiosInstance.get('/profile/export-data');
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data.data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', 'votely-user-data.json');
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      setNotification({ type: 'success', message: 'Your data has been exported.' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to export data.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    setIsDeleting(true);
    setNotification(null);
    try {
      await axios.delete('/api/profile/delete-account', { withCredentials: true });
      setNotification({ type: 'success', message: 'Your account has been deleted.' });
      setTimeout(() => {
        logout();
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to delete account.' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler for changing password
  const handleChangePassword = async () => {
    if (!password || !newPassword || !confirmNewPassword) {
      showNotification('Please fill in all password fields.', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showNotification('New passwords do not match.', 'error');
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await axiosInstance.post('/profile/change-password', {
        currentPassword: password,
        newPassword,
      }, { withCredentials: true });
      showNotification(res.data.message || 'Password changed successfully.', 'success');
      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password.';
      showNotification(msg, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Notification System */}
      <NotificationToast />
      
      {/* Enhanced Loading Overlay */}
      <LoadingOverlay />

      <div className="w-full max-w-7xl px-6 sm:px-8 lg:px-12 mx-auto">
        {/* Header with unsaved changes warning */}
        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                You have unsaved changes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-md transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white rounded-md transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 mt-3">
          {/* Ultra-Enhanced Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <nav className="bg-white/90 dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-8 shadow-lg backdrop-blur-md transition-all duration-300">
              {/* User Profile Quick Info */}
              <div className="flex items-center gap-4 mb-6 px-2">
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {getBestProfilePhotoCallback() ? (
                      <img
                        src={getBestProfilePhotoCallback()}
                        alt="User avatar"
                        className="w-12 h-12 rounded-full border-2 border-primary-500 shadow"
                        onError={(e) => handlePhotoErrorCallback(e, getBestProfilePhotoCallback())}
                        onLoad={(e) => handlePhotoLoadCallback(e, getBestProfilePhotoCallback())}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full border-2 border-primary-500 shadow bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        {user?.name ? (
                          <span className="text-sm font-bold text-white">
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        ) : (
                          <UserCircleIcon className="w-6 h-6 text-white" />
                        )}
                      </div>
                    )}
                  </motion.div>
                  {/* Online status dot */}
                  <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-800 shadow" title="Online"></span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 text-base truncate max-w-[10rem]">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[10rem]">{user?.email}</div>
                </div>
              </div>
              {/* Sidebar Navigation */}
              <div className="space-y-1 relative">
                {sidebarOptions.map((opt, index) => {
                  const Icon = opt.icon;
                  const isActive = activeSection === opt.key;
                  return (
                    <motion.button
                      key={opt.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() => handleSectionChange(opt.key)}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-${opt.color}-400 ${
                        isActive
                          ? `bg-${opt.color}-50 dark:bg-${opt.color}-900/30 text-${opt.color}-700 dark:text-${opt.color}-200 shadow`
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active-bar"
                          className={`absolute left-0 top-0 h-full w-1.5 rounded-full bg-${opt.color}-500 shadow-md`}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="flex items-center">
                        <Icon className={`w-5 h-5 transition-colors ${
                          isActive
                            ? `text-${opt.color}-600 dark:text-${opt.color}-300 drop-shadow`
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                        }`} />
                      </span>
                      <span className="truncate">{opt.label}</span>
                      {/* Optional: badge for notifications */}
                      {opt.badge && (
                        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-${opt.color}-100 dark:bg-${opt.color}-800 text-${opt.color}-700 dark:text-${opt.color}-200`}>
                          {opt.badge}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              {/* Theme Toggle & Settings */}
              <div className="flex items-center justify-between mt-8 mb-2 px-2">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-300 transition"
                  title="Toggle theme"
                  type="button"
                >
                  <span className="sr-only">Toggle theme</span>
                  {theme === 'dark' ? (
                    <MoonIcon className="w-5 h-5" />
                  ) : (
                    <SunIcon className="w-5 h-5" />
                  )}
                  <span>{theme === 'dark' ? 'Dark' : 'Light'} mode</span>
                </button>
                <button
                  onClick={() => handleSectionChange('preferences')}
                  className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-300 transition"
                  title="Preferences"
                  type="button"
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  <span>Preferences</span>
                </button>
              </div>
              {/* Enhanced Logout Section */}
              <div className="mt-4 pt-5 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.03, x: 2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={logout}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Sign Out</span>
                </motion.button>
              </div>
            </nav>
          </aside>

          {/* Enhanced Main Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {activeSection === 'profile' && renderProfileSection()}
                {activeSection === 'account' && renderAccountSection()}
                {activeSection === 'security' && renderSecuritySection()}
                {activeSection === 'preferences' && renderPreferencesSection()}
                {activeSection === 'activity' && renderActivitySection()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md">
              <h3 id="delete-account-title" className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Delete Account</h3>
              <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">Are you sure you want to <span className="font-semibold text-red-600 dark:text-red-400">permanently delete your account</span>? This action cannot be undone and all your data will be erased.</div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition">Cancel</button>
                <button onClick={handleDeleteAccount} className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition" disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;