import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import adminAxios from '../../utils/api/adminAxios';
import { toast } from '../../utils/toastUtils';
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Calendar,
  Clock,
  Users,
  BarChart2,
  Trash2,
  Edit2,
  Copy,
  Share2,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Lock,
  GripVertical,
  Image,
  Link2,
  MessageSquare,
  Quote,
  ExternalLink,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Globe,
  Bell,
  Download,
  RefreshCw,
  Activity,
  Eye,
  Vote,
  UserPlus,
  LogIn,
  Settings2,
  ClipboardList,
  LayoutGrid, // Added
  List // Added
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { Canvas } from '@react-three/fiber';
import ParticleSystem from '../../components/visuals/ParticleSystem';
import { CustomDropdown } from '../../components/ui/CustomDropdown';
import { AnimatedModal } from '../../components/ui/AnimatedModal';
import { CustomDateTimePicker } from '../../components/ui/CustomDateTimePicker';
import { StepIndicator } from '../../components/ui/StepIndicator';

// --- VISUAL UTILITIES (Exact match from AdminDashboard) ---
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

// --- HELPER FUNCTIONS ---
function getTimeRemaining(endDate) {
  const total = Date.parse(endDate) - Date.parse(new Date());
  if (total <= 0) return 'Ended';
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days}d left`;
  if (hours > 0) return `${hours}h left`;
  return `${minutes}m left`;
}

function toDatetimeLocal(dt) {
  if (!dt) return '';
  const date = new Date(dt);
  const pad = n => n < 10 ? '0' + n : n;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const PollsPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // --- STATE ---
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [page, setPage] = useState(1);
  const POLLS_PER_PAGE = 9;

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Audit Log States
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState(null);
  const [auditPollTitle, setAuditPollTitle] = useState('');
  const [auditPollId, setAuditPollId] = useState(null);

  // Enhanced Audit Modal States
  const [auditSearch, setAuditSearch] = useState('');
  const [auditTypeFilter, setAuditTypeFilter] = useState('all');
  const [auditDateFilter, setAuditDateFilter] = useState('all');
  const [auditExpandedIds, setAuditExpandedIds] = useState(new Set());
  const [auditPage, setAuditPage] = useState(1);
  const AUDIT_PAGE_SIZE = 10;

  // Form States
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
    description: '', // Short tagline/bio
    sop: '', // Statement of Purpose / Manifesto
    motto: '',
    website: '',
    socialMedia: { twitter: '', instagram: '', facebook: '', linkedin: '' },
    image: null, // Primary photo URL
    additionalPhotos: [], // Array of URLs
    links: [{ label: '', url: '' }], // Custom links
  });

  // Candidate editing state
  const [editingCandidateId, setEditingCandidateId] = useState(null);

  // Collapsible sections state for candidate form
  const [expandedSections, setExpandedSections] = useState({
    profile: true, // Always start expanded
    socials: false,
    media: false
  });

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Drag and drop photo state
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);

  // Handle photo drop
  const handlePhotoDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhoto(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        // Convert to base64 data URL for preview
        const reader = new FileReader();
        reader.onload = (event) => {
          setCandidateForm(prev => ({ ...prev, image: event.target.result }));
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please drop an image file');
      }
    }
  };

  const handlePhotoDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhoto(true);
  };

  const handlePhotoDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhoto(false);
  };

  // Handle file input change
  const handlePhotoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCandidateForm(prev => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear photo
  const clearPhoto = () => {
    setCandidateForm(prev => ({ ...prev, image: null }));
  };

  // --- DATA FETCHING ---
  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const response = await adminAxios.get('/polls');
      const pollsData = response.data.polls || response.data;
      const normalizedPolls = pollsData.map(poll => ({
        ...poll,
        id: poll._id || poll.id
      }));
      setPolls(normalizedPolls);
      setError(null);
    } catch (err) {
      setError('Failed to load polls');
      toast.error('Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleCreatePoll = () => {
    setIsEditing(false);
    setSelectedPoll(null);
    setCurrentStep(0);
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
    setShowModal(true);
  };

  const handleEditPoll = (poll) => {
    const normalizedPoll = { ...poll, id: poll._id || poll.id };
    setSelectedPoll(normalizedPoll);
    setIsEditing(true);
    setCurrentStep(0);

    const candidates = (poll.options || []).map((option, index) => ({
      id: index,
      name: option.text,
      description: option.description || '',
      party: option.party || '',
      image: option.image || null
    }));

    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const pad = n => String(n).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

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

    setShowModal(true);
  };

  const handleDeletePoll = async (poll) => {
    if (!poll.id) return;
    if (!window.confirm(`Are you sure you want to delete "${poll.title}"?`)) return;

    try {
      await adminAxios.delete(`/polls/${poll.id}`);
      setPolls(polls.filter(p => p.id !== poll.id));
      toast.success('Poll deleted successfully');
    } catch (error) {
      toast.error('Failed to delete poll');
    }
  };

  const handleDuplicatePoll = (poll) => {
    setIsEditing(false);
    setSelectedPoll(null);
    setPollForm({
      ...poll,
      title: poll.title + ' (Copy)',
      startDate: '',
      endDate: '',
      resultDate: '',
      id: undefined, // Explicitly clear ID
      _id: undefined, // Explicitly clear _id
      createdAt: undefined,
      updatedAt: undefined,
      __v: undefined,
      participantCount: 0,
      candidates: poll.options ? poll.options.map((opt, i) => ({
        id: i, // Reset candidate IDs to index
        name: opt.text,
        description: opt.description,
        party: opt.party,
        image: typeof opt.image === 'string' && opt.image ? opt.image : undefined,
        sop: opt.sop,
        motto: opt.motto,
        website: opt.website,
        socialMedia: opt.socialMedia,
        additionalPhotos: opt.additionalPhotos,
        links: opt.links
      })) : [],
      settings: { ...poll.settings },
      totalVotes: 0,
    });
    setShowModal(true);
  };

  const handleViewAuditLog = async (poll) => {
    setShowAuditModal(true);
    setAuditLogs([]);
    setAuditLoading(true);
    setAuditError(null);
    setAuditPollTitle(poll.title);
    setAuditPollId(poll.id);
    // Reset filter states
    setAuditSearch('');
    setAuditTypeFilter('all');
    setAuditDateFilter('all');
    setAuditExpandedIds(new Set());
    setAuditPage(1);
    try {
      const res = await adminAxios.get(`/polls/${poll.id}/audit-logs`);
      setAuditLogs(res.data);
    } catch (err) {
      setAuditError('Failed to load audit logs');
    } finally {
      setAuditLoading(false);
    }
  };

  // Refresh audit logs
  const handleRefreshAuditLogs = async () => {
    if (!auditPollId) return;
    setAuditLoading(true);
    setAuditError(null);
    try {
      const res = await adminAxios.get(`/polls/${auditPollId}/audit-logs`);
      setAuditLogs(res.data);
      toast.success('Audit logs refreshed');
    } catch (err) {
      setAuditError('Failed to refresh audit logs');
    } finally {
      setAuditLoading(false);
    }
  };

  // Toggle expanded state for audit log entry
  const toggleAuditExpanded = (logId) => {
    setAuditExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  // Get icon for audit action type
  const getAuditTypeIcon = (type) => {
    switch (type) {
      case 'Voted': return <CheckCircle className="w-4 h-4" />;
      case 'Created': return <Plus className="w-4 h-4" />;
      case 'Commented': return <MessageSquare className="w-4 h-4" />;
      case 'Shared': return <Share2 className="w-4 h-4" />;
      case 'Login': return <LogIn className="w-4 h-4" />;
      case 'Profile_Update': return <Settings2 className="w-4 h-4" />;
      case 'Vote_View': return <Eye className="w-4 h-4" />;
      case 'Vote_View_Batch': return <ClipboardList className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Get color class for impact level
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      default: return 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-zinc-700';
    }
  };

  // Format relative time
  const formatRelativeTime = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  // Filter and paginate audit logs
  const getFilteredAuditLogs = () => {
    let filtered = [...auditLogs];

    // Search filter
    if (auditSearch.trim()) {
      const searchLower = auditSearch.toLowerCase();
      filtered = filtered.filter(log =>
        (log.user?.name || '').toLowerCase().includes(searchLower) ||
        (log.user?.email || '').toLowerCase().includes(searchLower) ||
        (log.description || '').toLowerCase().includes(searchLower) ||
        (log.action || '').toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (auditTypeFilter !== 'all') {
      filtered = filtered.filter(log => log.type === auditTypeFilter);
    }

    // Date filter
    if (auditDateFilter !== 'all') {
      const now = new Date();
      let startDate;
      switch (auditDateFilter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = null;
      }
      if (startDate) {
        filtered = filtered.filter(log => new Date(log.timestamp) >= startDate);
      }
    }

    return filtered;
  };

  // Export audit logs to CSV with enhanced details
  const handleExportCSV = () => {
    const filtered = getFilteredAuditLogs();
    if (filtered.length === 0) {
      toast.error('No logs to export');
      return;
    }

    // Enhanced headers with more columns
    const headers = [
      'Timestamp (ISO)',
      'Timestamp (Local)',
      'User Name',
      'User Email',
      'User ID',
      'Event Type',
      'Action',
      'Option Selected',
      'Description',
      'Impact Level',
      'Category',
      'Poll Title',
      'Metadata'
    ];

    const rows = filtered.map(log => [
      new Date(log.timestamp).toISOString(),
      new Date(log.timestamp).toLocaleString(),
      log.user?.name || 'Unknown',
      log.user?.email || '',
      log.user?._id || '',
      log.type || '',
      log.action || '',
      log.option || '',
      (log.description || '').replace(/"/g, '""').replace(/\n/g, ' '),
      log.impact || 'medium',
      log.category || 'General',
      log.metadata?.pollTitle || auditPollTitle || '',
      log.meta ? JSON.stringify(log.meta).replace(/"/g, '""') : ''
    ]);

    // Build CSV with report header
    const reportHeader = [
      `"Audit Trail Report"`,
      `"Poll: ${auditPollTitle}"`,
      `"Generated: ${new Date().toLocaleString()}"`,
      `"Total Events: ${filtered.length}"`,
      `"Filters Applied: Type=${auditTypeFilter}, Date=${auditDateFilter}${auditSearch ? ', Search=' + auditSearch : ''}"`,
      `""` // Empty row before data
    ];

    const csvContent = [
      ...reportHeader,
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const safePollTitle = auditPollTitle.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30);
    link.download = `audit-report-${safePollTitle}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success(`Exported ${filtered.length} audit events`);
  };

  const handlePollFormChange = (e) => {
    const { name, value } = e.target;
    setPollForm(prev => ({ ...prev, [name]: value }));
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
        socialMedia: { ...prev.socialMedia, [platform]: value }
      }));
    } else {
      setCandidateForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle custom links array
  const handleLinkChange = (index, field, value) => {
    setCandidateForm(prev => {
      const newLinks = [...prev.links];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, links: newLinks };
    });
  };

  const addLinkRow = () => {
    setCandidateForm(prev => ({
      ...prev,
      links: [...prev.links, { label: '', url: '' }]
    }));
  };

  const removeLinkRow = (index) => {
    setCandidateForm(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  // Handle additional photos
  const addAdditionalPhoto = (url) => {
    if (!url) return;
    setCandidateForm(prev => ({
      ...prev,
      additionalPhotos: [...prev.additionalPhotos, url]
    }));
  };

  const removeAdditionalPhoto = (index) => {
    setCandidateForm(prev => ({
      ...prev,
      additionalPhotos: prev.additionalPhotos.filter((_, i) => i !== index)
    }));
  };

  // Reset candidate form to initial state
  const resetCandidateForm = () => {
    setCandidateForm({
      name: '',
      party: '',
      description: '',
      sop: '',
      motto: '',
      website: '',
      socialMedia: { twitter: '', instagram: '', facebook: '', linkedin: '' },
      image: null,
      additionalPhotos: [],
      links: [{ label: '', url: '' }],
    });
    setEditingCandidateId(null);
  };

  const addCandidate = () => {
    if (!candidateForm.name) {
      toast.error('Candidate name is required');
      return;
    }

    if (editingCandidateId !== null) {
      // Update existing candidate
      setPollForm(prev => ({
        ...prev,
        candidates: prev.candidates.map(c =>
          c.id === editingCandidateId ? { ...candidateForm, id: editingCandidateId } : c
        )
      }));
      toast.success('Candidate updated');
    } else {
      // Add new candidate
      const newCandidate = { ...candidateForm, id: Date.now() };
      setPollForm(prev => ({ ...prev, candidates: [...prev.candidates, newCandidate] }));
      toast.success('Candidate added');
    }
    resetCandidateForm();
  };

  const editCandidate = (candidate) => {
    setCandidateForm({
      name: candidate.name || '',
      party: candidate.party || '',
      description: candidate.description || '',
      sop: candidate.sop || '',
      motto: candidate.motto || '',
      website: candidate.website || '',
      socialMedia: candidate.socialMedia || { twitter: '', instagram: '', facebook: '', linkedin: '' },
      image: candidate.image || null,
      additionalPhotos: candidate.additionalPhotos || [],
      links: candidate.links?.length ? candidate.links : [{ label: '', url: '' }],
    });
    setEditingCandidateId(candidate.id);
    // Scroll to form
    document.getElementById('candidate-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const removeCandidate = (id) => {
    setPollForm(prev => ({ ...prev, candidates: prev.candidates.filter(c => c.id !== id) }));
    // If we were editing this candidate, reset form
    if (editingCandidateId === id) {
      resetCandidateForm();
    }
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setPollForm(prev => {
        const oldIndex = prev.candidates.findIndex(c => c.id === active.id);
        const newIndex = prev.candidates.findIndex(c => c.id === over.id);
        return {
          ...prev,
          candidates: arrayMove(prev.candidates, oldIndex, newIndex)
        };
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!pollForm.title || pollForm.title.trim().length < 3) { toast.error('Title is required (min 3 chars)'); return; }
    if (!pollForm.startDate || !pollForm.endDate) { toast.error('Start and End dates are required'); return; }
    if (new Date(pollForm.endDate) <= new Date(pollForm.startDate)) { toast.error('End date must be after start date'); return; }
    if (pollForm.candidates.length < 2) { toast.error('At least 2 candidates are required'); return; }
    if (!pollForm.category) { toast.error('Category is required'); return; }

    const options = pollForm.candidates.map(c => ({
      text: c.name,
      description: c.description,
      party: c.party,
      image: typeof c.image === 'string' && c.image ? c.image : undefined,
      sop: c.sop,
      motto: c.motto,
      website: c.website,
      socialMedia: c.socialMedia,
      additionalPhotos: c.additionalPhotos,
      links: c.links
    }));

    const payload = { ...pollForm, options };
    delete payload.candidates;

    // Strict sanitation for new polls
    if (!isEditing) {
      delete payload.id;
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;
      delete payload.participantCount;
      delete payload.totalVotes;
    }

    try {
      if (isEditing && selectedPoll) {
        const updatePayload = { ...payload, version: selectedPoll.__v };
        await adminAxios.put(`/polls/${selectedPoll.id}`, updatePayload);
        setPolls(polls.map(p => p.id === selectedPoll.id ? { ...p, ...payload, id: selectedPoll.id } : p));
        toast.success('Poll updated successfully');
      } else {
        const response = await adminAxios.post('/polls', payload);
        const newPoll = { ...response.data, id: response.data._id || response.data.id };
        setPolls([...polls, newPoll]);
        toast.success('Poll created successfully');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving poll:', error);
      const errorMsg = error.response?.data?.error ||
        (error.response?.data?.errors ? error.response.data.errors.map(e => e.msg).join(', ') : 'Failed to save poll');
      toast.error(errorMsg);
    }
  };

  const filteredPolls = polls.filter(poll =>
    poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poll.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedPolls = filteredPolls.slice(0, page * POLLS_PER_PAGE);
  const hasMore = paginatedPolls.length < filteredPolls.length;

  return (
    <div className="w-full min-h-screen p-6 md:p-8 pr-0 md:pr-0 space-y-8 animate-fade-in pb-24">
      {/* Header Section - Matches AdminDashboard */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4" role="banner">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600 dark:text-zinc-400 mb-2">
            Election Control
          </h2>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
            Manage <span className="text-gray-600 dark:text-zinc-400">Polls.</span>
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCreatePoll}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold tracking-tight hover:scale-105 transition-transform duration-200 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
            aria-label="Create new poll"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            <span>New Poll</span>
          </button>
        </div>
      </header>

      {/* Toolbar - Minimalist */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-gray-900 dark:group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search polls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-zinc-700 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full shadow-sm">
            <BarChart2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {polls.length} <span className="text-gray-500 font-normal">Polls</span>
            </span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-zinc-800/50 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list'
                ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Polls Grid - Bento/Dashboard Style */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : filteredPolls.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-12 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/20">
          <div className="p-4 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No polls found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            Your search did not match any active polls. Check your query or create a new one.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {paginatedPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onEdit={handleEditPoll}
                onDelete={handleDeletePoll}
                onDuplicate={handleDuplicatePoll}
                onAudit={handleViewAuditLog}
                onViewRatings={(p) => navigate(`/admin/polls/${p.id}/results`)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {paginatedPolls.map((poll) => (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                layout
                className="group relative flex flex-col md:flex-row items-center gap-6 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${new Date(poll.endDate) < new Date() ? 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700' :
                      new Date(poll.startDate) > new Date() ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' :
                        'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                      }`}>
                      {new Date(poll.endDate) < new Date() ? 'Ended' : new Date(poll.startDate) > new Date() ? 'Scheduled' : 'Active'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700">
                      {poll.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
                    {poll.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(poll.startDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {getTimeRemaining(poll.endDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 dark:border-zinc-800 pt-4 md:pt-0 md:pl-6">
                  <div className="text-center min-w-[60px]">
                    <span className="block text-xl font-black text-gray-900 dark:text-white leading-none">{poll.totalVotes || 0}</span>
                    <span className="text-[10px] font-bold uppercase text-gray-400 dark:text-zinc-500">Votes</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin/polls/${poll.id}/results`)}
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      title="View Results"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleViewAuditLog(poll)}
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      title="Audit Log"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditPoll(poll)}
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      title="Edit Poll"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePoll(poll)}
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all"
                      title="Delete Poll"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-8 py-3 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all shadow-sm"
          >
            Load More Polls
          </button>
        </div>
      )}

      {/* Modals - Kept functional but ensured dark mode compatibility */}
      {/* Full Screen Modal */}
      <AnimatedModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="w-[95vw] h-[95vh] rounded-3xl bg-white dark:bg-[#111] border border-gray-200 dark:border-zinc-800 outline-none p-0 shadow-2xl overflow-hidden flex"
      >
        {/* Left Column: Form Wizard */}
        <div className="w-full lg:w-1/2 h-full flex flex-col border-r border-gray-100 dark:border-zinc-800 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-zinc-800 shrink-0">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {isEditing ? 'Configure Poll' : 'Initialize New Poll'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">
                {isEditing ? 'Update parameters and candidates.' : 'Set up the parameters for a new voting event.'}
              </p>
            </div>
            <button onClick={() => setShowModal(false)} className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
              <XCircle className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Stepper */}
          <div className="px-8 py-6 shrink-0">
            <StepIndicator
              steps={['Details', 'Candidates', 'Settings', 'Review']}
              currentStep={currentStep}
            />
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6 pb-8">
              <div className="min-h-[300px]">
                {/* Step 0: Core Details */}
                {currentStep === 0 && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Poll Details</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Poll Title <span className="text-red-500">*</span></label>
                          <input
                            name="title"
                            value={pollForm.title}
                            onChange={handlePollFormChange}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all dark:text-white"
                            placeholder="e.g., Annual General Election"
                          />
                        </div>
                        <div>
                          <CustomDropdown
                            label="Category"
                            value={pollForm.category}
                            onChange={(val) => handlePollFormChange({ target: { name: 'category', value: val } })}
                            placeholder="Select Category"
                            icon={Filter}
                            options={[
                              { value: 'Politics', label: 'Politics', icon: null },
                              { value: 'Technology', label: 'Technology', icon: null },
                              { value: 'Entertainment', label: 'Entertainment', icon: null },
                              { value: 'Sports', label: 'Sports', icon: null },
                              { value: 'Science', label: 'Science', icon: null },
                              { value: 'Other', label: 'Other', icon: null }
                            ]}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Description</label>
                        <textarea
                          name="description"
                          value={pollForm.description}
                          onChange={handlePollFormChange}
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all dark:text-white resize-none"
                          placeholder="Describe the purpose..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div>
                        <CustomDateTimePicker
                          label="Start Date"
                          name="startDate"
                          required
                          value={pollForm.startDate}
                          onChange={handlePollFormChange}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <CustomDateTimePicker
                          label="End Date"
                          name="endDate"
                          required
                          value={pollForm.endDate}
                          onChange={handlePollFormChange}
                          min={pollForm.startDate ? pollForm.startDate.split('T')[0] : new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Candidates */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Manage Candidates</h3>
                      {editingCandidateId && (
                        <button
                          type="button"
                          onClick={resetCandidateForm}
                          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    {/* Add/Edit Candidate Form */}
                    <div id="candidate-form-section" className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-4">
                      {/* Basic Info - Always Visible */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          {/* Photo Drop Zone */}
                          <div className="shrink-0">
                            <div
                              onDrop={handlePhotoDrop}
                              onDragOver={handlePhotoDragOver}
                              onDragLeave={handlePhotoDragLeave}
                              className={`relative w-28 h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all ${isDraggingPhoto
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : candidateForm.image
                                  ? 'border-transparent'
                                  : 'border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600'
                                }`}
                              onClick={() => document.getElementById('photo-file-input')?.click()}
                            >
                              {candidateForm.image ? (
                                <>
                                  <img src={candidateForm.image} alt="Preview" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); clearPhoto(); }}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                                  >
                                    <XCircle className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <Image className={`w-6 h-6 ${isDraggingPhoto ? 'text-blue-500' : 'text-gray-400'}`} />
                                  <span className={`text-[10px] mt-1 ${isDraggingPhoto ? 'text-blue-500' : 'text-gray-400'}`}>
                                    {isDraggingPhoto ? 'Drop here' : 'Drop or click'}
                                  </span>
                                </>
                              )}
                            </div>
                            <input
                              id="photo-file-input"
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoFileChange}
                              className="hidden"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <input
                              name="name"
                              value={candidateForm.name}
                              onChange={handleCandidateFormChange}
                              placeholder="Candidate Name *"
                              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all dark:text-white text-sm"
                            />
                            <input
                              name="party"
                              value={candidateForm.party}
                              onChange={handleCandidateFormChange}
                              placeholder="Party / Affiliation"
                              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all dark:text-white text-sm"
                            />
                            <input
                              name="image"
                              type="text"
                              value={typeof candidateForm.image === 'string' && !candidateForm.image.startsWith('data:') ? candidateForm.image : ''}
                              onChange={handleCandidateFormChange}
                              placeholder="Or paste image URL..."
                              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all dark:text-white text-xs"
                            />
                          </div>
                        </div>
                        <textarea
                          name="description"
                          value={candidateForm.description}
                          onChange={handleCandidateFormChange}
                          placeholder="Short bio / tagline"
                          rows={2}
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all dark:text-white resize-none text-sm"
                        />
                      </div>

                      {/* Section: Public Profile (Collapsible) */}
                      <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
                        <button
                          type="button"
                          onClick={() => toggleSection('profile')}
                          className="flex items-center justify-between w-full text-left group"
                        >
                          <div className="flex items-center gap-2">
                            <Quote className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Public Profile</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.profile ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {expandedSections.profile && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-3 pt-4">
                                <input
                                  name="motto"
                                  value={candidateForm.motto}
                                  onChange={handleCandidateFormChange}
                                  placeholder="Motto / Slogan"
                                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all dark:text-white text-sm"
                                />
                                <textarea
                                  name="sop"
                                  value={candidateForm.sop}
                                  onChange={handleCandidateFormChange}
                                  placeholder="Statement of Purpose / Manifesto..."
                                  rows={4}
                                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all dark:text-white resize-none text-sm"
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Section: Links & Socials (Collapsible) */}
                      <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
                        <button
                          type="button"
                          onClick={() => toggleSection('socials')}
                          className="flex items-center justify-between w-full text-left group"
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Links & Socials</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.socials ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {expandedSections.socials && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-3 pt-4">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                                  <input
                                    name="website"
                                    value={candidateForm.website}
                                    onChange={handleCandidateFormChange}
                                    placeholder="Website URL"
                                    className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all dark:text-white text-sm"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="flex items-center gap-2">
                                    <Twitter className="w-4 h-4 text-gray-400 shrink-0" />
                                    <input
                                      name="socialMedia.twitter"
                                      value={candidateForm.socialMedia.twitter}
                                      onChange={handleCandidateFormChange}
                                      placeholder="@twitter"
                                      className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all dark:text-white text-sm"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Instagram className="w-4 h-4 text-gray-400 shrink-0" />
                                    <input
                                      name="socialMedia.instagram"
                                      value={candidateForm.socialMedia.instagram}
                                      onChange={handleCandidateFormChange}
                                      placeholder="@instagram"
                                      className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all dark:text-white text-sm"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Facebook className="w-4 h-4 text-gray-400 shrink-0" />
                                    <input
                                      name="socialMedia.facebook"
                                      value={candidateForm.socialMedia.facebook}
                                      onChange={handleCandidateFormChange}
                                      placeholder="facebook.com/..."
                                      className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all dark:text-white text-sm"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Linkedin className="w-4 h-4 text-gray-400 shrink-0" />
                                    <input
                                      name="socialMedia.linkedin"
                                      value={candidateForm.socialMedia.linkedin}
                                      onChange={handleCandidateFormChange}
                                      placeholder="linkedin.com/in/..."
                                      className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all dark:text-white text-sm"
                                    />
                                  </div>
                                </div>

                                {/* Custom Links */}
                                <div className="pt-2">
                                  <p className="text-xs font-semibold text-gray-500 mb-2">Custom Links</p>
                                  <div className="space-y-2">
                                    {candidateForm.links.map((link, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <input
                                          value={link.label}
                                          onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                                          placeholder="Label"
                                          className="w-1/3 px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm dark:text-white outline-none"
                                        />
                                        <input
                                          value={link.url}
                                          onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                          placeholder="URL"
                                          className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm dark:text-white outline-none"
                                        />
                                        {candidateForm.links.length > 1 && (
                                          <button type="button" onClick={() => removeLinkRow(index)} className="p-1.5 text-gray-400 hover:text-red-500">
                                            <XCircle className="w-4 h-4" />
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={addLinkRow}
                                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                      <Plus className="w-3 h-3" /> Add Link
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Section: Media Gallery (Collapsible) */}
                      <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
                        <button
                          type="button"
                          onClick={() => toggleSection('media')}
                          className="flex items-center justify-between w-full text-left group"
                        >
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Additional Photos</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.media ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {expandedSections.media && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 space-y-3">
                                <div className="flex gap-2">
                                  <input
                                    id="additional-photo-input"
                                    type="text"
                                    placeholder="Add photo URL..."
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm dark:text-white outline-none"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addAdditionalPhoto(e.target.value);
                                        e.target.value = '';
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const input = document.getElementById('additional-photo-input');
                                      addAdditionalPhoto(input.value);
                                      input.value = '';
                                    }}
                                    className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-zinc-600"
                                  >
                                    Add
                                  </button>
                                </div>
                                {candidateForm.additionalPhotos.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {candidateForm.additionalPhotos.map((url, index) => (
                                      <div key={index} className="relative group">
                                        <img src={url} alt={`Additional ${index + 1}`} className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-zinc-700" />
                                        <button
                                          type="button"
                                          onClick={() => removeAdditionalPhoto(index)}
                                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <XCircle className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Add/Update Button */}
                      <button
                        type="button"
                        onClick={addCandidate}
                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${editingCandidateId
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90'
                          }`}
                      >
                        {editingCandidateId ? (
                          <>
                            <CheckCircle className="w-4 h-4" /> Update Candidate
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" /> Add Candidate
                          </>
                        )}
                      </button>
                    </div>

                    {/* Added Candidates - Sortable List */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                        Added Candidates ({pollForm.candidates.length})
                      </h4>
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={pollForm.candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                            {pollForm.candidates.map((candidate, index) => (
                              <SortableCandidateItem
                                key={candidate.id}
                                candidate={candidate}
                                index={index}
                                onEdit={editCandidate}
                                onRemove={removeCandidate}
                                isEditing={editingCandidateId === candidate.id}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                      {pollForm.candidates.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl">
                          <Users className="w-8 h-8 text-gray-300 dark:text-zinc-700 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No candidates added yet. Add at least 2.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Settings */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Poll Configuration</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { key: 'allowMultipleVotes', label: 'Allow Multiple Votes', icon: Users },
                        { key: 'showResultsBeforeEnd', label: 'Show Results Live', icon: BarChart2 },
                        { key: 'showResultsAfterVote', label: 'Show Results After Voting', icon: CheckCircle },
                        { key: 'requireAuthentication', label: 'Require Authentication', icon: Lock },
                        { key: 'enableComments', label: 'Enable Comments', icon: FileText },
                        { key: 'showVoterNames', label: 'Public Voter Names', icon: Users },
                        { key: 'notifyOnVote', label: 'Notify on Vote', icon: Zap },
                        { key: 'notifyOnEnd', label: 'Notify on End', icon: Bell }
                      ].map((setting) => {
                        const Icon = setting.icon;
                        return (
                          <div key={setting.key}
                            onClick={() => handleSettingsChange(setting.key)}
                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${pollForm.settings[setting.key]
                              ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900'
                              : 'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${pollForm.settings[setting.key] ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-gray-200 dark:bg-zinc-800 text-gray-500'
                                }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className={`text-sm font-medium ${pollForm.settings[setting.key] ? 'text-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                {setting.label}
                              </span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${pollForm.settings[setting.key] ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-zinc-600'
                              }`}>
                              {pollForm.settings[setting.key] && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Review & Submit Details</h3>

                    <div className="space-y-6 p-6 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{pollForm.title}</h4>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                            {pollForm.category}
                          </span>
                        </div>
                        <div className="text-right text-sm text-gray-500 dark:text-zinc-400">
                          <p>Starts: {new Date(pollForm.startDate).toLocaleString()}</p>
                          <p>Ends: {new Date(pollForm.endDate).toLocaleString()}</p>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-zinc-300 text-sm">
                        {pollForm.description || 'No description provided.'}
                      </p>

                      <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
                        <h5 className="text-sm font-bold uppercase text-gray-500 mb-3">Candidates ({pollForm.candidates.length})</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {pollForm.candidates.map(c => (
                            <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700">
                              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-gray-500">
                                {c.name[0]}
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
                        <h5 className="text-sm font-bold uppercase text-gray-500 mb-3">Enabled Settings</h5>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(pollForm.settings)
                            .filter(([_, enabled]) => enabled)
                            .map(([key]) => (
                              <span key={key} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            ))}
                          {Object.values(pollForm.settings).every(v => !v) && (
                            <span className="text-sm text-gray-400 italic">No special settings enabled.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Navigation Footer */}
          <div className="p-6 shrink-0 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#111]">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 0) setShowModal(false);
                  else setCurrentStep(c => c - 1);
                }}
                className="px-6 py-3 rounded-full border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {currentStep === 0 ? 'Cancel' : 'Back'}
              </button>

              <div className="flex gap-3">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      // Validation
                      if (currentStep === 0) {
                        if (!pollForm.title || pollForm.title.trim().length < 3) { toast.error('Title is required (min 3 chars)'); return; }
                        if (!pollForm.category) { toast.error('Category is required'); return; }
                        if (!pollForm.startDate || !pollForm.endDate) { toast.error('Start and End dates are required'); return; }
                        if (new Date(pollForm.endDate) <= new Date(pollForm.startDate)) { toast.error('End date must be after start date'); return; }
                      }
                      if (currentStep === 1) {
                        if (pollForm.candidates.length < 2) { toast.error('At least 2 candidates are required'); return; }
                      }
                      setCurrentStep(c => c + 1);
                    }}
                    className="px-8 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e)} // Pass event manually if button is outside form
                    className="px-8 py-3 rounded-full bg-green-600 text-white font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isEditing ? 'Confirm Update' : 'Publish Poll'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="hidden lg:block lg:w-1/2 h-full relative bg-gray-50 dark:bg-[#111] overflow-hidden border-l border-gray-100 dark:border-zinc-800">
          <div className="absolute top-4 right-4 z-50">
            <button onClick={() => setShowModal(false)} className="p-3 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-full transition-colors backdrop-blur-md">
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full h-full">
            <Canvas
              camera={{ position: [0, 0, 10], fov: 45 }}
              dpr={[1, 2]}
            >
              <color attach="background" args={[isDarkMode ? '#111' : '#f9fafb']} />
              <ambientLight intensity={0.5} />
              <ParticleSystem
                themeColor={isDarkMode ? '#ffffff' : '#111827'}
                isPaused={false}
                xOffset={-3}
                stepIndex={currentStep}
              />
            </Canvas>
          </div>

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/90 via-transparent to-transparent dark:from-black/80 dark:via-transparent dark:to-transparent">
            <div className="absolute bottom-12 left-12 text-gray-900 dark:text-white">
              <h2 className="text-4xl font-bold tracking-tighter mb-2">
                {currentStep === 0 && "Define the Future."}
                {currentStep === 1 && "Choose the Players."}
                {currentStep === 2 && "Set the Rules."}
                {currentStep === 3 && "Final Review."}
              </h2>
              <p className="text-gray-400 max-w-md text-lg">
                {currentStep === 0 && "Start by identifying the core topic and timeline for your upcoming poll."}
                {currentStep === 1 && "Add clear, distinct options for voters to choose from. Authenticity matters."}
                {currentStep === 2 && "Configure privacy, security, and engagement settings to match your needs."}
                {currentStep === 3 && "Ensure accuracy before immutable recording on the ledger."}
              </p>
            </div>
          </div>
        </div>
      </AnimatedModal>

      {/* Enhanced Audit Modal */}
      <AnimatedModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        className="w-[95vw] h-[95vh] overflow-hidden rounded-3xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 outline-none shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-[#0a0a0a]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Audit Trail
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-500 font-medium">
                    {auditPollTitle}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAuditModal(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <XCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          </div>

          {/* Stats Cards */}
          {!auditLoading && auditLogs.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400 mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Events</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                  {auditLogs.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400 mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Unique Users</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                  {new Set(auditLogs.map(l => l.user?._id || l.user?.email).filter(Boolean)).size}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Votes Cast</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                  {auditLogs.filter(l => l.type === 'Voted').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-red-500 dark:text-red-400 mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">High Impact</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                  {auditLogs.filter(l => l.impact === 'high').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Last Activity</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {auditLogs[0] ? formatRelativeTime(auditLogs[0].timestamp) : 'N/A'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="shrink-0 p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user, email, action, description..."
                value={auditSearch}
                onChange={(e) => { setAuditSearch(e.target.value); setAuditPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Type Filter - CustomDropdown */}
            <div className="w-44">
              <CustomDropdown
                value={auditTypeFilter}
                onChange={(val) => { setAuditTypeFilter(val); setAuditPage(1); }}
                placeholder="All Types"
                icon={Filter}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'Voted', label: 'Voted' },
                  { value: 'Created', label: 'Created' },
                  { value: 'Commented', label: 'Commented' },
                  { value: 'Shared', label: 'Shared' },
                  { value: 'Login', label: 'Login' },
                  { value: 'Vote_View', label: 'Vote View' },
                  { value: 'Profile_Update', label: 'Profile Update' }
                ]}
              />
            </div>

            {/* Date Filter - CustomDropdown */}
            <div className="w-40">
              <CustomDropdown
                value={auditDateFilter}
                onChange={(val) => { setAuditDateFilter(val); setAuditPage(1); }}
                placeholder="All Time"
                icon={Calendar}
                options={[
                  { value: 'all', label: 'All Time' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' }
                ]}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleRefreshAuditLogs}
                disabled={auditLoading}
                className="p-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-600 transition-all disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${auditLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleExportCSV}
                disabled={auditLoading || auditLogs.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black font-medium text-sm rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Filter Summary */}
          {(auditSearch || auditTypeFilter !== 'all' || auditDateFilter !== 'all') && (
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-zinc-400">
              <span>Filters:</span>
              {auditSearch && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                  Search: "{auditSearch}"
                </span>
              )}
              {auditTypeFilter !== 'all' && (
                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">
                  Type: {auditTypeFilter}
                </span>
              )}
              {auditDateFilter !== 'all' && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                  Date: {auditDateFilter}
                </span>
              )}
              <button
                onClick={() => { setAuditSearch(''); setAuditTypeFilter('all'); setAuditDateFilter('all'); setAuditPage(1); }}
                className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {auditLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 dark:border-zinc-700"></div>
                <div className="absolute top-0 left-0 animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-4">Loading audit trail...</p>
            </div>
          ) : (() => {
            const filtered = getFilteredAuditLogs();
            const totalPages = Math.ceil(filtered.length / AUDIT_PAGE_SIZE);
            const paginatedLogs = filtered.slice((auditPage - 1) * AUDIT_PAGE_SIZE, auditPage * AUDIT_PAGE_SIZE);

            if (filtered.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 rounded-2xl bg-gray-100 dark:bg-zinc-800 mb-4">
                    <ShieldCheck className="w-10 h-10 text-gray-400 dark:text-zinc-500" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {auditLogs.length === 0 ? 'No Activity Yet' : 'No Matching Results'}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-xs">
                    {auditLogs.length === 0
                      ? 'This poll has no recorded audit events.'
                      : 'Try adjusting your search or filters.'}
                  </p>
                </div>
              );
            }

            return (
              <>
                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 w-10"></th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">User</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Type</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Action</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Impact</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                      {paginatedLogs.map((log, index) => {
                        const logId = log._id || index;
                        const isExpanded = auditExpandedIds.has(logId);

                        return (
                          <React.Fragment key={logId}>
                            <motion.tr
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, delay: index * 0.02 }}
                              onClick={() => toggleAuditExpanded(logId)}
                              className={`cursor-pointer transition-colors ${isExpanded
                                ? 'bg-blue-50/50 dark:bg-blue-900/10'
                                : 'bg-white dark:bg-[#0a0a0a] hover:bg-gray-50 dark:hover:bg-zinc-900'
                                }`}
                            >
                              {/* Expand Icon */}
                              <td className="px-4 py-3">
                                <div className="text-gray-400">
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </div>
                              </td>

                              {/* User */}
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">
                                    {(log.user?.name || log.user?.email || 'U').charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                      {log.user?.name || 'Unknown'}
                                    </p>
                                    <p className="text-[10px] text-gray-500 dark:text-zinc-500 truncate font-mono">
                                      {log.user?.email || '—'}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Type */}
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${log.type === 'Voted' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                    log.type === 'Created' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                      log.type === 'Commented' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                                        log.type === 'Shared' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' :
                                          'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
                                    }`}>
                                    {getAuditTypeIcon(log.type)}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {log.type || '—'}
                                  </span>
                                </div>
                              </td>

                              {/* Action */}
                              <td className="px-4 py-3">
                                <p className="text-sm text-gray-800 dark:text-gray-200">
                                  {log.action || log.type || '—'}
                                </p>
                                {log.option && (
                                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                                    → {log.option}
                                  </p>
                                )}
                              </td>

                              {/* Impact */}
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getImpactColor(log.impact)}`}>
                                  {log.impact || 'medium'}
                                </span>
                              </td>

                              {/* Timestamp */}
                              <td className="px-4 py-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {formatRelativeTime(log.timestamp)}
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono">
                                  {new Date(log.timestamp).toLocaleString()}
                                </p>
                              </td>
                            </motion.tr>

                            {/* Expanded Details Row */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.tr
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <td colSpan={6} className="px-4 py-0 bg-gray-50/50 dark:bg-zinc-900/50">
                                    <motion.div
                                      initial={{ height: 0 }}
                                      animate={{ height: 'auto' }}
                                      exit={{ height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="py-4 px-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {log.description && (
                                          <div className="col-span-2 md:col-span-4">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Description</label>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{log.description}</p>
                                          </div>
                                        )}
                                        {log.category && (
                                          <div>
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Category</label>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{log.category}</p>
                                          </div>
                                        )}
                                        {log.metadata?.pollTitle && (
                                          <div>
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Poll</label>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{log.metadata.pollTitle}</p>
                                          </div>
                                        )}
                                        {log.meta && Object.keys(log.meta).length > 0 && (
                                          <div className="col-span-2 md:col-span-4">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Metadata</label>
                                            <pre className="text-xs text-gray-600 dark:text-gray-400 mt-1 bg-white dark:bg-zinc-800 p-2 rounded-lg overflow-x-auto font-mono border border-gray-100 dark:border-zinc-700">
                                              {JSON.stringify(log.meta, null, 2)}
                                            </pre>
                                          </div>
                                        )}
                                        {!log.description && !log.category && !log.metadata?.pollTitle && (!log.meta || Object.keys(log.meta).length === 0) && (
                                          <p className="text-sm text-gray-400 dark:text-zinc-500 col-span-2 md:col-span-4">No additional details available.</p>
                                        )}
                                      </div>
                                    </motion.div>
                                  </td>
                                </motion.tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                      Showing {((auditPage - 1) * AUDIT_PAGE_SIZE) + 1} – {Math.min(auditPage * AUDIT_PAGE_SIZE, filtered.length)} of {filtered.length} events
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAuditPage(p => Math.max(1, p - 1))}
                        disabled={auditPage === 1}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1.5 text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-700 rounded-lg">
                        {auditPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setAuditPage(p => Math.min(totalPages, p + 1))}
                        disabled={auditPage === totalPages}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </AnimatedModal>
    </div>
  );
};

// --- PollCard Component (Matches DashboardWidget) ---
const PollCard = React.memo(({ poll, onEdit, onDelete, onDuplicate, onAudit, onViewRatings }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const isLive = poll.status === 'Active' || poll.status === 'active';
  const isEnded = poll.status === 'Ended' || poll.status === 'ended';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col justify-between p-6 overflow-hidden bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700/80 hover:border-gray-400 dark:hover:border-zinc-500 ring-1 ring-gray-100 dark:ring-zinc-800 hover:ring-gray-200 dark:hover:ring-zinc-600 transition-all duration-500 rounded-3xl shadow-sm hover:shadow-lg dark:shadow-lg dark:shadow-black/20"
    >
      <NoiseTexture />
      <SpotlightEffect mouseX={mouseX} mouseY={mouseY} />

      <div className="relative z-10 flex flex-col h-full">
        {/* Status & Badge */}
        <div className="flex items-center justify-between mb-6">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isLive
            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-transparent'
            : 'bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            {poll.status}
          </span>
          <span className="text-[10px] font-mono text-gray-400 dark:text-zinc-600 uppercase">
            {poll.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 mb-6">
          <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2 line-clamp-2">
            {poll.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {poll.description || 'No description provided.'}
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-200/50 dark:border-zinc-800/50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 dark:text-zinc-500 uppercase tracking-wider font-bold mb-1">Votes</span>
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-mono font-medium">
              <Users className="w-3 h-3" />
              {poll.totalVotes || 0}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 dark:text-zinc-500 uppercase tracking-wider font-bold mb-1">Time</span>
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-mono font-medium">
              <Clock className="w-3 h-3" />
              {getTimeRemaining(poll.endDate)}
            </div>
          </div>
        </div>

        {/* Actions - Minimalist Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <IconButton icon={Edit2} onClick={() => onEdit(poll)} label="Edit" />
            <IconButton icon={Trash2} onClick={() => onDelete(poll)} label="Delete" danger />
          </div>
          <div className="h-4 w-px bg-gray-300 dark:bg-zinc-700 mx-2" />
          <div className="flex gap-2">
            <IconButton icon={BarChart2} onClick={() => onViewRatings(poll)} label="Results" />
            <IconButton icon={Copy} onClick={() => onDuplicate(poll)} label="Duplicate" />
            <IconButton icon={ShieldCheck} onClick={() => onAudit(poll)} label="Audit" />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// --- SORTABLE CANDIDATE ITEM ---
const SortableCandidateItem = ({ candidate, index, onEdit, onRemove, isEditing }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 rounded-xl bg-white dark:bg-zinc-900/50 border transition-colors ${isEditing
        ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/50'
        : 'border-gray-100 dark:border-zinc-800'
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Order Number */}
        <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-gray-500">
          {index + 1}
        </span>

        {/* Photo */}
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
          {candidate.image ? (
            <img src={candidate.image} alt={candidate.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 font-bold">{candidate.name.charAt(0)}</span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{candidate.name}</p>
          <p className="text-xs text-gray-500 truncate">{candidate.party || 'No affiliation'}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(candidate)}
          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          title="Edit"
          aria-label="Edit candidate"
        >
          <Edit2 className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(candidate.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const IconButton = ({ icon: Icon, onClick, label, danger }) => (
  <button
    onClick={onClick}
    title={label}
    className={`p-2 rounded-xl transition-all duration-200 border ${danger
      ? 'bg-transparent border-transparent hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-red-500'
      : 'bg-white dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700/50 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-600'
      }`}
  >
    <Icon className="w-4 h-4" />
  </button>
);

// --- REUSABLE ANIMATED MODAL ---
// AnimatedModal removed - imported from ../../components/ui/AnimatedModal

export default PollsPage;