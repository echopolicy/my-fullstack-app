import React from "react";

const Terms = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <p className="mb-4">Last updated: August 11, 2025</p>

      <p className="mb-4">
        Welcome to EchoPolicy. By accessing or using our services, you agree to
        comply with and be bound by these Terms and Conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of the Service</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>You must be at least 13 years old to use our services.</li>
        <li>You agree not to misuse or exploit the service.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. User Content</h2>
      <p className="mb-4">
        You retain ownership of the content you post but grant EchoPolicy a
        license to use, display, and distribute it in connection with providing
        the service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Termination</h2>
      <p className="mb-4">
        We may suspend or terminate your account at our discretion if you
        violate these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Limitation of Liability</h2>
      <p className="mb-4">
        EchoPolicy is not responsible for any indirect, incidental, or
        consequential damages arising from your use of the service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to the Terms</h2>
      <p className="mb-4">
        We may revise these Terms and Conditions from time to time. Updated
        terms will be posted here with the updated date.
      </p>
    </div>
  );
};

export default Terms;
