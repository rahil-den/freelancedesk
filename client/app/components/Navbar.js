'use client';

import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => router.push('/dashboard')}
      >
        FreelanceDesk
      </h1>
      <button
        onClick={logout}
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-sm"
      >
        Logout
      </button>
    </nav>
  );
}
