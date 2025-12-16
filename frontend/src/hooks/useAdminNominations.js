import { useState, useCallback } from 'react';
import adminAxios from '../utils/api/adminAxios';
import { toast } from 'react-hot-toast';

const useAdminNominations = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getPollNominations = useCallback(async (pollId) => {
        setLoading(true);
        setError(null);
        try {
            console.log('[AdminNominations] Fetching nominations for pollId:', pollId);
            const response = await adminAxios.get(`/nominations/poll/${pollId}`);
            console.log('[AdminNominations] Response:', response.data);
            return response.data.nominations || [];
        } catch (err) {
            console.error('[AdminNominations] Error fetching nominations:', err.response?.data || err.message);
            setError(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || 'Failed to fetch nominations');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const updateNominationStatus = useCallback(async (nominationId, status, comments) => {
        setLoading(true);
        try {
            const response = await adminAxios.put(`/nominations/${nominationId}/status`, { status, adminComments: comments });
            toast.success(`Nomination ${status} successfully`);
            return response.data.nomination;
        } catch (err) {
            toast.error('Failed to update status');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        getPollNominations,
        updateNominationStatus
    };
};

export default useAdminNominations;
