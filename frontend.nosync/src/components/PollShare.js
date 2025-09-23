// src/components/PollShare.js
import React, { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';

/**
 * Props:
 *  - shareUrl (string) - full url to the poll (e.g. https://echopolicy.com/polls/123)
 *  - pollQuestion (string)
 *  - pollId (string) - used to build embed URL
 *  - variant ("full" | "compact") optional - controls sizes
 */
export default function PollShare({ shareUrl, pollQuestion, pollId, variant = 'full' }) {
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showEmbedToast, setShowEmbedToast] = useState(false);

  // Use existing polls route + embed query param so it's less likely to 404 on hosted SPAs
  const iframeSrc = `${window.location.origin}/polls/${pollId}?embed=1`;
  const embedHtml = `<iframe src="${iframeSrc}" width="100%" height="400" frameborder="0" style="border:0" loading="lazy"></iframe>`;

  const iconSize = variant === 'full' ? 40 : 32;
  const buttonSizeClass = variant === 'full' ? 'w-10 h-10' : 'w-8 h-8'; // tailwind classes (40px / 32px)

  async function copyText(text, isEmbed = false) {
    try {
      await navigator.clipboard.writeText(text);
      if (isEmbed) {
        setShowEmbedToast(true);
        setTimeout(() => setShowEmbedToast(false), 2200);
      } else {
        setShowCopyToast(true);
        setTimeout(() => setShowCopyToast(false), 2200);
      }
    } catch (err) {
      console.error('Clipboard write failed', err);
      // optionally provide fallback UI
    }
  }

  // Inline SVG icons (no external dependency)
  const CopyIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M16 21H8a2 2 0 0 1-2-2V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="8" y="3" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CodeIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M16 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className={variant === 'full' ? 'mt-6' : 'mt-3'}>
      {variant === 'full' && <h3 className="text-center font-semibold mb-3">Share this poll</h3>}

      <div className="flex items-center justify-center flex-wrap gap-3">
        <TwitterShareButton url={shareUrl} title={pollQuestion}>
          <div className={buttonSizeClass + ' rounded-full overflow-hidden'} title="Share on Twitter">
            <TwitterIcon size={iconSize} round />
          </div>
        </TwitterShareButton>

        <FacebookShareButton url={shareUrl} quote={pollQuestion}>
          <div className={buttonSizeClass + ' rounded-full overflow-hidden'} title="Share on Facebook">
            <FacebookIcon size={iconSize} round />
          </div>
        </FacebookShareButton>

        <LinkedinShareButton url={shareUrl} title={pollQuestion}>
          <div className={buttonSizeClass + ' rounded-full overflow-hidden'} title="Share on LinkedIn">
            <LinkedinIcon size={iconSize} round />
          </div>
        </LinkedinShareButton>

        <WhatsappShareButton url={shareUrl} title={pollQuestion}>
          <div className={buttonSizeClass + ' rounded-full overflow-hidden'} title="Share on WhatsApp">
            <WhatsappIcon size={iconSize} round />
          </div>
        </WhatsappShareButton>

        {/* Copy Link Icon */}
        <button
          onClick={() => copyText(shareUrl, false)}
          title="Copy link"
          className={`${buttonSizeClass} flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition`}
          aria-label="Copy poll link"
        >
          <CopyIcon size={variant === 'full' ? 20 : 16} />
        </button>

        {/* Copy Embed Icon */}
        <button
          onClick={() => copyText(embedHtml, true)}
          title="Copy embed iframe HTML"
          className={`${buttonSizeClass} flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition`}
          aria-label="Copy embed HTML"
        >
          <CodeIcon size={variant === 'full' ? 20 : 16} />
        </button>
      </div>

      {/* Toasts (local to this component) */}
      {showCopyToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-[9999]">
          Link copied to clipboard!
        </div>
      )}
      {showEmbedToast && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-[9999]">
          Embed HTML copied!
        </div>
      )}
    </div>
  );
}