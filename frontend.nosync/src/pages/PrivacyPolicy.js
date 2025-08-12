import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Last updated: August 11, 2025</p>

      <p className="mb-4">
        At EchoPolicy, we value your privacy. This Privacy Policy outlines how
        we collect, use, and protect your personal information when you use our
        services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Personal information you provide (e.g., name, email).</li>
        <li>Data related to your usage of our platform.</li>
        <li>Cookies and analytics information.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use the collected information to:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Provide and improve our services.</li>
        <li>Communicate updates, offers, and service changes.</li>
        <li>Ensure platform security and compliance.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Protection</h2>
      <p className="mb-4">
        We implement appropriate technical and organizational measures to
        safeguard your information. However, no method of transmission over the
        internet is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, update, or delete your personal data.
        Contact us at support@echopolicy.com for assistance.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with the updated date.
      </p>
    </div>
  );
};

export default PrivacyPolicy;