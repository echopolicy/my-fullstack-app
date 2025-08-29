import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user.fullName}</h1>
      <p className="text-gray-600">Work in Progress to link user with poll</p>
      <div className="mt-4">
        <a
          href="/admin/create"
          className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#3B82F6]"
        >
          Create Poll
        </a>
      </div>
    </div>
  );
}