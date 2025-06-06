import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PollsPage = () => {
  const { isDarkMode } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Sample polls data
  const polls = [
    {
      id: 1,
      title: 'Student Council Election',
      description: 'Annual election for student council members',
      status: 'active',
      startDate: '2024-03-01',
      endDate: '2024-03-15',
      totalVotes: 450,
      candidates: [
        { 
          id: 1, 
          name: 'John Doe', 
          votes: 180,
          party: 'Independent',
          description: 'Dedicated to student welfare',
          website: 'https://johndoe.com',
          socialMedia: {
            twitter: 'johndoe',
            instagram: 'johndoe'
          }
        },
        { 
          id: 2, 
          name: 'Jane Smith', 
          votes: 270,
          party: 'Student Union',
          description: 'Advocating for better facilities',
          website: 'https://janesmith.com',
          socialMedia: {
            twitter: 'janesmith',
            instagram: 'janesmith'
          }
        },
      ],
    },
    {
      id: 2,
      title: 'Class Representative',
      description: 'Election for class representative',
      status: 'upcoming',
      startDate: '2024-03-20',
      endDate: '2024-03-25',
      totalVotes: 0,
      candidates: [
        { id: 1, name: 'Mike Johnson', votes: 0 },
        { id: 2, name: 'Sarah Wilson', votes: 0 },
      ],
    },
    {
      id: 3,
      title: 'Sports Committee',
      description: 'Selection of sports committee members',
      status: 'completed',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      totalVotes: 320,
      candidates: [
        { id: 1, name: 'Alex Brown', votes: 150 },
        { id: 2, name: 'Emma Davis', votes: 170 },
      ],
    },
  ];

  const handleCreatePoll = () => {
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditPoll = (poll) => {
    setSelectedPoll(poll);
    setIsEditing(true);
    setShowModal(true);
    
    // Populate poll form with existing poll data
    setPollForm({
      title: poll.title,
      description: poll.description,
      startDate: poll.startDate,
      endDate: poll.endDate,
      candidates: poll.candidates || [],
      settings: {
        allowMultipleVotes: poll.settings?.allowMultipleVotes || false,
        showResultsBeforeEnd: poll.settings?.showResultsBeforeEnd || false,
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
    startDate: '',
    endDate: '',
    settings: {
      allowMultipleVotes: false,
      showResultsBeforeEnd: false,
      requireAuthentication: false,
      enableComments: false
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

  const handleSettingsChange = (setting) => {
    setPollForm(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: !prev.settings[setting]
      }
    }));
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

    // Validate required fields
    if (!pollForm.title || !pollForm.description || !pollForm.startDate || !pollForm.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate dates
    const startDate = new Date(pollForm.startDate);
    const endDate = new Date(pollForm.endDate);
    if (startDate >= endDate) {
      alert('End date must be after start date');
      return;
    }

    // Validate candidates
    if (pollForm.candidates.length < 2) {
      alert('Please add at least 2 candidates');
      return;
    }

    try {
      if (isEditing && selectedPoll) {
        // Update existing poll
        await axios.put(`/api/polls/${selectedPoll.id}`, pollForm);
        setPolls(polls.map(p => p.id === selectedPoll.id ? { ...pollForm, id: selectedPoll.id } : p));
        alert('Poll updated successfully');
      } else {
        // Create new poll
        const response = await axios.post('/api/polls', pollForm);
        setPolls([...polls, response.data]);
        alert('Poll created successfully');
      }

      // Reset form and close modal
      setShowModal(false);
      setIsEditing(false);
      setSelectedPoll(null);
      setPollForm({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        settings: {
          allowMultipleVotes: false,
          showResultsBeforeEnd: false,
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
      alert('Failed to save poll');
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
    if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/polls/${poll.id}`);
        setPolls(polls.filter(p => p.id !== poll.id));
        alert('Poll deleted successfully');
      } catch (error) {
        console.error('Error deleting poll:', error);
        alert('Failed to delete poll');
      }
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
          className={`h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            isDarkMode
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
            className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
              isDarkMode
                ? 'bg-[#15191e] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-white'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
            }`}
          />
          <svg
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
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

      {/* Polls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {filteredPolls.map((poll) => (
          <div
            key={poll.id}
            className={`group relative flex flex-col gap-4 p-6 rounded-xl transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-[#2c353f] to-[#1f2937] hover:from-[#353f4a] hover:to-[#2d3748] shadow-lg shadow-black/20' 
                : 'bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 shadow-md shadow-gray-200/50'
            }`}
          >
            {/* Status Badge */}
            <div className="absolute -top-2 right-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                  poll.status === 'active'
                    ? isDarkMode
                      ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30'
                      : 'bg-green-50 text-green-700 ring-1 ring-green-200'
                    : poll.status === 'upcoming'
                    ? isDarkMode
                      ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30'
                      : 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                    : isDarkMode
                    ? 'bg-gray-500/20 text-gray-400 ring-1 ring-gray-500/30'
                    : 'bg-gray-50 text-gray-700 ring-1 ring-gray-200'
                }`}
              >
                {poll.status}
              </span>
            </div>

            {/* Header */}
            <div className="flex-1">
              <h3 className={`text-lg font-medium mb-2 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {poll.title}
              </h3>
              <p className={`text-sm line-clamp-2 ${isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}`}>
                {poll.description}
              </p>
            </div>

            {/* Progress */}
            {poll.status === 'active' && (
              <div className="w-full">
                <div className="flex justify-between text-xs mb-2">
                  <span className={isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}>
                    {poll.totalVotes} votes
                  </span>
                  <span className={isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}>
                    {Math.round((poll.totalVotes / 1000) * 100)}%
                  </span>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#3f4c5a]' : 'bg-gray-100'}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-400' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-500'
                    }`}
                    style={{ width: `${Math.min((poll.totalVotes / 1000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Poll Info */}
            <div className="flex flex-col gap-3">
              <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}`}>
                <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-[#3f4c5a]/50' : 'bg-gray-100'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex items-center gap-1">
                  <span>{poll.startDate}</span>
                  <span className="mx-1 text-xs">→</span>
                  <span>{poll.endDate}</span>
                </div>
              </div>
              <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'}`}>
                <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-[#3f4c5a]/50' : 'bg-gray-100'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span>{poll.totalVotes} participants</span>
              </div>
            </div>

            {/* Candidates Preview */}
            {poll.candidates && poll.candidates.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {poll.candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-[#3f4c5a]/50 hover:bg-[#3f4c5a]' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      candidate.votes > 0 
                        ? isDarkMode ? 'bg-green-400' : 'bg-green-500'
                        : isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                    }`} />
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      {candidate.name}
                    </span>
                    {candidate.votes > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                        isDarkMode 
                          ? 'bg-[#3f4c5a] text-[#a0acbb]' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {candidate.votes}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-[#3f4c5a]">
              <button
                onClick={() => handleEditPoll(poll)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeletePoll(poll)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                    : 'bg-red-50 hover:bg-red-100 text-red-600'
                }`}
              >
                Delete
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between items-center text-xs">
              <button
                className={`flex items-center gap-1.5 transition-colors duration-200 ${
                  isDarkMode
                    ? 'text-[#a0acbb] hover:text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Results
              </button>
              <button
                className={`flex items-center gap-1.5 transition-colors duration-200 ${
                  isDarkMode
                    ? 'text-[#a0acbb] hover:text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Poll Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => {
              setShowModal(false);
              setSelectedPoll(null);
            }} />
            
            <div className={`relative w-full max-w-5xl rounded-2xl shadow-2xl transition-all transform ${
              isDarkMode ? 'bg-[#1a1f2e]' : 'bg-white'
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
                      startDate: '',
                      endDate: '',
                      settings: {
                        allowMultipleVotes: false,
                        showResultsBeforeEnd: false,
                        requireAuthentication: false,
                        enableComments: false,
                        showVoterNames: false,
                        notifyOnVote: false,
                        notifyOnEnd: false
                      },
                      candidates: []
                    });
                  }}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-white/10'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {/* Poll Info Section */}
                <div className={`p-6 rounded-xl border ${isDarkMode ? 'border-[#3f4c5a] bg-[#2c353f]' : 'border-gray-200 bg-white'}`}>
                  <h4 className={`text-lg font-medium mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Poll Information
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div>
                        <h5 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Basic Information
                        </h5>
                        <div className="space-y-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={pollForm.title}
                              onChange={handlePollFormChange}
                              placeholder="Enter poll title"
                              required
                              maxLength={100}
                              className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                                isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                              }`}
                            />
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {pollForm.title.length}/100 characters
                            </p>
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Description
                            </label>
                            <textarea
                              name="description"
                              value={pollForm.description}
                              onChange={handlePollFormChange}
                              placeholder="Enter poll description"
                              rows="3"
                              maxLength={500}
                              className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 resize-none ${
                                isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                              }`}
                            />
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {pollForm.description.length}/500 characters
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Date Range
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="datetime-local"
                              name="startDate"
                              value={pollForm.startDate}
                              onChange={handlePollFormChange}
                              min={new Date().toISOString().slice(0, 16)}
                              required
                              className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                                isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              End Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="datetime-local"
                              name="endDate"
                              value={pollForm.endDate}
                              onChange={handlePollFormChange}
                              min={pollForm.startDate || new Date().toISOString().slice(0, 16)}
                              required
                              className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                                isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div>
                        <h5 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Poll Features
                        </h5>
                        <div className="space-y-4">
                          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-[#3f4c5a] bg-[#1f2937]' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                                <svg className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <h6 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Real-time Results
                                </h6>
                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  View voting results as they come in
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-[#3f4c5a] bg-[#1f2937]' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                                <svg className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <h6 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Time Limit
                                </h6>
                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Poll automatically ends at specified time
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-[#3f4c5a] bg-[#1f2937]' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                                <svg className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </div>
                              <div>
                                <h6 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Voter Management
                                </h6>
                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Track and manage voter participation
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-[#3f4c5a] bg-[#1f2937]' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                                <svg className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </div>
                              <div>
                                <h6 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Comments & Feedback
                                </h6>
                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Allow voters to share their thoughts
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Poll Settings Section */}
                <div className={`p-6 rounded-xl border mt-6 ${isDarkMode ? 'border-[#3f4c5a] bg-[#2c353f]' : 'border-gray-200 bg-white'}`}>
                  <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Poll Settings
                  </h4>
                  <div className="space-y-6">
                    {/* Voting Settings */}
                    <div>
                      <h5 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Voting Settings
                      </h5>
                      <div className="space-y-4">
                        <label className={`flex items-start gap-3 p-4 rounded-lg border transition-colors duration-200 cursor-pointer ${
                          isDarkMode
                            ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                            : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                        }`}>
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              name="allowMultipleVotes"
                              checked={pollForm.settings.allowMultipleVotes}
                              onChange={() => handleSettingsChange('allowMultipleVotes')}
                              className={`w-4 h-4 rounded border transition-colors duration-200 ${
                                isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                  : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <span className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Allow Multiple Votes
                            </span>
                            <span className={`block text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Voters can cast multiple votes for different candidates
                            </span>
                          </div>
                        </label>

                        <label className={`flex items-start gap-3 p-4 rounded-lg border transition-colors duration-200 cursor-pointer ${
                          isDarkMode
                            ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                            : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                        }`}>
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              name="showResultsBeforeEnd"
                              checked={pollForm.settings.showResultsBeforeEnd}
                              onChange={() => handleSettingsChange('showResultsBeforeEnd')}
                              className={`w-4 h-4 rounded border transition-colors duration-200 ${
                                isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                  : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <span className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Show Results Before End
                            </span>
                            <span className={`block text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Display real-time results while the poll is active
                            </span>
                          </div>
                        </label>

                        <label className={`flex items-start gap-3 p-4 rounded-lg border transition-colors duration-200 cursor-pointer ${
                          isDarkMode
                            ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                            : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                        }`}>
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              name="requireAuthentication"
                              checked={pollForm.settings.requireAuthentication}
                              onChange={() => handleSettingsChange('requireAuthentication')}
                              className={`w-4 h-4 rounded border transition-colors duration-200 ${
                                isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                  : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <span className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Require Authentication
                            </span>
                            <span className={`block text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Voters must be logged in to participate
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div>
                      <h5 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Privacy Settings
                      </h5>
                      <div className="space-y-4">
                        <label className={`flex items-start gap-3 p-4 rounded-lg border transition-colors duration-200 cursor-pointer ${
                          isDarkMode
                            ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                            : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                        }`}>
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              name="enableComments"
                              checked={pollForm.settings.enableComments}
                              onChange={() => handleSettingsChange('enableComments')}
                              className={`w-4 h-4 rounded border transition-colors duration-200 ${
                                isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                  : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <span className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Enable Comments
                            </span>
                            <span className={`block text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Allow voters to leave comments on the poll
                            </span>
                          </div>
                        </label>

                        <label className={`flex items-start gap-3 p-4 rounded-lg border transition-colors duration-200 cursor-pointer ${
                          isDarkMode
                            ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                            : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                        }`}>
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              name="showVoterNames"
                              checked={pollForm.settings.showVoterNames}
                              onChange={handleSettingsChange}
                              className={`w-4 h-4 rounded border transition-colors duration-200 ${
                                isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                  : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <span className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Show Voter Names
                            </span>
                            <span className={`block text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Display names of voters in the results
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div>
                      <h5 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Notification Settings
                      </h5>
                      <div className="space-y-4">
                        <label className={`flex items-start gap-3 p-4 rounded-lg border transition-colors duration-200 cursor-pointer ${
                          isDarkMode
                            ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                            : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                        }`}>
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              name="notifyOnVote"
                              checked={pollForm.settings.notifyOnVote}
                              onChange={handleSettingsChange}
                              className={`w-4 h-4 rounded border transition-colors duration-200 ${
                                isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                  : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <span className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Notify on New Votes
                            </span>
                            <span className={`block text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Receive notifications when new votes are cast
                            </span>
                          </div>
                        </label>

                        <label className={`flex items-start gap-3 p-4 rounded-lg border transition-colors duration-200 cursor-pointer ${
                          isDarkMode
                            ? 'border-[#3f4c5a] hover:border-blue-500/50 hover:bg-blue-500/5'
                            : 'border-gray-200 hover:border-blue-500/50 hover:bg-blue-50'
                        }`}>
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              name="notifyOnEnd"
                              checked={pollForm.settings.notifyOnEnd}
                              onChange={handleSettingsChange}
                              className={`w-4 h-4 rounded border transition-colors duration-200 ${
                                isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-blue-500 focus:ring-blue-500'
                                  : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <span className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Notify on Poll End
                            </span>
                            <span className={`block text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Receive notification when the poll ends
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Candidates Section */}
                <div className={`p-6 border-t ${isDarkMode ? 'border-[#3f4c5a] bg-[#1f2937]' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {editingCandidateId ? 'Edit Candidate' : 'Candidates'}
                      </h4>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {editingCandidateId ? 'Update candidate information' : 'Add and manage poll candidates'}
                      </p>
                    </div>
                    {!editingCandidateId && (
                      <button
                        type="button"
                        onClick={addCandidate}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                          isDarkMode
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Candidate
                      </button>
                    )}
                  </div>

                  {/* Candidate Form */}
                  <div className={`p-6 rounded-xl border mb-6 ${isDarkMode ? 'border-[#3f4c5a] bg-[#2c353f]' : 'border-gray-200 bg-white'}`}>
                    <h5 className={`text-base font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {editingCandidateId ? 'Edit Candidate Details' : 'Add New Candidate'}
                    </h5>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={candidateForm.name}
                            onChange={handleCandidateFormChange}
                            placeholder="Enter candidate name"
                            required
                            className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                              isDarkMode
                                ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Party/Affiliation
                          </label>
                          <input
                            type="text"
                            name="party"
                            value={candidateForm.party}
                            onChange={handleCandidateFormChange}
                            placeholder="Enter party or affiliation"
                            className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                              isDarkMode
                                ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={candidateForm.description}
                          onChange={handleCandidateFormChange}
                          placeholder="Enter candidate description"
                          rows="2"
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 resize-none ${
                            isDarkMode
                              ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Website
                          </label>
                          <input
                            type="url"
                            name="website"
                            value={candidateForm.website}
                            onChange={handleCandidateFormChange}
                            placeholder="https://example.com"
                            className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                              isDarkMode
                                ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Social Media
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              name="socialMedia.twitter"
                              value={candidateForm.socialMedia.twitter}
                              onChange={handleCandidateFormChange}
                              placeholder="Twitter handle"
                              className={`flex-1 px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                                isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                              }`}
                            />
                            <input
                              type="text"
                              name="socialMedia.instagram"
                              value={candidateForm.socialMedia.instagram}
                              onChange={handleCandidateFormChange}
                              placeholder="Instagram handle"
                              className={`flex-1 px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                                isDarkMode
                                  ? 'bg-[#1f2937] border-[#3f4c5a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Profile Image
                        </label>
                        <div className={`flex items-center gap-4 p-4 rounded-lg border-2 border-dashed ${
                          isDarkMode ? 'border-[#3f4c5a] bg-[#1f2937]' : 'border-gray-200 bg-white'
                        }`}>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            isDarkMode ? 'bg-[#2c353f]' : 'bg-gray-100'
                          }`}>
                            {candidateForm.image ? (
                              <img
                                src={URL.createObjectURL(candidateForm.image)}
                                alt="Candidate"
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <svg className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Upload candidate photo
                            </p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              PNG, JPG or GIF (max. 2MB)
                            </p>
                          </div>
                          <label className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                            isDarkMode
                              ? 'bg-blue-500 hover:bg-blue-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}>
                            Browse
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                      {editingCandidateId && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            isDarkMode
                              ? 'text-gray-300 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={editingCandidateId ? handleUpdateCandidate : addCandidate}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          isDarkMode
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {editingCandidateId ? 'Save Changes' : 'Add Candidate'}
                      </button>
                    </div>
                  </div>

                  {/* Existing Candidates List */}
                  <div className="space-y-4">
                    {pollForm.candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className={`p-4 rounded-xl border ${
                          isDarkMode ? 'bg-[#1f2937] border-[#3f4c5a]' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className={`text-lg font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {candidate.name}
                              </h4>
                              {candidate.party && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                  isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {candidate.party}
                                </span>
                              )}
                            </div>
                            {candidate.description && (
                              <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {candidate.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-3 mt-2">
                              {candidate.website && (
                                <a
                                  href={candidate.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-sm flex items-center gap-1 ${
                                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                                  }`}
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
                                  className={`text-sm flex items-center gap-1 ${
                                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                                  }`}
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
                                  className={`text-sm flex items-center gap-1 ${
                                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                                  }`}
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                                  </svg>
                                  @{candidate.socialMedia.instagram}
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditCandidate(candidate)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                isDarkMode
                                  ? 'text-gray-400 hover:text-white hover:bg-white/10'
                                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                              }`}
                              title="Edit Candidate"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => removeCandidate(candidate.id)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                isDarkMode
                                  ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                                  : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                              }`}
                              title="Remove Candidate"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={`sticky bottom-0 left-0 right-0 flex items-center justify-end gap-4 p-6 border-t ${
                  isDarkMode ? 'bg-[#1f2937] border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setIsEditing(false);
                      setSelectedPoll(null);
                      setPollForm({
                        title: '',
                        description: '',
                        startDate: '',
                        endDate: '',
                        settings: {
                          allowMultipleVotes: false,
                          showResultsBeforeEnd: false,
                          requireAuthentication: false,
                          enableComments: false,
                          showVoterNames: false,
                          notifyOnVote: false,
                          notifyOnEnd: false
                        },
                        candidates: []
                      });
                    }}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                      isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                      isDarkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isEditing ? 'Save Changes' : 'Create Poll'}
                  </button>
                </div>
              </form>
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPoll(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
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
    </div>
  );
};

export default PollsPage; 