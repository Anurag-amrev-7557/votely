import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';
import debounce from 'lodash/debounce';
import { CSVLink } from 'react-csv';
import format from 'date-fns/format';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { showNotification, showSuccessToast, showErrorToast, showWarningToast, showInfoToast, showLoadingToast, showCustomToast } from '../../utils/toastUtils.jsx';
import adminAxios from '../../utils/api/adminAxios';
import {
  Search,
  Plus,
  Filter,
  Users,
  Download,
  RefreshCw,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Shield,
  UserCircle,
  X
} from 'lucide-react';

// --- VISUAL UTILITIES (From PollsPage) ---
const NoiseTexture = () => (
  <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
  </div>
);

const SpotlightEffect = ({ mouseX, mouseY }) => (
  <motion.div
    className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
    style={{
      background: useMotionTemplate`radial-gradient(
        650px circle at ${mouseX}px ${mouseY}px,
        rgba(14, 165, 233, 0.08),
        transparent 80%
      )`,
    }}
  />
);

import { StepIndicator } from '../../components/ui/StepIndicator';
import { CustomDropdown } from '../../components/ui/CustomDropdown';
import { AnimatedModal } from '../../components/ui/AnimatedModal';
import { CustomDateTimePicker } from '../../components/ui/CustomDateTimePicker'; // Added import

const UsersPage = () => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { start: '', end: '' },
    department: '',
    organization: '',
    lastLogin: '',
  });
  const [viewMode, setViewMode] = useState('table');
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userActivity, setUserActivity] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
    phone: '',
    address: '',
    organization: '',
    department: '',
    lastLogin: '',
    permissions: {
      canCreatePolls: false,
      canManageUsers: false,
      canViewResults: true,
      canExportData: false
    }
  });

  // State for fetched users
  const [users, setUsers] = useState([]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params = {
        page,
        limit: 10,
        search: searchQuery,
        role: filterRole !== 'all' ? filterRole : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        sort: sortConfig.key,
        order: sortConfig.direction
      };

      const { data } = await adminAxios.get('/users', { params });
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotalUsers(data.totalUsers || data.count || (data.users || []).length);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showErrorToast(error.response?.data?.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, searchQuery, filterRole, filterStatus, sortConfig]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('permissions.')) {
      const permissionKey = name.split('.')[1];
      setUserForm(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permissionKey]: checked
        }
      }));
    } else {
      setUserForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '', // Reset password field
      role: user.role,
      status: user.status,
      phone: user.phone || '',
      address: user.address || '',
      organization: user.organization || '',
      department: user.department || '',
      lastLogin: user.lastLogin || '',
      permissions: user.permissions || {
        canCreatePolls: false,
        canManageUsers: false,
        canViewResults: true,
        canExportData: false
      }
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setUsers(users.filter(u => u.id !== user.id));
    toast.success('User deleted successfully', {
      icon: '🗑️',
      style: {
        borderRadius: '10px',
        background: '#EF4444',
        color: '#fff',
      },
    });
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const confirmDelete = () => {
    setUsers(users.filter(user => user.id !== userToDelete.id));
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update existing user
        const { data } = await adminAxios.put(`/users/${selectedUser.id}`, userForm);
        setUsers(users.map(user =>
          user.id === selectedUser?.id
            ? { ...user, ...data } // Merge updated data
            : user
        ));
        toast.success('User updated successfully', {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#10B981',
            color: '#fff',
          },
        });
      } else {
        // Create new user
        const { data } = await adminAxios.post('/users', {
          ...userForm,
          password: userForm.password || 'Password123!', // Use provided password or default
        });

        setUsers([data, ...users]); // Add to top
        toast.success('User created successfully', {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#10B981',
            color: '#fff',
          },
        });
      }

      setShowModal(false);
      setUserForm({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        phone: '',
        address: '',
        organization: '',
        department: '',
        lastLogin: '',
        permissions: {
          canCreatePolls: false,
          canManageUsers: false,
          canViewResults: true,
          canExportData: false
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error("User save error:", error);
      showErrorToast(error.response?.data?.error || 'Failed to save user');
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredUsers = users; // Use fetched users directly

  // Add these new button styles at the top of the component
  const buttonStyles = {
    primary: `inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
      bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
      transition-all duration-200 transform hover:scale-105 active:scale-95`,
    secondary: `inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm 
      text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 
      hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
      transition-all duration-200 transform hover:scale-105 active:scale-95`,
    danger: `inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
      bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
      transition-all duration-200 transform hover:scale-105 active:scale-95`,
    success: `inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
      bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
      transition-all duration-200 transform hover:scale-105 active:scale-95`,
    warning: `inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
      bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 
      transition-all duration-200 transform hover:scale-105 active:scale-95`,
  };

  // Add these icon styles
  const iconStyles = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  // Add this new style for bulk actions container
  const bulkActionsStyles = {
    container: `fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 
      shadow-lg transform transition-all duration-300 ease-in-out z-50`,
    content: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4`,
    header: `flex items-center justify-between`,
    title: `text-sm font-medium text-gray-700 dark:text-gray-200`,
    count: `ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200`,
    actions: `flex items-center space-x-3`,
    button: {
      base: `inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
        transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2`,
      success: `bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 
        hover:bg-green-100 dark:hover:bg-green-900/30 focus:ring-green-500`,
      warning: `bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 
        hover:bg-yellow-100 dark:hover:bg-yellow-900/30 focus:ring-yellow-500`,
      danger: `bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 
        hover:bg-red-100 dark:hover:bg-red-900/30 focus:ring-red-500`,
    }
  };

  // Add these new styles for action buttons
  const actionButtonStyles = {
    base: `p-2 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95`,
    edit: `text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 
      hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`,
    delete: `text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 
      hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`,
    tooltip: `absolute z-10 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 
      rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 
      -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap`
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Removed early return for isLoading to prevent page flash on search/filter updates

  return (
    <div className="w-full min-h-screen p-6 md:p-8 md:pr-0 space-y-8 animate-fade-in pb-24" role="main" aria-label="Admin users management" tabIndex={0}>
      {/* Users List Section */}
      {/* Users List Section */}
      {/* Header Section - Redesigned with Pill Stats */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600 dark:text-zinc-400 mb-2">
            Administration
          </h2>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
            Manage <span className="text-gray-600 dark:text-zinc-400">Users.</span>
          </h1>
        </div>

        <div className="flex flex-col-reverse md:flex-row items-end md:items-center gap-4">
          {/* Pill Shaped Stats */}
          <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full px-5 py-2.5 shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{users.length}</span>
                <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium">total</span>
              </div>
            </div>

            <div className="w-px h-4 bg-gray-200 dark:bg-zinc-800"></div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{users.filter(u => u.status === 'active').length}</span>
                <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium">active</span>
              </div>
            </div>

            <div className="w-px h-4 bg-gray-200 dark:bg-zinc-800"></div>

            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-500" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{users.filter(u => u.role === 'admin').length}</span>
                <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium">admins</span>
              </div>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-200 dark:bg-zinc-800 hidden md:block"></div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowModal(true);
                setIsEditing(false);
                setUserForm({
                  name: '',
                  email: '',
                  password: '',
                  role: 'user',
                  status: 'active',
                  phone: '',
                  address: '',
                  organization: '',
                  department: '',
                  lastLogin: '',
                  permissions: {
                    canCreatePolls: false,
                    canManageUsers: false,
                    canViewResults: true,
                    canExportData: false
                  }
                });
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold tracking-tight hover:scale-105 transition-transform duration-200 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
              aria-label="Create new user"
            >
              <Plus className="w-5 h-5" />
              <span>New User</span>
            </button>
            <CSVLink
              data={filteredUsers.map(user => ({
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                organization: user.organization,
                department: user.department,
                lastLogin: user.lastLogin,
              }))}
              headers={[
                { label: "Name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Role", key: "role" },
                { label: "Status", key: "status" },
                { label: "Organization", key: "organization" },
                { label: "Department", key: "department" },
                { label: "Last Login", key: "lastLogin" }
              ]}
              filename={`users-${format(new Date(), 'yyyy-MM-dd')}.csv`}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 font-medium hover:border-gray-300 dark:hover:border-zinc-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Export users to CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </CSVLink>
          </div>
        </div>
      </header>

      {/* Filters Section - Simplified Layout */}
      <form
        className="mb-8 mt-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-wrap items-stretch gap-3 h-11">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px] h-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, department..."
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              className="w-full h-full pl-9 pr-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Search users"
            />
          </div>

          {/* Status Filter */}
          <div className="w-40 h-full">
            <CustomDropdown
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended' }
              ]}
              icon={Activity}
              placeholder="Status"
              className="h-full"
            />
          </div>

          {/* Role Filter */}
          <div className="w-40 h-full">
            <CustomDropdown
              value={filterRole}
              onChange={(value) => setFilterRole(value)}
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'admin', label: 'Admin' },
                { value: 'moderator', label: 'Moderator' },
                { value: 'user', label: 'User' }
              ]}
              icon={Shield}
              placeholder="Role"
              className="h-full"
            />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 h-full rounded-lg text-sm font-medium transition-all ${showFilters
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
              : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset`}
            aria-expanded={showFilters}
            aria-controls="advanced-filters"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            title="Refresh"
            aria-label="Refresh user list"
            className="px-4 h-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-visible" // Changed from hidden to visible
              id="advanced-filters"
            >
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <CustomDateTimePicker
                        value={advancedFilters.dateRange.start}
                        onChange={(e) => setAdvancedFilters(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, start: e.target.value }
                        }))}
                        type="date"
                        placeholder="Start Date"
                      />
                      <CustomDateTimePicker
                        value={advancedFilters.dateRange.end}
                        onChange={(e) => setAdvancedFilters(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value }
                        }))}
                        type="date"
                        placeholder="End Date"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">Department</label>
                    <div className="w-full relative z-20">
                      <CustomDropdown
                        value={advancedFilters.department}
                        onChange={(value) => setAdvancedFilters(prev => ({
                          ...prev,
                          department: value
                        }))}
                        options={[
                          { value: '', label: 'All Departments' },
                          { value: 'IT', label: 'IT' },
                          { value: 'HR', label: 'HR' },
                          { value: 'Operations', label: 'Operations' }
                        ]}
                        placeholder="Select Department"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">Organization</label>
                    <div className="w-full relative z-10">
                      <CustomDropdown
                        value={advancedFilters.organization}
                        onChange={(value) => setAdvancedFilters(prev => ({
                          ...prev,
                          organization: value
                        }))}
                        options={[
                          { value: '', label: 'All Organizations' },
                          { value: 'VoteSafe Inc', label: 'VoteSafe Inc' }
                        ]}
                        placeholder="Select Organization"
                      />
                    </div>
                  </div>
                </div>

                {/* Filter Summary Badges */}
                {(searchQuery || filterStatus !== 'all' || filterRole !== 'all' || advancedFilters.department || advancedFilters.organization) && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800 text-xs text-gray-500 dark:text-zinc-400">
                    <span>Active Filters:</span>
                    {searchQuery && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                        Search: "{searchQuery}"
                      </span>
                    )}
                    {filterStatus !== 'all' && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                        Status: {filterStatus}
                      </span>
                    )}
                    {filterRole !== 'all' && (
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">
                        Role: {filterRole}
                      </span>
                    )}
                    {advancedFilters.department && (
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                        Dept: {advancedFilters.department}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterStatus('all');
                        setFilterRole('all');
                        setAdvancedFilters({ dateRange: { start: '', end: '' }, department: '', organization: '', lastLogin: '' });
                      }}
                      className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Bulk Actions */}
      {
        selectedUsers.length > 0 && (
          <div className={bulkActionsStyles.container}>
            <div className={bulkActionsStyles.content}>
              <div className={bulkActionsStyles.header}>
                <div className="flex items-center">
                  <span className={bulkActionsStyles.title}>
                    Selected Users
                    <span className={bulkActionsStyles.count}>
                      {selectedUsers.length}
                    </span>
                  </span>
                </div>
                <div className={bulkActionsStyles.actions}>
                  <button
                    onClick={async () => {
                      try {
                        await adminAxios.post('/users/bulk-update', {
                          userIds: selectedUsers,
                          action: 'setActive',
                          value: true
                        });
                        // Update local state
                        setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, isActive: true, status: 'active' } : u));
                        setSelectedUsers([]);
                        toast.success('Selected users activated successfully', {
                          icon: '✅',
                          style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
                        });
                      } catch (err) {
                        toast.error('Failed to activate selected users');
                      }
                    }}
                    className={`${bulkActionsStyles.button.base} ${bulkActionsStyles.button.success}`}
                  >
                    <svg className={`${iconStyles.md} mr-2`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                    Activate
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await adminAxios.post('/users/bulk-update', {
                          userIds: selectedUsers,
                          action: 'setActive',
                          value: false
                        });
                        // Update local state
                        setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, isActive: false, status: 'inactive' } : u));
                        setSelectedUsers([]);
                        toast.success('Selected users deactivated successfully', {
                          icon: '⚠️',
                          style: { borderRadius: '10px', background: '#F59E0B', color: '#fff' },
                        });
                      } catch (err) {
                        toast.error('Failed to deactivate selected users');
                      }
                    }}
                    className={`${bulkActionsStyles.button.base} ${bulkActionsStyles.button.warning}`}
                  >
                    <svg className={`${iconStyles.md} mr-2`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Deactivate
                  </button>
                  <button
                    onClick={() => setShowBulkDeleteConfirm(true)}
                    className={`${bulkActionsStyles.button.base} ${bulkActionsStyles.button.danger}`}
                  >
                    <svg className={`${iconStyles.md} mr-2`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedUsers([])}
                    className="ml-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                      transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }


      {/* Users Table */}
      {/* Pagination moved above table */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-zinc-900 px-4 py-3 border-x border-t border-gray-200 dark:border-zinc-800 rounded-t-xl mb-0">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{users.length > 0 ? (page - 1) * 10 + 1 : 0}</span> to{' '}
            <span className="font-medium">{Math.min(page * 10, totalUsers)}</span> of{' '}
            <span className="font-medium">{totalUsers}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'
                } text-sm font-medium ${isDarkMode
                  ? 'text-gray-300 bg-[#2c353f] hover:bg-gray-700'
                  : 'text-gray-500 bg-white hover:bg-gray-50'
                } transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="sr-only">Previous</span>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </button>
            {/* Smart Pagination */}
            {(() => {
              const pages = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                if (page <= 4) {
                  pages.push(1, 2, 3, 4, 5, '...', totalPages);
                } else if (page >= totalPages - 3) {
                  pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                } else {
                  pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
                }
              }

              return pages.map((p, i) => (
                <button
                  key={i}
                  onClick={() => typeof p === 'number' && setPage(p)}
                  disabled={typeof p !== 'number'}
                  className={`relative inline-flex items-center px-4 py-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    } text-sm font-medium ${page === p
                      ? 'z-10 bg-black text-white dark:bg-white dark:text-black border-transparent'
                      : typeof p !== 'number'
                        ? 'text-gray-500 bg-white dark:bg-[#2c353f] cursor-default'
                        : isDarkMode
                          ? 'text-gray-300 bg-[#2c353f] hover:bg-gray-700'
                          : 'text-gray-500 bg-white hover:bg-gray-50'
                    }`}
                >
                  {p}
                </button>
              ));
            })()}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'
                } text-sm font-medium ${isDarkMode
                  ? 'text-gray-300 bg-[#2c353f] hover:bg-gray-700'
                  : 'text-gray-500 bg-white hover:bg-gray-50'
                } transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="sr-only">Next</span>
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          </nav>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm rounded-b-xl overflow-hidden relative min-h-[400px] border-t-0 !mt-0">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black dark:border-white"></div>
            </motion.div>
          )}
        </AnimatePresence>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 w-12">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(users.map(user => user.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 cursor-pointer"
                />
              </th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">User</th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Role</th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Status</th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Department</th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Last Login</th>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  layout
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="group bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  {/* Checkbox */}
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 cursor-pointer"
                    />
                  </td>

                  {/* User Info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200 uppercase shrink-0 border border-gray-200 dark:border-zinc-700">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 font-mono mt-0.5">
                          {user.email.length > 25 ? `${user.email.substring(0, 22)}...` : user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${user.role === 'admin'
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                      : user.role === 'moderator'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-zinc-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700'
                      }`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${user.status === 'active' ? 'bg-green-500' :
                        user.status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
                        }`}></span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{user.status}</span>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.department || '—'}</p>
                  </td>

                  {/* Last Login */}
                  <td className="px-5 py-4">
                    <p className="text-xs text-gray-500 dark:text-zinc-500 font-mono">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</p>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-gray-400 hover:text-black dark:text-zinc-500 dark:hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setUserToDelete(user);
                          setShowDeleteConfirm(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination removed from bottom and moved top */}
      {/* User Details/Modal Section */}
      <AnimatedModal isOpen={showModal} onClose={() => setShowModal(false)} className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-[#0a0a0a] rounded-t-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight" id="modal-title">
              {isEditing ? 'Edit User' : 'Create New User'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">
              {isEditing ? 'Update the user information below.' : 'Fill in the details to add a new user.'}
            </p>
          </div>
          <div className="p-6 space-y-4 custom-scrollbar">
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={userForm.name}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 transition-all"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={userForm.email}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 transition-all"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">
                {isEditing ? 'New Password (Optional)' : 'Password'}
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={userForm.password}
                onChange={handleInputChange}
                placeholder={isEditing ? 'Leave blank to keep current' : 'Enter password'}
                required={!isEditing}
                className="block w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">Role</label>
                <CustomDropdown
                  id="role"
                  value={userForm.role}
                  onChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}
                  options={[
                    { value: 'user', label: 'User' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'moderator', label: 'Moderator' }
                  ]}
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">Status</label>
                <CustomDropdown
                  id="status"
                  value={userForm.status}
                  onChange={(value) => setUserForm(prev => ({ ...prev, status: value }))}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'suspended', label: 'Suspended' }
                  ]}
                />
              </div>
            </div>
            <div>
              <label htmlFor="department" className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">Department</label>
              <div className="w-full">
                <CustomDropdown
                  id="department"
                  value={userForm.department}
                  onChange={(value) => setUserForm(prev => ({ ...prev, department: value }))}
                  options={[
                    { value: '', label: 'Select Department' },
                    { value: 'IT', label: 'IT' },
                    { value: 'HR', label: 'HR' },
                    { value: 'Operations', label: 'Operations' },
                    { value: 'Engineering', label: 'Engineering' },
                    { value: 'Marketing', label: 'Marketing' }
                  ]}
                  placeholder="Select Department"
                />
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex gap-3 justify-end rounded-b-2xl">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90 transition-all shadow-lg"
            >
              {isEditing ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </AnimatedModal>

      {/* Delete Confirmation Modal */}
      <AnimatedModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete User?</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">
            Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">{userToDelete?.name}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </AnimatedModal>

      {/* Bulk Delete Confirmation Modal */}
      <AnimatedModal isOpen={showBulkDeleteConfirm} onClose={() => setShowBulkDeleteConfirm(false)} className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete {selectedUsers.length} Users?</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">
            Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">{selectedUsers.length} selected users</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowBulkDeleteConfirm(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await adminAxios.post('/users/bulk-update', {
                    userIds: selectedUsers,
                    action: 'delete'
                  });
                  setUsers(users.filter(user => !selectedUsers.includes(user.id)));
                  setSelectedUsers([]);
                  setShowBulkDeleteConfirm(false);
                  toast.success('Selected users deleted successfully', {
                    icon: '🗑️',
                    style: {
                      borderRadius: '10px',
                      background: '#EF4444',
                      color: '#fff',
                    },
                  });
                } catch (err) {
                  showErrorToast('Failed to delete selected users');
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
            >
              Yes, Delete All
            </button>
          </div>
        </div>
      </AnimatedModal>
    </div>
  );
};

export default UsersPage;