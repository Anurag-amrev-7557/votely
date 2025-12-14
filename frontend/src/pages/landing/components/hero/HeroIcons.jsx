import { motion } from 'framer-motion';

export const EncryptionIcon = () => (
    <span className="relative flex items-center justify-center">
        <svg
            className="w-6 h-6 text-green-500 dark:text-green-400 drop-shadow-[0_1px_2px_rgba(34,197,94,0.15)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                initial={{ pathLength: 0.7, opacity: 0.7 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
            <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4"
                initial={{ pathLength: 0, opacity: 0.5 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            />
        </svg>
    </span>
);

export const ResultsIcon = () => (
    <span className="relative flex items-center justify-center">
        <svg
            className="w-6 h-6 text-blue-500 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <motion.rect
                x="4"
                y="12"
                width="3"
                height="8"
                rx="1.5"
                fill="currentColor"
                initial={{ height: 0, y: 20 }}
                animate={{ height: 8, y: 12 }}
                transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse", delay: 0.1 }}
            />
            <motion.rect
                x="10.5"
                y="8"
                width="3"
                height="12"
                rx="1.5"
                fill="currentColor"
                initial={{ height: 0, y: 20 }}
                animate={{ height: 12, y: 8 }}
                transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
            />
            <motion.rect
                x="17"
                y="4"
                width="3"
                height="16"
                rx="1.5"
                fill="currentColor"
                initial={{ height: 0, y: 20 }}
                animate={{ height: 16, y: 4 }}
                transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
            />
        </svg>
    </span>
);

export const SupportIcon = () => (
    <span className="relative flex items-center justify-center">
        <svg
            className="w-6 h-6 text-purple-500 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <motion.circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                initial={{ scale: 0.95, opacity: 0.7 }}
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
        </svg>
        <span className="absolute -right-1 -top-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
        </span>
    </span>
);

export const BadgeIcons = {
    Fortune: (
        <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    Universities: (
        <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
    ),
    NGOs: (
        <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
    More: (
        <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
    )
};
