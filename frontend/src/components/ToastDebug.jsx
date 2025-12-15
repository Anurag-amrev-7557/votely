import React from 'react';
import {
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    showLoadingToast,
    showCustomToast,
    dismissAllToasts
} from '../utils/toastUtils';

const ToastDebug = () => {
    return (
        <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-3 p-4 bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-2xl backdrop-blur-lg border border-slate-200 dark:border-slate-700 w-64 transition-all hover:scale-105">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Toast Debugger</h3>
                <button
                    onClick={() => dismissAllToasts()}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
                >
                    Dismiss All
                </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => showSuccessToast('Operation Successful', 'Your changes have been saved to the database.')}
                    className="px-3 py-2 text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition shadow-sm hover:shadow-md"
                >
                    Success
                </button>
                <button
                    onClick={() => showErrorToast('Connection Failed', 'Could not connect to the server. Please check your internet connection.')}
                    className="px-3 py-2 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition shadow-sm hover:shadow-md"
                >
                    Error
                </button>
                <button
                    onClick={() => showWarningToast('Session Expiring', 'Your session will expire in less than 5 minutes. Save your work.')}
                    className="px-3 py-2 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition shadow-sm hover:shadow-md"
                >
                    Warning
                </button>
                <button
                    onClick={() => showInfoToast('New Update Available', 'A new version of Votely (v2.0) has been released with exciting features.')}
                    className="px-3 py-2 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition shadow-sm hover:shadow-md"
                >
                    Info
                </button>
                <button
                    onClick={() => {
                        const id = showLoadingToast('Processing Request', 'Please wait while we process your secure transaction...');
                        setTimeout(() => {
                            // We don't dismiss here to let user see it, or we could dismiss
                            // dismissToast(id);
                            showSuccessToast('Transaction Complete', 'Your transaction was processed successfully.');
                        }, 3000);
                    }}
                    className="px-3 py-2 text-xs font-medium bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition shadow-sm hover:shadow-md"
                >
                    Loading
                </button>
                <button
                    onClick={() => showCustomToast('Developer Mode', 'Debug mode enabled. Console logs are now visible.')}
                    className="px-3 py-2 text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition shadow-sm hover:shadow-md"
                >
                    Custom
                </button>
            </div>
            <div className="pt-1 text-[10px] text-center text-slate-400">
                Click buttons to test animations
            </div>
        </div>
    );
};

export default ToastDebug;
