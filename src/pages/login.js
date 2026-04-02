import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please enter both your email and password.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      // 1. Get role from Metadata (Fastest & avoids RLS loops)
      const metaRole = data.user.app_metadata?.role;

      // 2. Fallback: Get role from the profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const finalRole = metaRole || profile?.role;

      // Debugging: This will show you exactly what the app "sees"
      console.log("Login successful. Role detected:", finalRole);

      if (finalRole === 'super_admin') {
        router.push('/admin');
      } else if (finalRole === 'manager') {
        router.push('/admin');
      } else {
        // If the dashboard doesn't exist yet, go to home
        router.push('/'); 
      }
    }
  };

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#15803d] p-4">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-lg rounded-2xl border border-slate-200 w-96">
        <h1 className="text-2xl font-bold mb-6">Portal Login</h1>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-6 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
          required 
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Sign In
        </button>
      </form>
    </div>
  );
}