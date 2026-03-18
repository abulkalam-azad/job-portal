import { useEffect, useState } from 'react';
// We are using the exact path proven by your DIR command
import { supabase } from '../lib/supabaseClient';// Only one set of dots!
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // A simpler way to check the connection
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login');
      } else {
        setSession(data.session);
      }
    };
    getSession();
  }, [router]);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2563eb' }}>Super Admin Dashboard</h1>
      <p>System connected successfully.</p>
      {session && <p>Logged in as: <strong>{session.user.email}</strong></p>}
    </div>
  );
}