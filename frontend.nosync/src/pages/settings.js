import React, { useState } from "react";

// Simple Card components with Tailwind (no external shadcn dependency)
function Card({ children, className }) {
  return <div className={`rounded-2xl shadow-lg bg-white p-6 ${className}`}>{children}</div>;
}
function CardHeader({ children, className }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}
function CardTitle({ children, className }) {
  return <h2 className={`text-xl font-bold text-gray-800 ${className}`}>{children}</h2>;
}
function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}

// Alias generator with uniqueness check
const adjectives = [
  "Swift", "Happy", "Clever", "Brave", "Silent", "Mighty", "Lucky", "Shiny"
];
const animals = [
  "Fox", "Panda", "Wolf", "Tiger", "Eagle", "Otter", "Dolphin", "Hawk"
];
const usedAliases = new Set();

function generateAlias() {
  let alias;
  let attempts = 0;
  const maxAttempts = adjectives.length * animals.length;

  do {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const num = Math.floor(Math.random() * 999);
    alias = `${adj}${animal}${num}`;
    attempts++;
  } while (usedAliases.has(alias) && attempts < maxAttempts);

  if (usedAliases.has(alias)) {
    // fallback if all combos used
    alias = `User${Math.random().toString(36).substring(2, 8)}`;
  }

  usedAliases.add(alias);
  return alias;
}

export default function Settings() {
  const [hideName, setHideName] = useState(false);
  const [alias, setAlias] = useState("");
  const [accountDeleted, setAccountDeleted] = useState(false);

  const handleToggle = () => {
    setHideName(!hideName);
    if (!hideName) {
      setAlias(generateAlias());
    } else {
      setAlias("");
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      setAccountDeleted(true);
      // Call backend delete account API here
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">⚙️ Settings</h1>

      {/* Delete Account */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Deleting your account will remove all your data permanently. This action cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transform hover:scale-105 transition"
          >
            Delete My Account
          </button>
          {accountDeleted && (
            <p className="text-red-600 mt-3 font-semibold">Your account has been deleted.</p>
          )}
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={hideName}
              onChange={handleToggle}
              className="mr-3 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            Hide my real name in forums
          </label>

          {hideName && (
            <div className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-200">
              <p className="text-gray-800">
                Your alias: <span className="font-semibold text-orange-600">{alias}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                This name will appear instead of your real name in forum comments.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}