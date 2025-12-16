import React, { useState, useEffect } from 'react';

const ShareButtons = ({ url, title }) => {
  const [QRCode, setQRCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const shareText = encodeURIComponent(title || 'Check out this poll!');
  const shareUrl = encodeURIComponent(url);

  useEffect(() => {
    import('qrcode.react').then(mod => {
      setQRCode(() => mod.default || mod.QRCode || mod);
    });
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={handleCopy}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <a
          href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 rounded bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition"
        >
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 rounded bg-blue-400 text-white text-xs font-semibold hover:bg-blue-500 transition"
        >
          Twitter
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 rounded bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 transition"
        >
          Facebook
        </a>
      </div>
      <div className="mt-2 flex flex-col items-center" role="img" aria-label="QR Code to scan this poll on mobile">
        {QRCode ? <QRCode value={url} size={96} /> : <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-xs text-gray-500">QR</div>}
        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Scan to open on mobile</span>
      </div>
    </div>
  );
};

export default ShareButtons; 