import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';
import { CSVLink } from 'react-csv';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
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

  // Sample data - Replace with API call
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      phone: '+1 234-567-8900',
      address: '123 Main St, City',
      organization: 'VoteSafe Inc',
      department: 'IT',
      lastLogin: '2024-03-15 10:30 AM',
      permissions: {
        canCreatePolls: true,
        canManageUsers: true,
        canViewResults: true,
        canExportData: true
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      status: 'active',
      phone: '+1 234-567-8901',
      address: '456 Oak St, Town',
      organization: 'VoteSafe Inc',
      department: 'HR',
      lastLogin: '2024-03-14 02:15 PM',
      permissions: {
        canCreatePolls: false,
        canManageUsers: false,
        canViewResults: true,
        canExportData: false
      }
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'moderator',
      status: 'inactive',
      phone: '+1 234-567-8902',
      address: '789 Pine St, Village',
      organization: 'VoteSafe Inc',
      department: 'Operations',
      lastLogin: '2024-03-13 09:45 AM',
      permissions: {
        canCreatePolls: true,
        canManageUsers: false,
        canViewResults: true,
        canExportData: true
      }
    }
  ]);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === selectedUser?.id 
          ? { ...user, ...userForm }
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
      const newUser = {
        id: Date.now().toString(), // Generate a unique ID
        ...userForm,
        createdAt: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
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
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getFilteredAndSortedUsers = () => {
    let filteredUsers = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesDateRange = !advancedFilters.dateRange.start || !advancedFilters.dateRange.end ||
        (new Date(user.lastLogin) >= new Date(advancedFilters.dateRange.start) &&
         new Date(user.lastLogin) <= new Date(advancedFilters.dateRange.end));
      const matchesDepartment = !advancedFilters.department || user.department === advancedFilters.department;
      const matchesOrganization = !advancedFilters.organization || user.organization === advancedFilters.organization;
      
      return matchesSearch && matchesStatus && matchesRole && matchesDateRange && 
             matchesDepartment && matchesOrganization;
    });

    return filteredUsers.sort((a, b) => {
      if (sortConfig.key === 'name' || sortConfig.key === 'email') {
        return sortConfig.direction === 'asc' 
          ? a[sortConfig.key].localeCompare(b[sortConfig.key])
          : b[sortConfig.key].localeCompare(a[sortConfig.key]);
      }
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'user':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredUsers = getFilteredAndSortedUsers();

  // Add these new button styles at the top of the component
  const buttonStyles = {
    primary: `inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
      bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
      transition-all duration-200 transform hover:scale-105 active:scale-95`,
    secondary: `inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
      text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 
      hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage and monitor user accounts across your organization
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setShowModal(true);
                setIsEditing(false);
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
              }}
              className={buttonStyles.primary}
            >
              <svg className={`${iconStyles.md} mr-2`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add User
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
              className={buttonStyles.secondary}
            >
              <svg className={`${iconStyles.md} mr-2 text-gray-500 dark:text-gray-400`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 00-1.414-1.414L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 101.414 1.414l-3 3a1 1 0 00-1.414 0l-3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              Export CSV
            </CSVLink>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-[#2c353f]' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{users.length}</p>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-[#2c353f]' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {users.filter(user => user.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-[#2c353f]' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
              <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Admins</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {users.filter(user => user.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-[#2c353f]' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New This Month</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {users.filter(user => {
                  const lastLogin = new Date(user.lastLogin);
                  const now = new Date();
                  return lastLogin.getMonth() === now.getMonth() && lastLogin.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className={`mb-6 p-4 rounded-xl ${isDarkMode ? 'bg-[#2c353f]' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  isDarkMode
                    ? 'bg-[#1f2937] border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-3 py-2 border ${
                isDarkMode
                  ? 'bg-[#1f2937] border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={`px-3 py-2 border ${
                isDarkMode
                  ? 'bg-[#1f2937] border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={buttonStyles.secondary}
            >
              <svg className={`${iconStyles.md} mr-2 text-gray-500 dark:text-gray-400`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={advancedFilters.dateRange.start}
                    onChange={(e) => setAdvancedFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className={`block w-full px-3 py-2 border ${
                      isDarkMode
                        ? 'bg-[#1f2937] border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                  />
                  <input
                    type="date"
                    value={advancedFilters.dateRange.end}
                    onChange={(e) => setAdvancedFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className={`block w-full px-3 py-2 border ${
                      isDarkMode
                        ? 'bg-[#1f2937] border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <select
                  value={advancedFilters.department}
                  onChange={(e) => setAdvancedFilters(prev => ({
                    ...prev,
                    department: e.target.value
                  }))}
                  className={`block w-full px-3 py-2 border ${
                    isDarkMode
                      ? 'bg-[#1f2937] border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                >
                  <option value="">All Departments</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization</label>
                <select
                  value={advancedFilters.organization}
                  onChange={(e) => setAdvancedFilters(prev => ({
                    ...prev,
                    organization: e.target.value
                  }))}
                  className={`block w-full px-3 py-2 border ${
                    isDarkMode
                      ? 'bg-[#1f2937] border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                >
                  <option value="">All Organizations</option>
                  <option value="VoteSafe Inc">VoteSafe Inc</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
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
                  onClick={() => {
                    setUsers(users.map(user => 
                      selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user
                    ));
                    setSelectedUsers([]);
                    toast.success('Selected users activated successfully', {
                      icon: '✅',
                      style: {
                        borderRadius: '10px',
                        background: '#10B981',
                        color: '#fff',
                      },
                    });
                  }}
                  className={`${bulkActionsStyles.button.base} ${bulkActionsStyles.button.success}`}
                >
                  <svg className={`${iconStyles.md} mr-2`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  Activate
                </button>
                <button
                  onClick={() => {
                    setUsers(users.map(user => 
                      selectedUsers.includes(user.id) ? { ...user, status: 'inactive' } : user
                    ));
                    setSelectedUsers([]);
                    toast.success('Selected users deactivated successfully', {
                      icon: '⚠️',
                      style: {
                        borderRadius: '10px',
                        background: '#F59E0B',
                        color: '#fff',
                      },
                    });
                  }}
                  className={`${bulkActionsStyles.button.base} ${bulkActionsStyles.button.warning}`}
                >
                  <svg className={`${iconStyles.md} mr-2`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Deactivate
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete the selected users? This action cannot be undone.')) {
                      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
                      setSelectedUsers([]);
                      toast.success('Selected users deleted successfully', {
                        icon: '🗑️',
                        style: {
                          borderRadius: '10px',
                          background: '#EF4444',
                          color: '#fff',
                        },
                      });
                    }
                  }}
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
      )}

      {/* Users Table */}
      <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-[#2c353f]' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${isDarkMode ? 'bg-[#1f2937]' : 'bg-gray-50'}`}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(users.map(user => user.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${isDarkMode ? 'bg-[#2c353f]' : 'bg-white'}`}>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelect(user.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <div className="relative group">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setUserForm({
                              name: user.name,
                              email: user.email,
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
                          }}
                          className={`${actionButtonStyles.base} ${actionButtonStyles.edit}`}
                          aria-label="Edit user"
                        >
                          <svg className={iconStyles.md} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" 
                              stroke="currentColor" 
                              strokeWidth="1.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <span className={actionButtonStyles.tooltip}>
                          Edit User
                        </span>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                              setUsers(users.filter(u => u.id !== user.id));
                              toast.success('User deleted successfully', {
                                icon: '🗑️',
                                style: {
                                  borderRadius: '10px',
                                  background: '#EF4444',
                                  color: '#fff',
                                },
                              });
                            }
                          }}
                          className={`${actionButtonStyles.base} ${actionButtonStyles.delete}`}
                          aria-label="Delete user"
                        >
                          <svg className={iconStyles.md} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" 
                              stroke="currentColor" 
                              strokeWidth="1.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <span className={actionButtonStyles.tooltip}>
                          Delete User
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`relative inline-flex items-center px-4 py-2 border ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            } text-sm font-medium rounded-md ${
              isDarkMode
                ? 'text-gray-300 bg-[#2c353f] hover:bg-gray-700'
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            } text-sm font-medium rounded-md ${
              isDarkMode
                ? 'text-gray-300 bg-[#2c353f] hover:bg-gray-700'
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * 10, filteredUsers.length)}</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-300'
                } text-sm font-medium ${
                  isDarkMode
                    ? 'text-gray-300 bg-[#2c353f] hover:bg-gray-700'
                    : 'text-gray-500 bg-white hover:bg-gray-50'
                } transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="sr-only">Previous</span>
                <svg className={`${iconStyles.md} text-gray-500`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  } text-sm font-medium ${
                    page === i + 1
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : isDarkMode
                      ? 'text-gray-300 bg-[#2c353f] hover:bg-gray-700'
                      : 'text-gray-500 bg-white hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-300'
                } text-sm font-medium ${
                  isDarkMode
                    ? 'text-gray-300 bg-[#2c353f] hover:bg-gray-700'
                    : 'text-gray-500 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Next</span>
                <svg className={`${iconStyles.md} text-gray-500`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;