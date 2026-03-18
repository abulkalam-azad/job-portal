import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function SeekerDashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
      else setUser(user);
    };
    getUser();
  }, [router]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Job Seeker Dashboard</h1>
      <p className="mt-4">Welcome, {user?.email}. Your job search starts here.</p>
      <button 
        onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}