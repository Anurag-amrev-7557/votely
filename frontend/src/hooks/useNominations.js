import { useState, useCallback } from 'react';
import axios from '../utils/api/axiosConfig';
import { toast } from 'react-hot-toast';

const useNominations = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const applyForNomination = useCallback(async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/nominations/apply', data);
            toast.success('Nomination submitted successfully!');
            return response.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to submit nomination';
            setError(msg);
            toast.error(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getMyNominations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/nominations/my');
            return response.data.nominations;
        } catch (err) {
            setError(err.message);
            toast.error('Failed to fetch your nominations');
        } finally {
            setLoading(false);
        }
    }, []);

    const getPollNominations = useCallback(async (pollId) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/nominations/poll/${pollId}`);
            return response.data.nominations;
        } catch (err) {
            setError(err.message);
            toast.error('Failed to fetch nominations');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateNominationStatus = useCallback(async (nominationId, status, comments) => {
        setLoading(true);
        try {
            const response = await axios.put(`/api/nominations/${nominationId}/status`, { status, adminComments: comments });
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
        applyForNomination,
        getMyNominations,
        getPollNominations,
        updateNominationStatus
    };
};

export default useNominations;
