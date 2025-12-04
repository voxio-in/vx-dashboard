"use client";

import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <nav className="flex justify-between items-center mb-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-600">🌿 MyApp</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition"
        >
          Log out
        </button>
      </nav>

      <main className="max-w-4xl mx-auto">
        <div className="bg-emerald-50 rounded-2xl p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold text-emerald-900 mb-2">
            Welcome Back!
          </h2>
          <p className="text-emerald-700">
            Here is your personal activity overview.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-gray-100 p-6 rounded-xl hover:shadow-md transition cursor-pointer"
            >
              <div className="h-10 w-10 bg-emerald-100 rounded-full mb-4 flex items-center justify-center text-emerald-600">
                ★
              </div>
              <h3 className="font-bold mb-1">Feature {i}</h3>
              <p className="text-sm text-gray-500">Access your tools here.</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
