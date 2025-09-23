// src/components/PollShare.js
import React, { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';

/**
 * Props:
 *  - shareUrl (string) - link to the poll page
 *  - pollQuestion (string)
 *  - pollId (string) - poll id used to build the embed URL
 *  - variant ('default'|'compact') - controls sizing/spacing
 *  - embedHeight (number|string) optional - default 400
 */
export default function PollShare({
  shareUrl,
  pollQuestion,
  pollId,
  variant = 'default',
  embedHeight = 400,
}) {
  const [toast, setToast] = useState({ show: false, text: '' });

  // If you want the embed HTML to always point to prod URL (not localhost),
  // set REACT_APP_PUBLIC_URL in your environment to "https://echopolicy.com"
  const origin = process.env.REACT_APP_PUBLIC_URL || window.location.origin;
  // Build embed src using the polls route + query param (safer than /embed/:id)
  const iframeSrc = `${origin}/polls/${pollId}?embed=1`;
  const embedHtml = `<iframe src="${iframeSrc}" width="100%" height="${embedHeight}" frameborder="0" style="border:0" loading="lazy"></iframe>`;

  const iconSize = variant === 'compact' ? 32 : 40;
  const buttonSizeClass = variant === 'compact' ? 'w-8 h-8' : 'w-10 h-10';
  const containerBase = variant === 'compact' ? 'flex items-center flex-wrap mt-2' : 'mt-8 pt-4 border-t text-center';

  async function copy(text, message) {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ show: true, text: message });
      setTimeout(() => setToast({ show: false, text: '' }), 2400);
    } catch (err) {
      console.error('Clipboard copy failed', err);
      setToast({ show: true, text: 'Copy failed' });
      setTimeout(() => setToast({ show: false, text: '' }), 2400);
    }
  }

  // Inline icons (copy + code) — small, no extra dependency required
  const CopyIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M16 21H8a2 2 0 0 1-2-2V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="8" y="3" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const CodeIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M16 18l6-6-6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className={containerBase}>
      {variant !== 'compact' && <h3 className="font-semibold mb-3">Share this Poll</h3>}

      <div className={`flex items-center justify-center gap-3 flex-wrap`}>
        <TwitterShareButton url={shareUrl} title={pollQuestion}>
          <div className={`${buttonSizeClass} rounded-full overflow-hidden`} title="Share on Twitter">
            <TwitterIcon size={iconSize} round />
          </div>
        </TwitterShareButton>

        <FacebookShareButton url={shareUrl} quote={pollQuestion}>
          <div className={`${buttonSizeClass} rounded-full overflow-hidden`} title="Share on Facebook">
            <FacebookIcon size={iconSize} round />
          </div>
        </FacebookShareButton>

        <LinkedinShareButton url={shareUrl} title={pollQuestion}>
          <div className={`${buttonSizeClass} rounded-full overflow-hidden`} title="Share on LinkedIn">
            <LinkedinIcon size={iconSize} round />
          </div>
        </LinkedinShareButton>

        <WhatsappShareButton url={shareUrl} title={pollQuestion}>
          <div className={`${buttonSizeClass} rounded-full overflow-hidden`} title="Share on WhatsApp">
            <WhatsappIcon size={iconSize} round />
          </div>
        </WhatsappShareButton>

        <EmailShareButton url={shareUrl} subject={pollQuestion} body="Check out this poll:">
          <div className={`${buttonSizeClass} rounded-full overflow-hidden`} title="Share by Email">
            <EmailIcon size={iconSize} round />
          </div>
        </EmailShareButton>

        {/* Copy Link icon (round) */}
        <button
          type="button"
          onClick={() => copy(shareUrl, 'Link copied!')}
          title="Copy link"
          className={`${buttonSizeClass} flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition`}
          aria-label="Copy poll link"
        >
          <CopyIcon size={variant === 'compact' ? 16 : 18} />
        </button>

        {/* Copy Embed icon (round) */}
        <button
          type="button"
          onClick={() => copy(embedHtml, 'Embed HTML copied!')}
          title="Copy embed HTML"
          className={`${buttonSizeClass} flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition`}
          aria-label="Copy embed HTML"
        >
          <CodeIcon size={variant === 'compact' ? 16 : 18} />
        </button>
      </div>

      {toast.show && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast.text}
        </div>
      )}
    </div>
  );
}