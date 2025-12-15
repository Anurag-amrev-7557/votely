import React, { useState, useEffect } from 'react';
import useNominations from '../../hooks/useNominations';
import axios from '../../utils/api/axiosConfig';

const AdminNominations = () => {
    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState('');
    const [nominations, setNominations] = useState([]);
    const { getPollNominations, updateNominationStatus, loading } = useNominations();

    useEffect(() => {
        // Fetch all polls (active/upcoming) for filtering
        const fetchPolls = async () => {
            try {
                const res = await axios.get('/api/polls');
                setPolls(res.data.polls || []);
                if (res.data.polls?.length > 0) {
                    setSelectedPoll(res.data.polls[0]._id);
                }
            } catch (err) {
                console.error("Failed to fetch polls");
            }
        };
        fetchPolls();
    }, []);

    useEffect(() => {
        if (selectedPoll) {
            loadNominations(selectedPoll);
        }
    }, [selectedPoll]);

    const loadNominations = async (pollId) => {
        const data = await getPollNominations(pollId);
        setNominations(data || []);
    };

    const handleAction = async (id, status) => {
        if (window.confirm(`Are you sure you want to ${status} this nomination?`)) {
            await updateNominationStatus(id, status);
            loadNominations(selectedPoll); // Refresh list
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Nominations</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Election</label>
                <select
                    value={selectedPoll}
                    onChange={(e) => setSelectedPoll(e.target.value)}
                    className="w-full md:w-1/3 rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
                >
                    {polls.map(p => (
                        <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SOP</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {nominations.map((nom) => (
                            <tr key={nom._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {nom.candidate?.profilePhoto ? (
                                                <img className="h-10 w-10 rounded-full" src={nom.candidate.profilePhoto} alt="" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-sm font-bold">{nom.candidate?.name?.charAt(0) || '?'}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{nom.candidate?.name || 'Unknown'}</div>
                                            <div className="text-sm text-gray-500">{nom.candidate?.email || 'No email'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${nom.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        nom.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {nom.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 dark:text-gray-300 max-w-xs truncate" title={nom.manifesto}>
                                        {nom.manifesto}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {nom.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleAction(nom._id, 'approved')}
                                                className="text-green-600 hover:text-green-900 font-bold"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(nom._id, 'rejected')}
                                                className="text-red-600 hover:text-red-900 font-bold"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {nominations.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No nominations found for this election.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminNominations;
