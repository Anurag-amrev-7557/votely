import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from '../../utils/toastUtils';

const MagicLinkVerifyPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyMagicLink } = useAuth();
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        const email = searchParams.get('email');
        const token = searchParams.get('token');

        if (!email || !token) {
            setStatus('error');
            toast.error('Invalid link parameters');
            return;
        }

        const verify = async () => {
            const result = await verifyMagicLink(email, token);
            if (result.success) {
                setStatus('success');
                toast.success('Successfully logged in!');
                setTimeout(() => navigate('/polls'), 1500);
            } else {
                setStatus('error');
                toast.error(result.error || 'Verification failed');
            }
        };

        verify();
    }, [searchParams, verifyMagicLink, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"
                role="status"
                aria-live="polite"
            >
                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Verifying your login...</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait a moment.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-500 text-3xl">✓</div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Success!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Redirecting you to the portal...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-500 text-3xl">✕</div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Verification Failed</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">The link may have expired or is invalid.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-6 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default MagicLinkVerifyPage;
