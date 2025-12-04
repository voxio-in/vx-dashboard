"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-red-500">
          🛡️ Admin Command Center
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold transition"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-red-900/50">
          <h2 className="text-xl font-bold mb-4">Total Users</h2>
          <p className="text-4xl font-mono text-red-400">1,240</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-red-900/50">
          <h2 className="text-xl font-bold mb-4">System Status</h2>
          <p className="text-green-400 font-bold">● Operational</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-red-900/50">
          <h2 className="text-xl font-bold mb-4">Revenue</h2>
          <p className="text-4xl font-mono text-white">$52,000</p>
        </div>
      </div>
    </div>
  );
}
