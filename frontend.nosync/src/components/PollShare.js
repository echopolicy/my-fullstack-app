// src/components/PollShare.js
import { useState } from 'react';
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
import { Copy, Code } from 'lucide-react';

const PollShare = ({ shareUrl, pollQuestion, pollId, variant = 'default' }) => {
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage(message);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2500);
    });
  };

  const embedCode = `<iframe src="https://echopolicy.com/embed/${pollId}" width="600" height="400" frameborder="0"></iframe>`;

  const iconSize = variant === 'compact' ? 32 : 40;
  const gap = variant === 'compact' ? 'gap-2' : 'gap-3';
  const containerClasses =
    variant === 'compact'
      ? 'flex items-center flex-wrap mt-2'
      : 'mt-8 pt-4 border-t text-center';

  return (
    <div className={containerClasses}>
      {variant !== 'compact' && <h3 className="font-semibold mb-3">Share this Poll</h3>}
      <div className={`flex items-center justify-center ${gap} flex-wrap`}>
        <TwitterShareButton url={shareUrl} title={pollQuestion}>
          <TwitterIcon size={iconSize} round />
        </TwitterShareButton>
        <FacebookShareButton url={shareUrl} quote={pollQuestion}>
          <FacebookIcon size={iconSize} round />
        </FacebookShareButton>
        <LinkedinShareButton url={shareUrl} title={pollQuestion}>
          <LinkedinIcon size={iconSize} round />
        </LinkedinShareButton>
        <WhatsappShareButton url={shareUrl} title={pollQuestion}>
          <WhatsappIcon size={iconSize} round />
        </WhatsappShareButton>
        <EmailShareButton url={shareUrl} subject={pollQuestion} body="Check out this poll:">
          <EmailIcon size={iconSize} round />
        </EmailShareButton>

        {/* Copy Link Icon */}
        <div
          onClick={() => copyToClipboard(shareUrl, 'Link copied!')}
          title="Copy poll link"
          className="cursor-pointer w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
        >
          <Copy className="w-5 h-5 text-gray-700" />
        </div>

        {/* Copy Embed Icon */}
        <div
          onClick={() => copyToClipboard(embedCode, 'Embed code copied!')}
          title="Copy embed code"
          className="cursor-pointer w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
        >
          <Code className="w-5 h-5 text-gray-700" />
        </div>
      </div>

      {/* Toast Notification */}
      {showCopyToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-5 py-2 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default PollShare;