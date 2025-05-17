'use client';

import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  if (!session) return <p>Not logged in. Go to <a href="/login">Login</a></p>;

  return (
    <div>
      <p>Logged in as {session.user?.email}</p>

      <a className='text-blue-500 hover:underline' href="/dashboard/">Dashboard</a>
      <br />
      <button onClick={() => signOut()} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">
        Sign out
      </button>
    </div>
  );
}
