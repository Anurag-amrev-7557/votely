import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useNominations from '../hooks/useNominations';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NominationPage = () => {
    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState('');
    const [sop, setSop] = useState('');
    const { applyForNomination, loading } = useNominations();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch upcoming polls
        const fetchPolls = async () => {
            try {
                const res = await axios.get('/api/polls?status=upcoming');
                setPolls(res.data.polls || []);
            } catch (err) {
                console.error("Failed to fetch polls");
            }
        };
        fetchPolls();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPoll || !sop) return;

        try {
            await applyForNomination({ pollId: selectedPoll, sop });
            navigate('/profile'); // Redirect to profile or success page
        } catch (err) {
            // Error handled in hook
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Nomination Application</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Apply for a position in the upcoming Alumni Association elections.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Select Election/Position
                        </label>
                        <select
                            value={selectedPoll}
                            onChange={(e) => setSelectedPoll(e.target.value)}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 p-3"
                            required
                        >
                            <option value="">-- Select a Position --</option>
                            {polls.map((poll) => (
                                <option key={poll._id} value={poll._id}>
                                    {poll.title}
                                </option>
                            ))}
                        </select>
                        {polls.length === 0 && (
                            <p className="text-sm text-yellow-500 mt-2">No upcoming elections available for nomination.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Statement of Purpose (SOP)
                        </label>
                        <textarea
                            value={sop}
                            onChange={(e) => setSop(e.target.value)}
                            rows={6}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 p-3"
                            placeholder="Why are you the best candidate for this position? (Max 2000 chars)"
                            maxLength={2000}
                            required
                        />
                        <p className="text-xs text-gray-500 text-right mt-1">{sop.length}/2000</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !selectedPoll || !sop}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${loading || !selectedPoll || !sop
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                            }`}
                    >
                        {loading ? 'Submitting...' : 'Submit Nomination'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default NominationPage;
