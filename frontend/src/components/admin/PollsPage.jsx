import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/api/axiosConfig';
import toast from 'react-hot-toast';
import Modal from 'react-modal';
import { showNotification } from '../../utils/toastUtils.jsx';

// Utility to export audit logs as CSV
function exportAuditLogsToCSV(auditLogs) {
  if (!auditLogs || auditLogs.length === 0) return;
  const header = ['User', 'Option', 'Action', 'Timestamp'];
  const rows = auditLogs.map(log => [
    (log.user?.name || log.user?.email || 'Unknown').replace(/,/g, ' '),
    (log.option || '').replace(/,/g, ' '),
    (log.action || '').replace(/,/g, ' '),
    new Date(log.timestamp).toLocaleString().replace(/,/g, ' ')
  ]);
  const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'audit-log.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Utility to get a human-readable time difference string
function getTimeDiffString(from, to) {
  const diff = Math.max(0, to - from);
  const minutes = Math.floor(diff / 60000) % 60;
  const hours = Math.floor(diff / 3600000) % 24;
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ${hours}h`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ${minutes}m`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return 'less than a minute';
}

// Utility to convert ISO string to 'yyyy-MM-ddTHH:mm' for datetime-local input
function toDatetimeLocal(dt) {
  if (!dt) return '';
  const date = new Date(dt);
  const pad = n => n < 10 ? '0' + n : n;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const PollsPage = () => {
  const { isDarkMode } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState(null);
  const [auditPollTitle, setAuditPollTitle] = useState('');
  const [showDescriptionPreview, setShowDescriptionPreview] = useState(false);
  const [showVotingSettingsHelp, setShowVotingSettingsHelp] = useState(false);
  const [showNotificationSettingsHelp, setShowNotificationSettingsHelp] = useState(false);
  const [activeTab, setActiveTab] = useState('General');
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [analyticsPoll, setAnalyticsPoll] = useState(null);
  const [analyticsCandidate, setAnalyticsCandidate] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/polls');
        // The backend returns { polls: [...], page, limit, total, totalPages }
        const pollsData = response.data.polls || response.data;
        // Normalize poll IDs for consistent usage
        const normalizedPolls = pollsData.map(poll => ({
          ...poll,
          id: poll._id || poll.id
        }));
        setPolls(normalizedPolls);
        setError(null);
      } catch (err) {
        setError('Failed to load polls');
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  const handleCreatePoll = () => {
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditPoll = (poll) => {
    // Ensure poll has an id property
    const normalizedPoll = { ...poll, id: poll._id || poll.id };
    setSelectedPoll(normalizedPoll);
    setIsEditing(true);
    setShowModal(true);

    // Convert options to candidates format and format dates for datetime-local inputs
    const candidates = (poll.options || []).map((option, index) => ({
      id: index,
      name: option.text,
      description: option.description || '',
      party: option.party || '',
      image: option.image || null
    }));

    // Format dates for datetime-local inputs (YYYY-MM-DDTHH:MM)
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      // Get the date in local timezone but preserve the original time
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Populate poll form with existing poll data
    setPollForm({
      title: poll.title || '',
      description: poll.description || '',
      category: poll.category || '',
      startDate: formatDateForInput(poll.startDate),
      endDate: formatDateForInput(poll.endDate),
      resultDate: formatDateForInput(poll.resultDate),
      totalVotes: poll.totalVotes || 0,
      candidates: candidates,
      settings: {
        allowMultipleVotes: poll.settings?.allowMultipleVotes || false,
        showResultsBeforeEnd: poll.settings?.showResultsBeforeEnd || false,
        showResultsAfterVote: poll.settings?.showResultsAfterVote || false,
        requireAuthentication: poll.settings?.requireAuthentication || false,
        enableComments: poll.settings?.enableComments || false,
        showVoterNames: poll.settings?.showVoterNames || false,
        notifyOnVote: poll.settings?.notifyOnVote || false,
        notifyOnEnd: poll.settings?.notifyOnEnd || false
      }
    });

    // Reset candidate form
    setCandidateForm({
      name: '',
      party: '',
      description: '',
      website: '',
      socialMedia: {
        twitter: '',
        instagram: ''
      },
      image: null
    });
    setEditingCandidateId(null);
  };

  const filteredPolls = polls.filter(poll =>
    poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poll.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add these state variables at the top with other state declarations
  const [pollForm, setPollForm] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    resultDate: '',
    settings: {
      allowMultipleVotes: false,
      showResultsBeforeEnd: false,
      showResultsAfterVote: false,
      requireAuthentication: false,
      enableComments: false,
      showVoterNames: false,
      notifyOnVote: false,
      notifyOnEnd: false
    },
    candidates: []
  });

  const [candidateForm, setCandidateForm] = useState({
    name: '',
    party: '',
    description: '',
    website: '',
    socialMedia: {
      twitter: '',
      instagram: ''
    },
    image: null
  });

  // Add new state for editing candidate
  const [editingCandidateId, setEditingCandidateId] = useState(null);

  // Add handler for editing candidate
  const handleEditCandidate = (candidate) => {
    setEditingCandidateId(candidate.id);
    setCandidateForm({
      name: candidate.name,
      party: candidate.party || '',
      description: candidate.description || '',
      website: candidate.website || '',
      socialMedia: {
        twitter: candidate.socialMedia?.twitter || '',
        instagram: candidate.socialMedia?.instagram || ''
      },
      image: candidate.image || null
    });
  };

  // Add handler for updating candidate
  const handleUpdateCandidate = () => {
    if (!candidateForm.name) {
      alert('Please enter candidate name');
      return;
    }

    setPollForm(prev => ({
      ...prev,
      candidates: prev.candidates.map(candidate =>
        candidate.id === editingCandidateId
          ? { ...candidateForm, id: candidate.id }
          : candidate
      )
    }));

    // Reset form and editing state
    setCandidateForm({
      name: '',
      party: '',
      description: '',
      website: '',
      socialMedia: {
        twitter: '',
        instagram: ''
      },
      image: null
    });
    setEditingCandidateId(null);
  };

  // Add handler for canceling edit
  const handleCancelEdit = () => {
    setEditingCandidateId(null);
    setCandidateForm({
      name: '',
      party: '',
      description: '',
      website: '',
      socialMedia: {
        twitter: '',
        instagram: ''
      },
      image: null
    });
  };

  // Add these handler functions before the return statement
  const handlePollFormChange = (e) => {
    const { name, value } = e.target;
    setPollForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsChange = async (setting, value) => {
    if (!selectedPoll || !selectedPoll.id) {
      toast.error('No poll selected.');
      return;
    }
    const newSettings = {
      ...pollForm.settings,
      [setting]: typeof value !== 'undefined' ? value : !pollForm.settings[setting]
    };
    try {
      await axiosInstance.put(`/polls/${selectedPoll.id}`, {
        ...selectedPoll,
        settings: newSettings,
        version: selectedPoll.__v // Pass version for optimistic locking
      });
      setPollForm(prev => ({
        ...prev,
        settings: newSettings
      }));
      toast.success('Settings updated');
    } catch (err) {
      toast.error('Failed to update settings');
    }
  };

  const handleCandidateFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMedia.')) {
      const platform = name.split('.')[1];
      setCandidateForm(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [platform]: value
        }
      }));
    } else {
      setCandidateForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
      setCandidateForm(prev => ({
        ...prev,
        image: file
      }));
    } else {
      alert('Please select an image file under 2MB');
    }
  };

  const addCandidate = () => {
    if (!candidateForm.name) {
      alert('Please enter candidate name');
      return;
    }

    const newCandidate = {
      ...candidateForm,
      id: Date.now()
    };

    setPollForm(prev => ({
      ...prev,
      candidates: [...prev.candidates, newCandidate]
    }));

    // Reset candidate form
    setCandidateForm({
      name: '',
      party: '',
      description: '',
      website: '',
      socialMedia: {
        twitter: '',
        instagram: ''
      },
      image: null
    });
  };

  const removeCandidate = (id) => {
    setPollForm(prev => ({
      ...prev,
      candidates: prev.candidates.filter(c => c.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Robust Validation ---
    // Title: required, min 3, max 100
    if (!pollForm.title || pollForm.title.trim().length < 3) {
      toast.error('Title is required (min 3 characters)');
      return;
    }
    if (pollForm.title.length > 100) {
      toast.error('Title must be at most 100 characters');
      return;
    }
    // Description: optional, max 500
    if (pollForm.description && pollForm.description.length > 500) {
      toast.error('Description must be at most 500 characters');
      return;
    }
    // Dates: required, start in future, end after start
    if (!pollForm.startDate || !pollForm.endDate) {
      toast.error('Start and end date are required');
      return;
    }
    const now = new Date();
    const startDate = new Date(pollForm.startDate);
    const endDate = new Date(pollForm.endDate);
    if (startDate < now) {
      toast.error('Start date/time must be in the future');
      return;
    }
    if (endDate <= startDate) {
      toast.error('End date/time must be after start date/time');
      return;
    }
    // Candidates: at least 2, no empty/duplicate names, name length
    if (!pollForm.candidates || pollForm.candidates.length < 2) {
      toast.error('Please add at least 2 candidates');
      return;
    }
    const names = pollForm.candidates.map(c => (c.name || '').trim());
    if (names.some(name => !name)) {
      toast.error('Candidate names cannot be empty');
      return;
    }
    if (names.some(name => name.length > 100)) {
      toast.error('Candidate names must be at most 100 characters');
      return;
    }
    const nameSet = new Set(names.map(n => n.toLowerCase()));
    if (nameSet.size !== names.length) {
      toast.error('Candidate names must be unique');
      return;
    }

    // Category: required
    if (!pollForm.category) {
      toast.error('Please select a category');
      return;
    }

    // Map candidates to options for backend
    const options = pollForm.candidates.map(c => {
      const option = {
        text: c.name,
        description: c.description,
        party: c.party,
      };
      if (typeof c.image === 'string' && c.image.trim() !== '') {
        option.image = c.image;
      }
      return option;
    });
    const payload = {
      ...pollForm,
      options,
      resultDate: pollForm.resultDate || null, // Convert empty string to null
      settings: {
        ...pollForm.settings,
        showResultsAfterVote: pollForm.settings.showResultsAfterVote,
      },
    };
    delete payload.candidates;

    try {
      if (isEditing && selectedPoll) {
        // Guard: prevent PUT if id is missing
        if (!selectedPoll.id) {
          toast.error('Poll ID is missing. Cannot update poll.');
          return;
        }
        // Update existing poll
        const updatePayload = {
          ...payload,
          version: selectedPoll.__v // Pass version for optimistic locking
        };
        await axiosInstance.put(`/polls/${selectedPoll.id}`, updatePayload);
        // Optimistic update of local state might need to account for version bump, 
        // but for now we expect a refresh or just proceed.
        // Ideally backend returns new version.
        setPolls(polls.map(p => p.id === selectedPoll.id ? { ...pollForm, id: selectedPoll.id, options } : p));
        toast.success('Poll updated successfully');
      } else {
        // Create new poll
        const response = await axiosInstance.post('/polls', payload);
        const newPoll = { ...response.data, id: response.data._id || response.data.id };
        setPolls([...polls, newPoll]);
        toast.success('Poll created successfully');
      }

      // Reset form and close modal
      setShowModal(false);
      setIsEditing(false);
      setSelectedPoll(null);
      setPollForm({
        title: '',
        description: '',
        category: '',
        startDate: '',
        endDate: '',
        resultDate: '',
        settings: {
          allowMultipleVotes: false,
          showResultsBeforeEnd: false,
          showResultsAfterVote: false,
          requireAuthentication: false,
          enableComments: false,
          showVoterNames: false,
          notifyOnVote: false,
          notifyOnEnd: false
        },
        candidates: []
      });
    } catch (error) {
      console.error('Error saving poll:', error);

      // Enhanced error handling with more specific error messages
      let errorMessage = 'Failed to save poll';

      if (error.response) {
        // Server responded with error status
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid poll data. Please check your inputs.';
        } else if (error.response.status === 401) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (error.response.status === 403) {
          errorMessage = 'You are not authorized to create polls.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        // Something else happened
        errorMessage = error.message;
      }

      toast.error(errorMessage);

      // Log additional error details for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Poll creation error details:', {
          error: error.message,
          response: error.response?.data,
          status: error.response?.status,
          payload: payload
        });
      }
    }
  };

  const handleViewResults = (poll) => {
    navigate(`/admin/polls/${poll.id}/results`);
  };

  const handleSharePoll = async (poll) => {
    const shareUrl = `${window.location.origin}/polls/${poll.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: poll.title,
          text: `Vote in this poll: ${poll.title}`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Poll link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing poll:', error);
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Poll link copied to clipboard!');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        alert('Failed to share poll link');
      }
    }
  };

  const handleDeletePoll = async (poll) => {
    if (!poll.id) {
      toast.error('Poll ID is missing. Cannot delete poll.');
      return;
    }
    try {
      await axiosInstance.delete(`/polls/${poll.id}`);
      setPolls(polls.filter(p => p.id !== poll.id));
      toast.success('Poll deleted successfully');
    } catch (error) {
      console.error('Error deleting poll:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to delete poll');
      }
    }
  };

  const handleViewAuditLog = async (poll) => {
    setShowAuditModal(true);
    setAuditLogs([]);
    setAuditLoading(true);
    setAuditError(null);
    setAuditPollTitle(poll.title);
    try {
      const res = await axiosInstance.get(`/polls/${poll.id}/audit-logs`);
      setAuditLogs(res.data);
    } catch (err) {
      setAuditError('Failed to load audit logs');
    } finally {
      setAuditLoading(false);
    }
  };

  const handleDuplicatePoll = (poll) => {
    setShowModal(true);
    setIsEditing(false);
    setSelectedPoll(null);
    setPollForm({
      ...poll,
      title: poll.title + ' (Copy)',
      startDate: '', // Reset for new poll
      endDate: '',   // Reset for new poll
      resultDate: '',
      candidates: poll.candidates ? [...poll.candidates] : [],
      settings: { ...poll.settings },
      totalVotes: 0,
      // Remove id if present
      ...(poll.id ? {} : { id: undefined }),
      ...(poll._id ? {} : { _id: undefined })
    });
  };

  const handleCopyPollLink = (poll) => {
    const link = `${window.location.origin}/polls/${poll.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link)
        .then(() => toast.success('Poll link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link.'));
    } else {
      window.prompt('Copy this poll link:', link);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header Section */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <div className="flex min-w-72 flex-col gap-2">
          <p className={`tracking-light text-2xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Polls
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}`}>
            Manage your voting polls
          </p>
        </div>
        <button
          onClick={handleCreatePoll}
          className={`h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${isDarkMode
            ? 'bg-white text-gray-900 hover:bg-gray-100'
            : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
        >
          New Poll
        </button>
      </div>

      {/* Search Section */}
      <div className="px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search polls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode
              ? 'bg-[#15191e] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-white'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
              }`}
          />
          <svg
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Polls Grid - Advanced */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 p-6 animate-fade-in">
        {filteredPolls.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" strokeWidth="3" className="stroke-current" />
              <path d="M16 24h16M24 16v16" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No polls found</p>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}`}>Try adjusting your search or create a new poll.</p>
          </div>
        ) : (
          filteredPolls.map((poll) => {
            // Advanced: Calculate progress, status, and accessibility
            const totalVotes = poll.totalVotes || 0;
            const maxVotes = poll.maxVotes || 1000;
            const progressPercent = Math.min((totalVotes / maxVotes) * 100, 100);
            const now = new Date();
            const start = poll.startDate ? new Date(poll.startDate) : null;
            const end = poll.endDate ? new Date(poll.endDate) : null;
            const isOngoing = poll.status === 'active' && (!end || now <= end);
            const isUpcoming = poll.status === 'upcoming' || (start && now < start);
            const isEnded = poll.status === 'ended' || (end && now > end);

            // Advanced: Tooltip helpers
            const statusTooltip = isOngoing
              ? "Poll is currently active"
              : isUpcoming
                ? "Poll is scheduled to start soon"
                : "Poll has ended";

            // Advanced: Category color
            const categoryColor = poll.category
              ? ({
                Politics: 'bg-red-500/20 text-red-500',
                Sports: 'bg-green-500/20 text-green-500',
                Entertainment: 'bg-yellow-500/20 text-yellow-500',
                Science: 'bg-blue-500/20 text-blue-500',
                Other: isDarkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600'
              }[poll.category] || (isDarkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600'))
              : (isDarkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600');

            // Advanced: Accessibility - ARIA labels
            const pollAriaLabel = `Poll: ${poll.title}. Status: ${poll.status}. ${poll.description}`;

            return (
              <div
                key={poll.id || poll._id}
                className={`group relative flex flex-col gap-4 p-8 rounded-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-400 outline-none cursor-pointer max-w-2xl w-full mx-auto ${isDarkMode
                  ? 'bg-gradient-to-br from-[#232a36] to-[#1a1f2e] hover:from-[#2c353f] hover:to-[#232a36] shadow-xl shadow-black/30'
                  : 'bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 shadow-lg shadow-gray-200/60'
                  }`}
                tabIndex={0}
                aria-label={pollAriaLabel}
                role="region"
              >
                {/* Status Badge + Category */}
                <div className="absolute -top-3 right-4 flex items-center gap-2 z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm border select-none cursor-default transition-colors duration-200
                      ${isOngoing
                        ? isDarkMode
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-green-50 text-green-700 border-green-200'
                        : isUpcoming
                          ? isDarkMode
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                          : isDarkMode
                            ? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    title={statusTooltip}
                  >
                    <span className="inline-flex items-center gap-1">
                      {isOngoing && (
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
                      )}
                      {isUpcoming && (
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-400" aria-hidden="true" />
                      )}
                      {isEnded && (
                        <span className="inline-block w-2 h-2 rounded-full bg-gray-400" aria-hidden="true" />
                      )}
                      {poll.status}
                    </span>
                  </span>
                  {poll.category && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${categoryColor} border-transparent`}
                      title={`Category: ${poll.category}`}
                    >
                      {poll.category}
                    </span>
                  )}
                </div>

                {/* Header */}
                <div className="flex-1 min-h-[56px]">
                  <h3
                    className={`text-lg font-bold mb-1 truncate transition-colors duration-200 ${isDarkMode ? 'text-white group-hover:text-blue-300' : 'text-gray-900 group-hover:text-blue-700'
                      }`}
                    title={poll.title}
                  >
                    {poll.title}
                  </h3>
                  <p className={`text-sm line-clamp-2 ${isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}`}>
                    {poll.description}
                  </p>
                </div>

                {/* Progress Bar with Tooltip and Animation */}
                <div className="w-full">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}>
                      {totalVotes} votes
                    </span>
                    <span className={isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}>
                      {progressPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div
                    className={`relative h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#3f4c5a]' : 'bg-gray-100'}`}
                    title={`Progress: ${progressPercent.toFixed(1)}%`}
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    role="progressbar"
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-in-out ${isOngoing
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-green-400 via-blue-500 to-blue-400 animate-gradient-x'
                          : 'bg-gradient-to-r from-blue-600 via-green-400 to-blue-500 animate-gradient-x'
                        : isEnded
                          ? isDarkMode
                            ? 'bg-gradient-to-r from-gray-500 to-gray-400'
                            : 'bg-gradient-to-r from-gray-300 to-gray-400'
                          : isDarkMode
                            ? 'bg-gradient-to-r from-blue-500 to-blue-400'
                            : 'bg-gradient-to-r from-blue-600 to-blue-500'
                        }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                    {/* Animated marker for live progress */}
                    {isOngoing && (
                      <span
                        className="absolute top-0 -right-1 w-3 h-3 bg-blue-400 rounded-full shadow-lg animate-pulse"
                        style={{ left: `calc(${progressPercent}% - 0.5rem)` }}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>

                {/* Poll Info */}
                <div className="flex flex-col gap-2 mt-1">
                  <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}`}>
                    <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-[#3f4c5a]/50' : 'bg-gray-100'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1">
                      <span title="Start date">{poll.startDate ? new Date(poll.startDate).toLocaleDateString() : 'N/A'}</span>
                      <span className="mx-1 text-xs">→</span>
                      <span title="End date">{poll.endDate ? new Date(poll.endDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}`}>
                    <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-[#3f4c5a]/50' : 'bg-gray-100'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span>
                      {poll.totalVotes} participant{poll.totalVotes === 1 ? '' : 's'}
                    </span>
                  </div>
                  {poll.resultDate && (
                    <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}`}>
                      <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-[#3f4c5a]/50' : 'bg-gray-100'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>
                      <span>
                        Results: {new Date(poll.resultDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Candidates Preview */}
                {poll.candidates && poll.candidates.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2" aria-label="Candidates">
                    {poll.candidates.slice(0, 6).map((candidate, idx) => (
                      <div
                        key={candidate.id || candidate.name || idx}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 select-none ${isDarkMode
                          ? 'bg-[#3f4c5a]/50 hover:bg-[#3f4c5a]'
                          : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        title={candidate.name}
                        aria-label={`Candidate: ${candidate.name}, Votes: ${candidate.votes}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${candidate.votes > 0
                          ? isDarkMode ? 'bg-green-400' : 'bg-green-500'
                          : isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                          }`} />
                        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                          {candidate.name}
                        </span>
                        {candidate.votes > 0 && (
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${isDarkMode
                            ? 'bg-[#3f4c5a] text-[#a0acbb]'
                            : 'bg-gray-200 text-gray-600'
                            }`}>
                            {candidate.votes}
                          </span>
                        )}
                      </div>
                    ))}
                    {poll.candidates.length > 6 && (
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${isDarkMode ? 'bg-[#3f4c5a]/50 text-[#a0acbb]' : 'bg-gray-100 text-gray-600'}`}>
                        +{poll.candidates.length - 6} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-[#3f4c5a]">
                  <button
                    onClick={() => handleEditPoll(poll)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDarkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    aria-label={`Edit poll ${poll.title}`}
                  >
                    <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h2v2h-2z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(true);
                      setSelectedPoll(poll);
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 ${isDarkMode
                      ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                      : 'bg-red-50 hover:bg-red-100 text-red-600'
                      }`}
                    aria-label={`Delete poll ${poll.title}`}
                  >
                    <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewAuditLog(poll)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${isDarkMode
                      ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                      }`}
                    aria-label={`View audit log for poll ${poll.title}`}
                  >
                    <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                    Audit Log
                  </button>
                  <button
                    onClick={() => handleDuplicatePoll(poll)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 ${isDarkMode
                      ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                      }`}
                    aria-label={`Duplicate poll ${poll.title}`}
                  >
                    <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <rect x="3" y="3" width="13" height="13" rx="2" />
                    </svg>
                    Duplicate
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="flex justify-between items-center text-xs mt-2">
                  <button
                    onClick={() => handleViewResults(poll)}
                    className={`flex items-center gap-1.5 transition-colors duration-200 focus:outline-none focus:underline ${isDarkMode
                      ? 'text-[#a0acbb] hover:text-white'
                      : 'text-gray-500 hover:text-gray-900'
                      }`}
                    aria-label={`View results for poll ${poll.title}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Results
                  </button>
                  <button
                    onClick={() => handleSharePoll(poll)}
                    className={`flex items-center gap-1.5 transition-colors duration-200 focus:outline-none focus:underline ${isDarkMode
                      ? 'text-[#a0acbb] hover:text-white'
                      : 'text-gray-500 hover:text-gray-900'
                      }`}
                    aria-label={`Share poll ${poll.title}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                  <button
                    onClick={() => handleCopyPollLink(poll)}
                    className={`flex items-center gap-1.5 transition-colors duration-200 focus:outline-none focus:underline ${isDarkMode
                      ? 'text-[#a0acbb] hover:text-white'
                      : 'text-gray-500 hover:text-gray-900'
                      }`}
                    aria-label={`Copy link for poll ${poll.title}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 010 5.656m-1.414-1.414a2 2 0 010-2.828m-2.828 2.828a4 4 0 010-5.656m1.414 1.414a2 2 0 010 2.828" />
                    </svg>
                    Copy Link
                  </button>
                </div>
                {/* Accessibility: Live region for poll status */}
                <div className="sr-only" aria-live="polite">
                  {poll.status === 'active'
                    ? `Poll ${poll.title} is active.`
                    : poll.status === 'upcoming'
                      ? `Poll ${poll.title} is upcoming.`
                      : `Poll ${poll.title} has ended.`}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create/Edit Poll Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => {
              setShowModal(false);
              setSelectedPoll(null);
            }} />

            <div className={`relative w-full max-w-5xl rounded-2xl shadow-2xl transition-all transform ${isDarkMode ? 'bg-[#1a1f2e]' : 'bg-white'
              }`}>
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {isEditing ? 'Edit Poll' : 'Create New Poll'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setSelectedPoll(null);
                    setPollForm({
                      title: '',
                      description: '',
                      category: '',
                      startDate: '',
                      endDate: '',
                      resultDate: '',
                      settings: {
                        allowMultipleVotes: false,
                        showResultsBeforeEnd: false,
                        showResultsAfterVote: false,
                        requireAuthentication: false,
                        enableComments: false,
                        showVoterNames: false,
                        notifyOnVote: false,
                        notifyOnEnd: false
                      },
                      candidates: []
                    });
                  }}
                  className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Tab Bar */}
              <div className="flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} bg-transparent px-6">
                {['General', 'Candidates', 'Voting', 'Privacy', 'Notifications'].map(tab => (
                  <button
                    key={tab}
                    type="button"
                    className={`py-3 px-6 -mb-px font-medium text-sm border-b-2 transition-colors duration-200 focus:outline-none ${activeTab === tab
                      ? isDarkMode
                        ? 'border-blue-500 text-blue-400'
                        : 'border-blue-600 text-blue-600'
                      : isDarkMode
                        ? 'border-transparent text-gray-400 hover:text-white'
                        : 'border-transparent text-gray-500 hover:text-gray-900'
                      }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Form */}
              <div className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {/* General Tab */}
                {activeTab === 'General' && (
                  <>
                    {/* Poll Info Section */}
                    <div className={`p-6 rounded-xl border ${isDarkMode ? 'border-[#3f4c5a] bg-[#2c353f]' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center gap-3 mb-6">
                        <h4 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          <svg
                            className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          Poll Information
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${isDarkMode
                            ? 'bg-blue-900 text-blue-200 border border-blue-700'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          title="This section contains the core details of your poll. Hover over any field for more info."
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          Info
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                          <div>
                            <h5
                              className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                            >
                              <svg
                                className="w-4 h-4 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                              Basic Information
                              <span
                                className={`ml-2 text-xs font-normal italic ${isDarkMode ? 'text-blue-300' : 'text-blue-500'
                                  }`}
                              >
                                (Required fields marked with <span className="text-red-500">*</span>)
                              </span>
                            </h5>
                            <div className="space-y-4">
                              {/* Title Field with Advanced Features */}
                              <div>
                                <div className="flex items-center justify-between">
                                  <label
                                    htmlFor="poll-title"
                                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                      }`}
                                  >
                                    Title <span className="text-red-500">*</span>
                                  </label>
                                  <span
                                    className={`text-xs ${pollForm.title.length > 90
                                      ? 'text-yellow-500 font-semibold'
                                      : isDarkMode
                                        ? 'text-gray-400'
                                        : 'text-gray-500'
                                      }`}
                                    aria-live="polite"
                                  >
                                    {pollForm.title.length}/100
                                  </span>
                                </div>
                                <div className="relative">
                                  <input
                                    id="poll-title"
                                    type="text"
                                    name="title"
                                    value={pollForm.title}
                                    onChange={handlePollFormChange}
                                    placeholder="Enter poll title"
                                    required
                                    maxLength={100}
                                    autoFocus
                                    autoComplete="off"
                                    spellCheck={true}
                                    aria-required="true"
                                    aria-describedby="poll-title-desc"
                                    className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 pr-10 ${isDarkMode
                                      ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                      : 'bg-white border-gray-300 border border-[1px] text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                      } ${pollForm.title.length === 0
                                        ? 'ring-2 ring-red-400'
                                        : pollForm.title.length > 90
                                          ? 'ring-2 ring-yellow-400'
                                          : ''
                                      }`}
                                  />
                                  {/* Live character count progress bar */}
                                  <div className="absolute bottom-0 left-0 right-0 h-1">
                                    <div
                                      className={`h-full rounded-b-lg transition-all duration-300 ${pollForm.title.length > 90
                                        ? 'bg-yellow-400'
                                        : 'bg-blue-400'
                                        }`}
                                      style={{
                                        width: `${Math.min(
                                          (pollForm.title.length / 100) * 100,
                                          100
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                  {/* Tooltip for best practices */}
                                  <div
                                    className="absolute top-2 right-2 group"
                                    tabIndex={0}
                                    aria-label="Title best practices"
                                  >
                                    <svg
                                      className="w-4 h-4 text-blue-400 cursor-pointer"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                      <path
                                        d="M12 16v-4M12 8h.01"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    <div className="absolute z-10 hidden group-hover:block group-focus:block right-0 mt-2 w-64 p-3 rounded-lg shadow-lg bg-white dark:bg-[#222c37] border border-gray-200 dark:border-[#3f4c5a] text-xs text-gray-700 dark:text-gray-200">
                                      <strong>Tips:</strong>
                                      <ul className="list-disc ml-4 mt-1">
                                        <li>Be concise and descriptive</li>
                                        <li>Use clear language</li>
                                        <li>Avoid special characters</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <p
                                  id="poll-title-desc"
                                  className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}
                                >
                                  The poll title will be visible to all voters. Make it clear and engaging.
                                </p>
                              </div>

                              {/* Description Field with Markdown Preview */}
                              <div>
                                <div className="flex items-center justify-between">
                                  <label
                                    htmlFor="poll-description"
                                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                      }`}
                                  >
                                    Description
                                  </label>
                                  <span
                                    className={`text-xs ${pollForm.description.length > 450
                                      ? 'text-yellow-500 font-semibold'
                                      : isDarkMode
                                        ? 'text-gray-400'
                                        : 'text-gray-500'
                                      }`}
                                    aria-live="polite"
                                  >
                                    {pollForm.description.length}/500
                                  </span>
                                </div>
                                <div className="relative">
                                  <textarea
                                    id="poll-description"
                                    name="description"
                                    value={pollForm.description}
                                    onChange={handlePollFormChange}
                                    placeholder="Enter poll description (supports Markdown)"
                                    rows={4}
                                    maxLength={500}
                                    autoComplete="off"
                                    spellCheck={true}
                                    aria-describedby="poll-description-desc"
                                    className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 resize-none pr-10 ${isDarkMode
                                      ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                      : 'bg-white border-gray-300 border border-[1px] text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                      } ${pollForm.description.length > 450
                                        ? 'ring-2 ring-yellow-400'
                                        : ''
                                      }`}
                                  />
                                  {/* Markdown Preview Toggle */}
                                  <button
                                    type="button"
                                    tabIndex={0}
                                    aria-label="Toggle Markdown Preview"
                                    className={`absolute top-2 right-2 p-1 rounded transition-colors duration-200 ${isDarkMode
                                      ? 'text-blue-300 hover:bg-blue-900/20'
                                      : 'text-blue-500 hover:bg-blue-100'
                                      }`}
                                    onClick={() =>
                                      setShowDescriptionPreview((prev) => !prev)
                                    }
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12h.01M12 12h.01M9 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <p
                                  id="poll-description-desc"
                                  className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}
                                >
                                  Optional. You can use <span className="font-semibold">Markdown</span> for formatting.
                                </p>
                                {/* Live Markdown Preview */}
                                {showDescriptionPreview && pollForm.description && (
                                  <div
                                    className={`mt-2 p-3 rounded-lg border text-sm shadow-inner ${isDarkMode
                                      ? 'bg-[#232b36] border-[#3f4c5a] text-gray-200'
                                      : 'bg-gray-50 border-gray-200 text-gray-800'
                                      }`}
                                  >
                                    <span className="block font-semibold mb-1 text-blue-500">
                                      Preview:
                                    </span>
                                    <div
                                      className="prose prose-sm max-w-none dark:prose-invert"
                                      dangerouslySetInnerHTML={{
                                        __html: renderMarkdown(pollForm.description),
                                      }}
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Category Dropdown Field */}
                              <div>
                                <label
                                  htmlFor="poll-category"
                                  className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                                >
                                  Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                  id="poll-category"
                                  name="category"
                                  value={pollForm.category}
                                  onChange={handlePollFormChange}
                                  required
                                  className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                    }`}
                                >
                                  <option value="">Select category</option>
                                  <option value="General">General</option>
                                  <option value="Election">Election</option>
                                  <option value="Survey">Survey</option>
                                  <option value="Feedback">Feedback</option>
                                  <option value="Other">Other</option>
                                </select>
                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Choose a category for this poll.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Date & Time Range
                              <span className="ml-2 text-xs font-normal text-blue-400 italic">
                                (Set when voting opens and closes)
                              </span>
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className={`block text-sm font-medium mb-2 flex items-center gap-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <span>Start Date</span>
                                  <span className="text-red-500">*</span>
                                  <span className="ml-1 text-xs text-gray-400">
                                    (UTC)
                                  </span>
                                </label>
                                <input
                                  type="datetime-local"
                                  name="startDate"
                                  value={toDatetimeLocal(pollForm.startDate)}
                                  onChange={handlePollFormChange}
                                  min={new Date().toISOString().slice(0, 16)}
                                  required
                                  aria-label="Poll Start Date"
                                  aria-describedby="start-date-desc"
                                  className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 border border-[1px] text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                                    }`}
                                />
                                <div id="start-date-desc" className={`text-xs mt-1 flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                                  </svg>
                                  Voting opens at this date and time.
                                </div>
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-2 flex items-center gap-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <span>End Date</span>
                                  <span className="text-red-500">*</span>
                                  <span className="ml-1 text-xs text-gray-400">
                                    (UTC)
                                  </span>
                                </label>
                                <input
                                  type="datetime-local"
                                  name="endDate"
                                  value={toDatetimeLocal(pollForm.endDate)}
                                  onChange={handlePollFormChange}
                                  min={pollForm.startDate ? toDatetimeLocal(pollForm.startDate) : new Date().toISOString().slice(0, 16)}
                                  required
                                  aria-label="Poll End Date"
                                  aria-describedby="end-date-desc"
                                  className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 border border-[1px] text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                                    }`}
                                />
                                <div id="end-date-desc" className={`text-xs mt-1 flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                                  </svg>
                                  Voting closes at this date and time.
                                </div>
                              </div>
                            </div>
                            {/* Advanced: Show live countdowns if dates are set */}
                            {(pollForm.startDate || pollForm.endDate) && (
                              <div className="mt-4 flex flex-col gap-2">
                                {pollForm.startDate && (
                                  <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                    </svg>
                                    <span>
                                      {new Date(pollForm.startDate) > new Date()
                                        ? `Opens in ${getTimeDiffString(new Date(), new Date(pollForm.startDate))}`
                                        : 'Voting is open'}
                                    </span>
                                  </div>
                                )}
                                {pollForm.endDate && (
                                  <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                    </svg>
                                    <span>
                                      {new Date(pollForm.endDate) > new Date()
                                        ? `Closes in ${getTimeDiffString(new Date(), new Date(pollForm.endDate))}`
                                        : 'Voting is closed'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                            {/* Advanced: Validation feedback */}
                            {(pollForm.startDate && pollForm.endDate && new Date(pollForm.endDate) <= new Date(pollForm.startDate)) && (
                              <div className="mt-2 text-xs text-red-500 font-medium flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                End date must be after start date.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          <div>
                            <h5 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Poll Features
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${isDarkMode ? 'bg-blue-900 text-blue-200 border border-blue-700' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                  <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Advanced
                              </span>
                            </h5>
                            <div className="space-y-4">
                              {/* Real-time Results */}
                              <div className={`relative group p-4 rounded-lg border shadow-sm transition-all duration-200 ${isDarkMode ? 'border-[#3f4c5a] bg-gradient-to-br from-[#1f2937] to-[#232b36]' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white'}`}>
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg shadow ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                                    <svg className={`w-5 h-5 animate-pulse ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h6 className={`text-sm font-semibold flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      Real-time Results
                                      <span className="ml-1 inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold tracking-wide">LIVE</span>
                                    </h6>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      Instantly see voting results update as votes are cast.
                                    </p>
                                    <div className="hidden group-hover:block absolute top-2 right-2 z-10">
                                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded shadow-lg">WebSocket-powered</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Time Limit */}
                              <div className={`relative group p-4 rounded-lg border shadow-sm transition-all duration-200 ${isDarkMode ? 'border-[#3f4c5a] bg-gradient-to-br from-[#1f2937] to-[#233a2c]' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-green-50'}`}>
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg shadow ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h6 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      Time Limit & Countdown
                                    </h6>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      Poll automatically ends at the specified time. Live countdown shown to users.
                                    </p>
                                    <div className="hidden group-hover:block absolute top-2 right-2 z-10">
                                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded shadow-lg">Auto-close & Timer</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Voter Management */}
                              <div className={`relative group p-4 rounded-lg border shadow-sm transition-all duration-200 ${isDarkMode ? 'border-[#3f4c5a] bg-gradient-to-br from-[#1f2937] to-[#2a2340]' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-purple-50'}`}>
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg shadow ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h6 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      Voter Management & Analytics
                                    </h6>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      Track voter participation, prevent duplicate votes, and view detailed analytics.
                                    </p>
                                    <div className="hidden group-hover:block absolute top-2 right-2 z-10">
                                      <span className="text-xs bg-purple-700 text-white px-2 py-1 rounded shadow-lg">Anti-fraud & Stats</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Comments & Feedback */}
                              <div className={`relative group p-4 rounded-lg border shadow-sm transition-all duration-200 ${isDarkMode ? 'border-[#3f4c5a] bg-gradient-to-br from-[#1f2937] to-[#3a2a1f]' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-yellow-50'}`}>
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg shadow ${isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h6 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      Comments & Feedback
                                    </h6>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      Allow voters to share their thoughts, suggestions, and reactions in real time.
                                    </p>
                                    <div className="hidden group-hover:block absolute top-2 right-2 z-10">
                                      <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded shadow-lg">Live Discussion</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {/* Candidates Tab */}
                {activeTab === 'Candidates' && (
                  <>
                    {/* Candidates Section */}
                    <div className={`p-6 border-t ${isDarkMode ? 'border-[#3f4c5a] bg-[#1f2937]' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {editingCandidateId ? (
                              <>
                                <span className="inline-flex items-center gap-1">
                                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
                                  </svg>
                                  Edit Candidate
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="inline-flex items-center gap-1">
                                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 01-8 0M12 3v4m0 0v4m0-4h4m-4 0H8" />
                                  </svg>
                                  Candidates
                                </span>
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  {pollForm.candidates?.length || 0} total
                                </span>
                              </>
                            )}
                          </h4>
                          <p className={`text-sm mt-1 flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {editingCandidateId ? (
                              <>
                                <span>Update candidate information</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Editing Mode
                                </span>
                              </>
                            ) : (
                              <>
                                <span>Add and manage poll candidates</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                  Advanced: Drag & drop, reorder, rich profiles
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!editingCandidateId && (
                            <>
                              <button
                                type="button"
                                onClick={addCandidate}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold shadow transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDarkMode
                                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                                  }`}
                                aria-label="Add Candidate"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Candidate
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (pollForm.candidates && pollForm.candidates.length > 0) {
                                    const header = ['Name', 'Party', 'Description', 'Website', 'Twitter', 'Instagram'];
                                    const rows = pollForm.candidates.map(c => [
                                      (c.name || '').replace(/,/g, ' '),
                                      (c.party || '').replace(/,/g, ' '),
                                      (c.description || '').replace(/,/g, ' '),
                                      (c.website || '').replace(/,/g, ' '),
                                      (c.socialMedia?.twitter || '').replace(/,/g, ' '),
                                      (c.socialMedia?.instagram || '').replace(/,/g, ' ')
                                    ]);
                                    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
                                    const blob = new Blob([csvContent], { type: 'text/csv' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'candidates.csv';
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                    showNotification('Candidates exported as CSV!', 'success');
                                  } else {
                                    showNotification('No candidates to export.', 'warning');
                                  }
                                }}
                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center gap-1 border border-blue-400/30 hover:bg-blue-100 dark:hover:bg-blue-900 ${isDarkMode
                                  ? 'bg-transparent text-blue-200'
                                  : 'bg-white text-blue-700'
                                  }`}
                                aria-label="Export Candidates"
                                title="Export candidates as CSV"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Export CSV
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAnalyticsCandidate(candidate);
                                  setAnalyticsModalOpen(true);
                                }}
                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center gap-1 border border-purple-400/30 hover:bg-purple-100 dark:hover:bg-purple-900 ${isDarkMode
                                  ? 'bg-transparent text-purple-200'
                                  : 'bg-white text-purple-700'
                                  }`}
                                aria-label="Candidate Analytics"
                                title="Show candidate analytics"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Analytics
                              </button>
                            </>
                          )}
                          {editingCandidateId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCandidateId(null);
                                setCandidateForm({
                                  name: '',
                                  party: '',
                                  description: '',
                                  website: '',
                                  socialMedia: { twitter: '', instagram: '' },
                                  image: null
                                });
                              }}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center gap-1 border border-gray-400/30 hover:bg-gray-100 dark:hover:bg-gray-800 ${isDarkMode
                                ? 'bg-transparent text-gray-200'
                                : 'bg-white text-gray-700'
                                }`}
                              aria-label="Cancel Edit"
                              title="Cancel editing candidate"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Ultra-Advanced Candidate Form */}
                      <section
                        className={`p-8 rounded-2xl border mb-8 relative overflow-visible ${isDarkMode
                          ? 'border-[#3f4c5a] bg-gradient-to-br from-[#232b34] via-[#2c353f] to-[#1a2027]'
                          : 'border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100'
                          }`}
                        aria-labelledby="candidate-form-title"
                      >
                        <h5
                          id="candidate-form-title"
                          className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                          <svg
                            className="w-6 h-6 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {editingCandidateId ? 'Edit Candidate Details' : 'Add New Candidate'}
                        </h5>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                              <label
                                htmlFor="candidate-name"
                                className={`block text-sm font-semibold mb-2 tracking-wide ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                  }`}
                              >
                                Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                id="candidate-name"
                                type="text"
                                name="name"
                                value={candidateForm.name}
                                onChange={handleCandidateFormChange}
                                placeholder="Enter candidate name"
                                required
                                maxLength={100}
                                autoFocus
                                autoCapitalize="words"
                                className={`w-full px-4 py-3 rounded-lg border text-base transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 ${isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-200'
                                  }`}
                                aria-required="true"
                                aria-label="Candidate Name"
                              />
                            </div>
                            {/* Party/Affiliation */}
                            <div>
                              <label
                                htmlFor="candidate-party"
                                className={`block text-sm font-semibold mb-2 tracking-wide ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                  }`}
                              >
                                Party/Affiliation
                              </label>
                              <input
                                id="candidate-party"
                                type="text"
                                name="party"
                                value={candidateForm.party}
                                onChange={handleCandidateFormChange}
                                placeholder="Enter party or affiliation"
                                maxLength={100}
                                className={`w-full px-4 py-3 rounded-lg border text-base transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 ${isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-200'
                                  }`}
                                aria-label="Party or Affiliation"
                              />
                            </div>
                          </div>
                          {/* Description */}
                          <div>
                            <label
                              htmlFor="candidate-description"
                              className={`block text-sm font-semibold mb-2 tracking-wide ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                }`}
                            >
                              Description
                            </label>
                            <textarea
                              id="candidate-description"
                              name="description"
                              value={candidateForm.description}
                              onChange={handleCandidateFormChange}
                              placeholder="Enter candidate description (max 500 chars)"
                              rows={3}
                              maxLength={500}
                              className={`w-full px-4 py-3 rounded-lg border text-base transition-all duration-200 resize-vertical shadow-sm focus:outline-none focus:ring-2 ${isDarkMode
                                ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-200'
                                }`}
                              aria-label="Candidate Description"
                            />
                            <div className="text-xs text-right mt-1 opacity-60">
                              {candidateForm.description.length}/500
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Website */}
                            <div>
                              <label
                                htmlFor="candidate-website"
                                className={`block text-sm font-semibold mb-2 tracking-wide ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                  }`}
                              >
                                Website
                              </label>
                              <input
                                id="candidate-website"
                                type="url"
                                name="website"
                                value={candidateForm.website}
                                onChange={handleCandidateFormChange}
                                placeholder="https://example.com"
                                pattern="https?://.*"
                                maxLength={200}
                                className={`w-full px-4 py-3 rounded-lg border text-base transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 ${isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-200'
                                  }`}
                                aria-label="Candidate Website"
                              />
                            </div>
                            {/* Social Media */}
                            <div>
                              <label
                                className={`block text-sm font-semibold mb-2 tracking-wide ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                  }`}
                              >
                                Social Media
                              </label>
                              <div className="flex gap-2">
                                <div className="flex-1 relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                  </span>
                                  <input
                                    type="text"
                                    name="socialMedia.twitter"
                                    value={candidateForm.socialMedia.twitter}
                                    onChange={handleCandidateFormChange}
                                    placeholder="Twitter handle"
                                    maxLength={50}
                                    className={`pl-9 pr-4 py-3 rounded-lg border text-base transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 w-full ${isDarkMode
                                      ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-200'
                                      }`}
                                    aria-label="Twitter Handle"
                                  />
                                </div>
                                <div className="flex-1 relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 3.5h-8.5zm4.25 2.75a5.25 5.25 0 110 10.5 5.25 5.25 0 010-10.5zm0 1.5a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm6.25.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
                                    </svg>
                                  </span>
                                  <input
                                    type="text"
                                    name="socialMedia.instagram"
                                    value={candidateForm.socialMedia.instagram}
                                    onChange={handleCandidateFormChange}
                                    placeholder="Instagram handle"
                                    maxLength={50}
                                    className={`pl-9 pr-4 py-3 rounded-lg border text-base transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 w-full ${isDarkMode
                                      ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
                                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-200'
                                      }`}
                                    aria-label="Instagram Handle"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Profile Image */}
                          <div>
                            <label
                              htmlFor="candidate-image"
                              className={`block text-sm font-semibold mb-2 tracking-wide ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                }`}
                            >
                              Profile Image
                            </label>
                            <div
                              className={`flex items-center gap-6 p-4 rounded-xl border-2 border-dashed transition-all duration-200 ${isDarkMode
                                ? 'border-[#3f4c5a] bg-[#1f2937] hover:border-blue-400'
                                : 'border-gray-200 bg-white hover:border-blue-400'
                                }`}
                            >
                              <div
                                className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border-2 ${isDarkMode
                                  ? 'bg-[#2c353f] border-[#3f4c5a]'
                                  : 'bg-gray-100 border-gray-200'
                                  }`}
                              >
                                {candidateForm.image ? (
                                  <img
                                    src={URL.createObjectURL(candidateForm.image)}
                                    alt="Candidate"
                                    className="w-full h-full rounded-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <svg
                                    className={`w-10 h-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    }`}
                                >
                                  Upload candidate photo
                                </p>
                                <p
                                  className={`text-xs mt-1 truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}
                                >
                                  PNG, JPG or GIF (max. 2MB)
                                </p>
                                {candidateForm.image && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCandidateForm((prev) => ({
                                        ...prev,
                                        image: null,
                                      }))
                                    }
                                    className={`mt-2 text-xs underline text-red-500 hover:text-red-700`}
                                    aria-label="Remove candidate image"
                                  >
                                    Remove Image
                                  </button>
                                )}
                              </div>
                              <label
                                htmlFor="candidate-image"
                                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer shadow-sm ${isDarkMode
                                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                                  }`}
                                tabIndex={0}
                              >
                                Browse
                                <input
                                  id="candidate-image"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                  aria-label="Upload candidate image"
                                />
                              </label>
                            </div>
                          </div>
                          {/* Accessibility: Live region for form errors */}
                          <div
                            aria-live="polite"
                            className="sr-only"
                            id="candidate-form-errors"
                          ></div>
                        </div>
                        {/* Advanced: Keyboard shortcut hints */}
                        <div
                          className={`absolute top-2 right-4 flex gap-2 items-center text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          aria-hidden="true"
                        >
                          <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">Tab</span>
                          <span>to navigate</span>
                          <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">Enter</span>
                          <span>to submit</span>
                        </div>
                      </section>

                      {/* Advanced Candidates List with Rich Details, Drag-and-Drop, Tooltips, and Analytics */}
                      <div className="space-y-4 relative">
                        {/* Drag-and-drop handle instructions */}
                        <div
                          className={`absolute -top-8 right-0 flex gap-2 items-center text-xs font-mono z-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          aria-hidden="true"
                        >
                          <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">⇅</span>
                          <span>Drag to reorder</span>
                        </div>
                        {pollForm.candidates.length === 0 && (
                          <div className={`p-6 rounded-xl border-2 border-dashed text-center text-gray-400 dark:text-gray-500 ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-200'}`}>
                            <span className="text-lg">No candidates yet. Add your first candidate above!</span>
                          </div>
                        )}
                        {/* Advanced: Drag-and-drop support (pseudo, replace with real DnD if available) */}
                        {pollForm.candidates.map((candidate, idx) => (
                          <div
                            key={candidate.id || candidate.name || candidate._id}
                            className={`group p-4 rounded-xl border shadow-sm transition-all duration-200 relative overflow-visible w-full ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-200'
                              }`}
                            style={{ width: '100%' }}
                            tabIndex={0}
                            aria-label={`Candidate: ${candidate.name}`}
                          >
                            {/* Drag handle */}
                            <div
                              className={`absolute left-0 top-1/2 -translate-y-1/2 flex items-center cursor-grab opacity-70 group-hover:opacity-100 transition z-10`}
                              title="Drag to reorder"
                              tabIndex={-1}
                              style={{ left: '-1.5rem' }}
                              aria-hidden="true"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="6" r="1.5" />
                                <circle cx="12" cy="12" r="1.5" />
                                <circle cx="12" cy="18" r="1.5" />
                              </svg>
                            </div>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0 flex items-center gap-3">
                                {/* Candidate Photo Avatar */}
                                {candidate.image && (
                                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-[#3f4c5a] flex-shrink-0">
                                    <img
                                      src={
                                        typeof candidate.image === 'string'
                                          ? (candidate.image.startsWith('/uploads')
                                            ? `http://localhost:5001${candidate.image}`
                                            : candidate.image)
                                          : URL.createObjectURL(candidate.image)
                                      }
                                      alt={candidate.name}
                                      className="w-full h-full object-cover rounded-full"
                                      loading="lazy"
                                    />
                                  </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4
                                      className={`text-lg font-semibold truncate max-w-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                      title={candidate.name}
                                    >
                                      {candidate.name}
                                    </h4>
                                    {candidate.party && (
                                      <span
                                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}
                                        title={`Party: ${candidate.party}`}
                                      >
                                        {candidate.party}
                                      </span>
                                    )}
                                    {candidate.age && (
                                      <span
                                        className={`px-2 py-0.5 text-xs rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                                        title="Age"
                                      >
                                        Age: {candidate.age}
                                      </span>
                                    )}
                                    {candidate.status && (
                                      <span
                                        className={`px-2 py-0.5 text-xs rounded-full ${candidate.status === 'incumbent'
                                          ? (isDarkMode ? 'bg-green-700/30 text-green-300' : 'bg-green-100 text-green-700')
                                          : (isDarkMode ? 'bg-yellow-700/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700')
                                          }`}
                                        title="Status"
                                      >
                                        {candidate.status}
                                      </span>
                                    )}
                                  </div>
                                  {candidate.description && (
                                    <p
                                      className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                                      title={candidate.description}
                                    >
                                      {candidate.description}
                                    </p>
                                  )}
                                  {/* Advanced: Candidate Details Table */}
                                  <div className="mt-2 flex flex-wrap gap-3 items-center">
                                    {candidate.website && (
                                      <a
                                        href={candidate.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm flex items-center gap-1 underline underline-offset-2 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                        title="Official Website"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        Website
                                      </a>
                                    )}
                                    {candidate.socialMedia && candidate.socialMedia.twitter && (
                                      <a
                                        href={`https://twitter.com/${candidate.socialMedia.twitter}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                        title={`Twitter: @${candidate.socialMedia.twitter}`}
                                      >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                        @{candidate.socialMedia.twitter}
                                      </a>
                                    )}
                                    {candidate.socialMedia && candidate.socialMedia.instagram && (
                                      <a
                                        href={`https://instagram.com/${candidate.socialMedia.instagram}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-pink-300 hover:text-pink-200' : 'text-pink-600 hover:text-pink-700'}`}
                                        title={`Instagram: @${candidate.socialMedia.instagram}`}
                                      >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                                        </svg>
                                        @{candidate.socialMedia.instagram}
                                      </a>
                                    )}
                                    {candidate.socialMedia && candidate.socialMedia.facebook && (
                                      <a
                                        href={`https://facebook.com/${candidate.socialMedia.facebook}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-800 hover:text-blue-900'}`}
                                        title={`Facebook: ${candidate.socialMedia.facebook}`}
                                      >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                                        </svg>
                                        {candidate.socialMedia.facebook}
                                      </a>
                                    )}
                                    {candidate.email && (
                                      <a
                                        href={`mailto:${candidate.email}`}
                                        className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-green-300 hover:text-green-200' : 'text-green-700 hover:text-green-900'}`}
                                        title="Email"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
                                        </svg>
                                        Email
                                      </a>
                                    )}
                                    {candidate.phone && (
                                      <a
                                        href={`tel:${candidate.phone}`}
                                        className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-yellow-300 hover:text-yellow-200' : 'text-yellow-700 hover:text-yellow-900'}`}
                                        title="Phone"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm12-12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        Phone
                                      </a>
                                    )}
                                  </div>
                                  {/* Advanced: Candidate Analytics */}
                                  {candidate.analytics && (
                                    <div className="mt-3 flex flex-wrap gap-4 text-xs">
                                      <div className={`flex items-center gap-1 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l5 5L20 7" />
                                        </svg>
                                        <span>Votes: {candidate.analytics.votes}</span>
                                      </div>
                                      <div className={`flex items-center gap-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                          <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span>Last Updated: {candidate.analytics.lastUpdated}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-2 min-w-[3.5rem]">
                                  {/* Advanced: Tooltip on edit/remove */}
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditCandidate(candidate)}
                                      className={`p-2 rounded-lg transition-colors duration-200 group/edit relative ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                                      title="Edit Candidate"
                                      aria-label={`Edit ${candidate.name}`}
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      <span className="absolute left-1/2 -translate-x-1/2 top-10 opacity-0 group-hover/edit:opacity-100 pointer-events-none transition bg-black/80 text-white text-xs px-2 py-1 rounded shadow z-20">
                                        Edit
                                      </span>
                                    </button>
                                    <button
                                      onClick={() => removeCandidate(candidate.id)}
                                      className={`p-2 rounded-lg transition-colors duration-200 group/delete relative ${isDarkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-red-500 hover:text-red-600 hover:bg-red-50'}`}
                                      title="Remove Candidate"
                                      aria-label={`Remove ${candidate.name}`}
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      <span className="absolute left-1/2 -translate-x-1/2 top-10 opacity-0 group-hover/delete:opacity-100 pointer-events-none transition bg-black/80 text-white text-xs px-2 py-1 rounded shadow z-20">
                                        Remove
                                      </span>
                                    </button>
                                  </div>
                                  {/* Advanced: Quick copy candidate info */}
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        `Candidate: ${candidate.name}\n${candidate.party ? `Party: ${candidate.party}\n` : ''}${candidate.description ? `Description: ${candidate.description}\n` : ''}${candidate.website ? `Website: ${candidate.website}\n` : ''}`
                                      );
                                      if (typeof window !== 'undefined' && window.toast) {
                                        window.toast.success('Candidate info copied!');
                                      }
                                    }}
                                    className={`mt-1 px-2 py-1 rounded text-xs font-mono border transition-colors duration-200 ${isDarkMode ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                                    title="Copy candidate info"
                                    aria-label={`Copy info for ${candidate.name}`}
                                  >
                                    <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                                      <rect x="3" y="3" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    Copy
                                  </button>
                                </div>
                              </div>
                              {/* Advanced: Candidate meta info */}
                              <div className="mt-2 flex flex-wrap gap-4 text-xs opacity-80">
                                {candidate.createdBy && (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <circle cx="12" cy="7" r="4" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.5 21a8.38 8.38 0 0113 0" />
                                    </svg>
                                    Added by: {candidate.createdBy}
                                  </span>
                                )}
                                {candidate.createdAt && (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                                      <circle cx="12" cy="12" r="10" />
                                    </svg>
                                    {`Added: ${new Date(candidate.createdAt).toLocaleString()}`}
                                  </span>
                                )}
                                {typeof candidate.order === 'number' && (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4-4 4 4m0-8l-4 4-4-4" />
                                    </svg>
                                    Order: {candidate.order + 1}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {/* Voting Tab */}
                {activeTab === 'Voting' && (
                  <>
                    {/* Poll Settings Section (Voting Settings only) */}
                    <div className={`p-6 rounded-xl border mt-6 ${isDarkMode ? 'border-[#3f4c5a] bg-[#2c353f]' : 'border-gray-200 bg-white'}`}>
                      <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Poll Settings
                      </h4>
                      <div className="space-y-6">
                        {/* Voting Settings */}
                        <div>
                          <h5 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Voting Settings
                            <span className="ml-2 text-xs font-normal text-blue-400 italic">
                              (Advanced configuration)
                            </span>
                            <button
                              type="button"
                              className="ml-2 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                              aria-label="Voting settings help"
                              tabIndex={0}
                              onClick={() => setShowVotingSettingsHelp(v => !v)}
                            >
                              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </button>
                          </h5>
                          {showVotingSettingsHelp && (
                            <div className={`mb-4 p-3 rounded-lg shadow-lg border text-xs ${isDarkMode ? 'bg-[#1a2230] border-[#3f4c5a] text-blue-100' : 'bg-blue-50 border-blue-200 text-blue-900'}`}>
                              <strong>Voting Settings:</strong>
                              <ul className="list-disc ml-4 mt-1 space-y-1">
                                <li><b>Allow Multiple Votes:</b> Let voters select more than one candidate per ballot.</li>
                                <li><b>Show Results Before End:</b> Display live results as votes are cast.</li>
                                <li><b>Show Results After Voting:</b> Show results to a voter immediately after they vote.</li>
                                <li><b>Require Authentication:</b> Only logged-in users can vote, preventing anonymous voting.</li>
                                <li><b>Advanced:</b> Configure vote limits, randomize candidate order, and more below.</li>
                              </ul>
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Allow Multiple Votes */}
                            <label className={`flex items-start gap-3 p-4 rounded-lg border relative transition-colors duration-200 cursor-pointer group ${isDarkMode
                              ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                              : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                              }`}>
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  name="allowMultipleVotes"
                                  checked={pollForm.settings.allowMultipleVotes}
                                  onChange={() => handleSettingsChange('allowMultipleVotes')}
                                  className={`w-4 h-4 rounded border transition-colors duration-200 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                                    }`}
                                  aria-describedby="allow-multi-votes-desc"
                                />
                              </div>
                              <div className="flex-1">
                                <span className={`block text-sm font-medium flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Allow Multiple Votes
                                  <span className="ml-1 text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">Multi-select</span>
                                </span>
                                <span id="allow-multi-votes-desc" className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Voters can cast multiple votes for different candidates.
                                </span>
                                {pollForm.settings.allowMultipleVotes && (
                                  <div className="mt-2 flex flex-col gap-1">
                                    <label className="flex items-center gap-2 text-xs">
                                      <span>Max votes per voter:</span>
                                      <input
                                        type="number"
                                        min={1}
                                        max={pollForm.candidates.length}
                                        value={pollForm.settings.maxVotesPerVoter || ''}
                                        onChange={e => handleSettingsChange('maxVotesPerVoter', Math.max(1, Math.min(Number(e.target.value), pollForm.candidates.length)))}
                                        className={`w-16 px-2 py-1 rounded border text-xs focus:outline-none ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                        placeholder="No limit"
                                        aria-label="Maximum votes per voter"
                                      />
                                      <span className="text-gray-400">(Leave blank for no limit)</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.randomizeCandidateOrder}
                                        onChange={() => handleSettingsChange('randomizeCandidateOrder')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Randomize candidate order for each voter</span>
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
                                <span className="text-xs bg-blue-700 text-white px-2 py-1 rounded shadow-lg">Advanced</span>
                              </div>
                            </label>

                            {/* Show Results Before End */}
                            <label className={`flex items-start gap-3 p-4 rounded-lg border relative transition-colors duration-200 cursor-pointer group ${isDarkMode
                              ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                              : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                              }`}>
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  name="showResultsBeforeEnd"
                                  checked={pollForm.settings.showResultsBeforeEnd}
                                  onChange={() => handleSettingsChange('showResultsBeforeEnd')}
                                  className={`w-4 h-4 rounded border transition-colors duration-200 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                                    }`}
                                  aria-describedby="show-results-before-end-desc"
                                />
                              </div>
                              <div className="flex-1">
                                <span className={`block text-sm font-medium flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Show Results Before End
                                  <span className="ml-1 text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">Live</span>
                                </span>
                                <span id="show-results-before-end-desc" className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Display real-time results while the poll is active.
                                </span>
                                {pollForm.settings.showResultsBeforeEnd && (
                                  <div className="mt-2 flex flex-col gap-1">
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.hideVoteCounts}
                                        onChange={() => handleSettingsChange('hideVoteCounts')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Hide exact vote counts (show only percentages or bars)</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.blurResultsForNonVoters}
                                        onChange={() => handleSettingsChange('blurResultsForNonVoters')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Blur results for users who haven't voted yet</span>
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
                                <span className="text-xs bg-green-700 text-white px-2 py-1 rounded shadow-lg">Live Results</span>
                              </div>
                            </label>

                            {/* Show Results After Voting */}
                            <label className={`flex items-start gap-3 p-4 rounded-lg border relative transition-colors duration-200 cursor-pointer group ${isDarkMode
                              ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                              : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                              }`}>
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  name="showResultsAfterVote"
                                  checked={pollForm.settings.showResultsAfterVote}
                                  onChange={() => handleSettingsChange('showResultsAfterVote')}
                                  className={`w-4 h-4 rounded border transition-colors duration-200 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                                    }`}
                                  aria-describedby="show-results-after-vote-desc"
                                />
                              </div>
                              <div className="flex-1">
                                <span className={`block text-sm font-medium flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Show Results Immediately After Voting
                                  <span className="ml-1 text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">Instant</span>
                                </span>
                                <span id="show-results-after-vote-desc" className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  If enabled, voters will see poll results right after casting their vote (unless a result date is set in the future).
                                </span>
                                {pollForm.settings.showResultsAfterVote && (
                                  <div className="mt-2 flex flex-col gap-1">
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.showPersonalVoteSummary}
                                        onChange={() => handleSettingsChange('showPersonalVoteSummary')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Show voter a summary of their selections</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.showLeaderboard}
                                        onChange={() => handleSettingsChange('showLeaderboard')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Show top candidates leaderboard</span>
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
                                <span className="text-xs bg-indigo-700 text-white px-2 py-1 rounded shadow-lg">After Vote</span>
                              </div>
                            </label>

                            {/* Require Authentication */}
                            <label className={`flex items-start gap-3 p-4 rounded-lg border relative transition-colors duration-200 cursor-pointer group ${isDarkMode
                              ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                              : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                              }`}>
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  name="requireAuthentication"
                                  checked={pollForm.settings.requireAuthentication}
                                  onChange={() => handleSettingsChange('requireAuthentication')}
                                  className={`w-4 h-4 rounded border transition-colors duration-200 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                                    }`}
                                  aria-describedby="require-auth-desc"
                                />
                              </div>
                              <div className="flex-1">
                                <span className={`block text-sm font-medium flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Require Authentication
                                  <span className="ml-1 text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">Secure</span>
                                </span>
                                <span id="require-auth-desc" className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Voters must be logged in to participate.
                                </span>
                                {pollForm.settings.requireAuthentication && (
                                  <div className="mt-2 flex flex-col gap-1">
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.preventDuplicateAccounts}
                                        onChange={() => handleSettingsChange('preventDuplicateAccounts')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Prevent duplicate accounts (email/SSO verification)</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.enable2FA}
                                        onChange={() => handleSettingsChange('enable2FA')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Require 2FA for voting</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.allowGuestViewOnly}
                                        onChange={() => handleSettingsChange('allowGuestViewOnly')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Allow guests to view results but not vote</span>
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
                                <span className="text-xs bg-red-700 text-white px-2 py-1 rounded shadow-lg">Auth</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {/* Privacy Tab */}
                {activeTab === 'Privacy' && (
                  <>
                    {/* Poll Settings Section (Privacy & Data Control only) */}
                    <div className={`p-6 rounded-xl border mt-6 ${isDarkMode ? 'border-[#3f4c5a] bg-[#2c353f]' : 'border-gray-200 bg-white'}`}>
                      <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Poll Settings
                      </h4>
                      <div className="space-y-6">
                        {/* Privacy & Data Control Settings */}
                        <div>
                          <h5 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 0v6m0 0c-3.866 0-7-3.134-7-7a7 7 0 1114 0c0 3.866-3.134 7-7 7z" />
                            </svg>
                            Privacy & Data Control
                            <span className="ml-2 text-xs font-normal text-blue-400 italic">
                              (Advanced privacy, anonymity, and audit options)
                            </span>
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Enable Comments */}
                            <label className={`flex items-start gap-3 p-4 rounded-lg border relative transition-colors duration-200 cursor-pointer group ${isDarkMode
                              ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                              : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                              }`}>
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  name="enableComments"
                                  checked={pollForm.settings.enableComments}
                                  onChange={() => handleSettingsChange('enableComments')}
                                  className={`w-4 h-4 rounded border transition-colors duration-200 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                                    }`}
                                  aria-describedby="enable-comments-desc"
                                />
                              </div>
                              <div className="flex-1">
                                <span className={`block text-sm font-medium flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Enable Comments
                                  <span className="ml-1 text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">Discussion</span>
                                </span>
                                <span id="enable-comments-desc" className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Allow voters to leave comments on the poll. <b>Advanced:</b> Moderation, profanity filter, and anonymous comments available below.
                                </span>
                                {pollForm.settings.enableComments && (
                                  <div className="mt-2 flex flex-col gap-1">
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.commentsRequireModeration}
                                        onChange={() => handleSettingsChange('commentsRequireModeration')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Require moderation for comments</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.commentsAllowAnonymous}
                                        onChange={() => handleSettingsChange('commentsAllowAnonymous')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Allow anonymous comments</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.commentsProfanityFilter}
                                        onChange={() => handleSettingsChange('commentsProfanityFilter')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Enable profanity filter</span>
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
                                <span className="text-xs bg-blue-700 text-white px-2 py-1 rounded shadow-lg">Advanced</span>
                              </div>
                            </label>

                            {/* Show Voter Names */}
                            <label className={`flex items-start gap-3 p-4 rounded-lg border relative transition-colors duration-200 cursor-pointer group ${isDarkMode
                              ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                              : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                              }`}>
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  name="showVoterNames"
                                  checked={pollForm.settings.showVoterNames}
                                  onChange={handleSettingsChange}
                                  className={`w-4 h-4 rounded border transition-colors duration-200 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                                    }`}
                                  aria-describedby="show-voter-names-desc"
                                />
                              </div>
                              <div className="flex-1">
                                <span className={`block text-sm font-medium flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Show Voter Names
                                  <span className="ml-1 text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">Transparency</span>
                                </span>
                                <span id="show-voter-names-desc" className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Display names of voters in the results. <b>Advanced:</b> Choose between full names, initials, or anonymized IDs.
                                </span>
                                {pollForm.settings.showVoterNames && (
                                  <div className="mt-2 flex flex-col gap-1">
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="radio"
                                        name="voterNameDisplay"
                                        value="full"
                                        checked={pollForm.settings.voterNameDisplay === 'full'}
                                        onChange={() => handleSettingsChange('voterNameDisplay', 'full')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Full name</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="radio"
                                        name="voterNameDisplay"
                                        value="initials"
                                        checked={pollForm.settings.voterNameDisplay === 'initials'}
                                        onChange={() => handleSettingsChange('voterNameDisplay', 'initials')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Initials only</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="radio"
                                        name="voterNameDisplay"
                                        value="anonymized"
                                        checked={pollForm.settings.voterNameDisplay === 'anonymized'}
                                        onChange={() => handleSettingsChange('voterNameDisplay', 'anonymized')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Anonymized ID</span>
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
                                <span className="text-xs bg-green-700 text-white px-2 py-1 rounded shadow-lg">Identity</span>
                              </div>
                            </label>

                            {/* Voter Anonymity */}
                            <label className={`flex items-start gap-3 p-4 rounded-lg border relative transition-colors duration-200 cursor-pointer group ${isDarkMode
                              ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                              : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                              }`}>
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  name="anonymousVoting"
                                  checked={!!pollForm.settings.anonymousVoting}
                                  onChange={() => handleSettingsChange('anonymousVoting')}
                                  className={`w-4 h-4 rounded border transition-colors duration-200 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                                    }`}
                                  aria-describedby="anonymous-voting-desc"
                                />
                              </div>
                              <div className="flex-1">
                                <span className={`block text-sm font-medium flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Anonymous Voting
                                  <span className="ml-1 text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Privacy</span>
                                </span>
                                <span id="anonymous-voting-desc" className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Hide voter identities from everyone, including admins. Votes are cryptographically anonymized.
                                </span>
                              </div>
                              <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
                                <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded shadow-lg">Anonymity</span>
                              </div>
                            </label>

                            {/* Public Audit Trail */}
                            <label className={`flex items-start gap-3 p-4 rounded-lg border relative transition-colors duration-200 cursor-pointer group ${isDarkMode
                              ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                              : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                              }`}>
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  name="publicAuditTrail"
                                  checked={!!pollForm.settings.publicAuditTrail}
                                  onChange={() => handleSettingsChange('publicAuditTrail')}
                                  className={`w-4 h-4 rounded border transition-colors duration-200 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                                    }`}
                                  aria-describedby="public-audit-desc"
                                />
                              </div>
                              <div className="flex-1">
                                <span className={`block text-sm font-medium flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Public Audit Trail
                                  <span className="ml-1 text-xs px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200">Audit</span>
                                </span>
                                <span id="public-audit-desc" className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Allow anyone to verify the integrity of the poll results. <b>Advanced:</b> Downloadable logs, blockchain anchoring, and tamper-evident records.
                                </span>
                                {pollForm.settings.publicAuditTrail && (
                                  <div className="mt-2 flex flex-col gap-1">
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.blockchainAnchoring}
                                        onChange={() => handleSettingsChange('blockchainAnchoring')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Anchor audit log to blockchain</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.allowAuditLogDownload}
                                        onChange={() => handleSettingsChange('allowAuditLogDownload')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Allow audit log download</span>
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
                                <span className="text-xs bg-yellow-700 text-white px-2 py-1 rounded shadow-lg">Audit</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {/* Notifications Tab */}
                {activeTab === 'Notifications' && (
                  <>
                    {/* Poll Settings Section (Notification & Alert Settings only) */}
                    <div className={`p-6 rounded-xl border mt-6 ${isDarkMode ? 'border-[#3f4c5a] bg-[#2c353f]' : 'border-gray-200 bg-white'}`}>
                      <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Poll Settings
                      </h4>
                      <div className="space-y-6">
                        {/* Notification & Alert Settings (Advanced) */}
                        <div>
                          <h5 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Notification & Alert Settings
                            <span className="ml-2 text-xs font-normal text-blue-400 italic">
                              (Multi-channel, granular, and automated notifications)
                            </span>
                            <button
                              type="button"
                              className="ml-2 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                              aria-label="Notification settings help"
                              tabIndex={0}
                              onClick={() => setShowNotificationSettingsHelp?.(v => !v)}
                            >
                              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </button>
                          </h5>
                          {showNotificationSettingsHelp && (
                            <div className={`mb-4 p-3 rounded-lg shadow-lg border text-xs ${isDarkMode ? 'bg-[#1a2230] border-[#3f4c5a] text-blue-100' : 'bg-blue-50 border-blue-200 text-blue-900'}`}>
                              <strong>Notification & Alert Settings:</strong>
                              <ul className="list-disc ml-4 mt-1 space-y-1">
                                <li><b>Notify on New Votes:</b> Get notified instantly when a new vote is cast.</li>
                                <li><b>Notify on Poll End:</b> Receive alerts when the poll concludes.</li>
                                <li><b>Notify on Comments:</b> Be alerted when new comments are posted.</li>
                                <li><b>Notify on Suspicious Activity:</b> Get real-time alerts for potential fraud or abuse.</li>
                                <li><b>Delivery Channels:</b> Choose Email, SMS, Push, or Webhook notifications.</li>
                                <li><b>Advanced:</b> Set custom recipients, notification frequency, and automation rules.</li>
                              </ul>
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Notify on New Votes */}
                            <label className={`flex items-start gap-3 p-4 rounded-lg border relative transition-colors duration-200 cursor-pointer group ${isDarkMode
                              ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                              : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                              }`}>
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  name="notifyOnVote"
                                  checked={!!pollForm.settings.notifyOnVote}
                                  onChange={() => handleSettingsChange('notifyOnVote')}
                                  className={`w-4 h-4 rounded border transition-colors duration-200 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                                    }`}
                                  aria-describedby="notify-on-vote-desc"
                                />
                              </div>
                              <div className="flex-1">
                                <span className={`block text-sm font-medium flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Notify on New Votes
                                  <span className="ml-1 text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">Live</span>
                                </span>
                                <span id="notify-on-vote-desc" className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Receive instant notifications when new votes are cast. <b>Advanced:</b> Choose delivery channel, frequency, and recipients below.
                                </span>
                                {pollForm.settings.notifyOnVote && (
                                  <div className="mt-2 flex flex-col gap-1">
                                    <label className="flex items-center gap-2 text-xs">
                                      <span>Delivery Channel:</span>
                                      <select
                                        value={pollForm.settings.notifyOnVoteChannel || 'email'}
                                        onChange={e => handleSettingsChange('notifyOnVoteChannel', e.target.value)}
                                        className={`px-2 py-1 rounded border text-xs focus:outline-none ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                      >
                                        <option value="email">Email</option>
                                        <option value="sms">SMS</option>
                                        <option value="push">Push</option>
                                        <option value="webhook">Webhook</option>
                                      </select>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <span>Recipients:</span>
                                      <input
                                        type="text"
                                        value={pollForm.settings.notifyOnVoteRecipients || ''}
                                        onChange={e => handleSettingsChange('notifyOnVoteRecipients', e.target.value)}
                                        className={`w-full px-2 py-1 rounded border text-xs focus:outline-none ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                        placeholder="Comma-separated emails, phone numbers, or webhook URLs"
                                      />
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <span>Frequency:</span>
                                      <select
                                        value={pollForm.settings.notifyOnVoteFrequency || 'immediate'}
                                        onChange={e => handleSettingsChange('notifyOnVoteFrequency', e.target.value)}
                                        className={`px-2 py-1 rounded border text-xs focus:outline-none ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                      >
                                        <option value="immediate">Immediate</option>
                                        <option value="hourly">Hourly Digest</option>
                                        <option value="daily">Daily Digest</option>
                                      </select>
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
                                <span className="text-xs bg-blue-700 text-white px-2 py-1 rounded shadow-lg">Live</span>
                              </div>
                            </label>

                            {/* Notify on Poll End */}
                            <label className={`flex items-start gap-3 p-4 rounded-lg border relative transition-colors duration-200 cursor-pointer group ${isDarkMode
                              ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                              : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                              }`}>
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  name="notifyOnEnd"
                                  checked={!!pollForm.settings.notifyOnEnd}
                                  onChange={() => handleSettingsChange('notifyOnEnd')}
                                  className={`w-4 h-4 rounded border transition-colors duration-200 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                                    }`}
                                  aria-describedby="notify-on-end-desc"
                                />
                              </div>
                              <div className="flex-1">
                                <span className={`block text-sm font-medium flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Notify on Poll End
                                  <span className="ml-1 text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">Summary</span>
                                </span>
                                <span id="notify-on-end-desc" className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Receive a notification when the poll ends. <b>Advanced:</b> Choose delivery channel, recipients, and include results summary.
                                </span>
                                {pollForm.settings.notifyOnEnd && (
                                  <div className="mt-2 flex flex-col gap-1">
                                    <label className="flex items-center gap-2 text-xs">
                                      <span>Delivery Channel:</span>
                                      <select
                                        value={pollForm.settings.notifyOnEndChannel || 'email'}
                                        onChange={e => handleSettingsChange('notifyOnEndChannel', e.target.value)}
                                        className={`px-2 py-1 rounded border text-xs focus:outline-none ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                      >
                                        <option value="email">Email</option>
                                        <option value="sms">SMS</option>
                                        <option value="push">Push</option>
                                        <option value="webhook">Webhook</option>
                                      </select>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <span>Recipients:</span>
                                      <input
                                        type="text"
                                        value={pollForm.settings.notifyOnEndRecipients || ''}
                                        onChange={e => handleSettingsChange('notifyOnEndRecipients', e.target.value)}
                                        className={`w-full px-2 py-1 rounded border text-xs focus:outline-none ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                        placeholder="Comma-separated emails, phone numbers, or webhook URLs"
                                      />
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <input
                                        type="checkbox"
                                        checked={!!pollForm.settings.notifyOnEndIncludeResults}
                                        onChange={() => handleSettingsChange('notifyOnEndIncludeResults')}
                                        className={`w-3 h-3 rounded border ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-300'}`}
                                      />
                                      <span>Include poll results summary in notification</span>
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
                                <span className="text-xs bg-green-700 text-white px-2 py-1 rounded shadow-lg">Summary</span>
                              </div>
                            </label>

                            {/* Notify on New Comments */}
                            <label className={`flex items-start gap-3 p-4 rounded-lg border relative transition-colors duration-200 cursor-pointer group ${isDarkMode
                              ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                              : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                              }`}>
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  name="notifyOnComment"
                                  checked={!!pollForm.settings.notifyOnComment}
                                  onChange={() => handleSettingsChange('notifyOnComment')}
                                  className={`w-4 h-4 rounded border transition-colors duration-200 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                                    }`}
                                  aria-describedby="notify-on-comment-desc"
                                />
                              </div>
                              <div className="flex-1">
                                <span className={`block text-sm font-medium flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Notify on New Comments
                                  <span className="ml-1 text-xs px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200">Comments</span>
                                </span>
                                <span id="notify-on-comment-desc" className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Receive notifications when new comments are posted. <b>Advanced:</b> Choose delivery channel and recipients.
                                </span>
                                {pollForm.settings.notifyOnComment && (
                                  <div className="mt-2 flex flex-col gap-1">
                                    <label className="flex items-center gap-2 text-xs">
                                      <span>Delivery Channel:</span>
                                      <select
                                        value={pollForm.settings.notifyOnCommentChannel || 'email'}
                                        onChange={e => handleSettingsChange('notifyOnCommentChannel', e.target.value)}
                                        className={`px-2 py-1 rounded border text-xs focus:outline-none ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                      >
                                        <option value="email">Email</option>
                                        <option value="sms">SMS</option>
                                        <option value="push">Push</option>
                                        <option value="webhook">Webhook</option>
                                      </select>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <span>Recipients:</span>
                                      <input
                                        type="text"
                                        value={pollForm.settings.notifyOnCommentRecipients || ''}
                                        onChange={e => handleSettingsChange('notifyOnCommentRecipients', e.target.value)}
                                        className={`w-full px-2 py-1 rounded border text-xs focus:outline-none ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                        placeholder="Comma-separated emails, phone numbers, or webhook URLs"
                                      />
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
                                <span className="text-xs bg-yellow-700 text-white px-2 py-1 rounded shadow-lg">Comments</span>
                              </div>
                            </label>

                            {/* Notify on Suspicious Activity */}
                            <label className={`flex items-start gap-3 p-4 rounded-lg border relative transition-colors duration-200 cursor-pointer group ${isDarkMode
                              ? 'border-[#3f4c5a] hover:border-red-500/50 hover:bg-red-500/5'
                              : 'border-gray-200 hover:border-red-500/50 hover:bg-red-50'
                              }`}>
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  name="notifyOnSuspicious"
                                  checked={!!pollForm.settings.notifyOnSuspicious}
                                  onChange={() => handleSettingsChange('notifyOnSuspicious')}
                                  className={`w-4 h-4 rounded border transition-colors duration-200 ${isDarkMode
                                    ? 'bg-[#1f2937] border-[#3f4c5a] text-red-500 focus:ring-red-500'
                                    : 'bg-white border-gray-300 text-red-600 focus:ring-red-500'
                                    }`}
                                  aria-describedby="notify-on-suspicious-desc"
                                />
                              </div>
                              <div className="flex-1">
                                <span className={`block text-sm font-medium flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Notify on Suspicious Activity
                                  <span className="ml-1 text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">Security</span>
                                </span>
                                <span id="notify-on-suspicious-desc" className={`block text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Get real-time alerts for potential fraud, abuse, or suspicious voting patterns. <b>Advanced:</b> Choose delivery channel and recipients.
                                </span>
                                {pollForm.settings.notifyOnSuspicious && (
                                  <div className="mt-2 flex flex-col gap-1">
                                    <label className="flex items-center gap-2 text-xs">
                                      <span>Delivery Channel:</span>
                                      <select
                                        value={pollForm.settings.notifyOnSuspiciousChannel || 'email'}
                                        onChange={e => handleSettingsChange('notifyOnSuspiciousChannel', e.target.value)}
                                        className={`px-2 py-1 rounded border text-xs focus:outline-none ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                      >
                                        <option value="email">Email</option>
                                        <option value="sms">SMS</option>
                                        <option value="push">Push</option>
                                        <option value="webhook">Webhook</option>
                                      </select>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                      <span>Recipients:</span>
                                      <input
                                        type="text"
                                        value={pollForm.settings.notifyOnSuspiciousRecipients || ''}
                                        onChange={e => handleSettingsChange('notifyOnSuspiciousRecipients', e.target.value)}
                                        className={`w-full px-2 py-1 rounded border text-xs focus:outline-none ${isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a] text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                        placeholder="Comma-separated emails, phone numbers, or webhook URLs"
                                      />
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
                                <span className="text-xs bg-red-700 text-white px-2 py-1 rounded shadow-lg">Security</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {/* Action Buttons (always visible) */}
                <div className={`sticky bottom-0 left-0 right-0 flex items-center justify-end gap-4 p-6 border-t ${isDarkMode ? 'bg-[#1f2937] border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setIsEditing(false);
                      setSelectedPoll(null);
                      setPollForm({
                        title: '',
                        description: '',
                        category: '',
                        startDate: '',
                        endDate: '',
                        resultDate: '',
                        settings: {
                          allowMultipleVotes: false,
                          showResultsBeforeEnd: false,
                          showResultsAfterVote: false,
                          requireAuthentication: false,
                          enableComments: false,
                          showVoterNames: false,
                          notifyOnVote: false,
                          notifyOnEnd: false
                        },
                        candidates: []
                      });
                    }}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 ${isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 ${isDarkMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    {isEditing ? 'Save Changes' : 'Create Poll'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-[#2c353f]' : 'bg-white'} rounded-lg p-6 max-w-md w-full mx-4`}>
            <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Delete Poll
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}`}>
              Are you sure you want to delete "{selectedPoll?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPoll(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeletePoll(selectedPoll);
                  setShowDeleteModal(false);
                  setSelectedPoll(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isDarkMode
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                  : 'bg-red-50 hover:bg-red-100 text-red-600'
                  }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      <Modal
        isOpen={showAuditModal}
        onRequestClose={() => setShowAuditModal(false)}
        contentLabel="Audit Log"
        ariaHideApp={false}
        className={`fixed inset-0 flex items-center justify-center z-50 bg-black/40`}
        overlayClassName=""
      >
        <div className={`bg-white dark:bg-[#1e242c] rounded-xl p-8 max-w-2xl w-full shadow-2xl border border-gray-200/50 dark:border-[#3f4c5a]/50`}>
          <h2 className="text-xl font-bold mb-4">Audit Log for: <span className="font-semibold">{auditPollTitle}</span></h2>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => exportAuditLogsToCSV(auditLogs)}
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition text-sm"
              disabled={auditLogs.length === 0}
            >
              Export CSV
            </button>
          </div>
          {auditLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : auditError ? (
            <div className="text-center text-red-500 py-8">{auditError}</div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-8">No audit log entries found.</div>
          ) : (
            <div className="overflow-x-auto max-h-[60vh]">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100 dark:bg-[#23272f]">
                    <th className="px-4 py-2 border">User</th>
                    <th className="px-4 py-2 border">Option</th>
                    <th className="px-4 py-2 border">Action</th>
                    <th className="px-4 py-2 border">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, idx) => (
                    <tr key={log._id || idx} className="border-b">
                      <td className="px-4 py-2 border">{log.user?.name || log.user?.email || 'Unknown'}</td>
                      <td className="px-4 py-2 border">{log.option}</td>
                      <td className="px-4 py-2 border">{log.action}</td>
                      <td className="px-4 py-2 border">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowAuditModal(false)}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {analyticsModalOpen && analyticsCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setAnalyticsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              aria-label="Close analytics modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Candidate Analytics</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Name:</span>
                <span>{analyticsCandidate.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Party:</span>
                <span>{analyticsCandidate.party || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Votes:</span>
                <span>{analyticsCandidate.votes ?? analyticsCandidate.analytics?.votes ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Vote Share:</span>
                <span>{pollForm.totalVotes ? `${((analyticsCandidate.votes ?? analyticsCandidate.analytics?.votes ?? 0) / pollForm.totalVotes * 100).toFixed(1)}%` : 'N/A'}</span>
              </div>
              {analyticsCandidate.analytics?.lastUpdated && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Last Updated:</span>
                  <span>{analyticsCandidate.analytics.lastUpdated}</span>
                </div>
              )}
              {/* Add more analytics fields as needed */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollsPage; 