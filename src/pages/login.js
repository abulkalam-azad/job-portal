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
      // ১. স্ট্যাটাস চেক করা (Inactive ইউজারদের ব্লক করার জন্য)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, status') // status কলামটি সিলেক্ট করা হলো
        .eq('id', data.user.id)
        .single();

      if (profileData?.status === 'inactive') {
        // ইউজার ইনঅ্যাক্টিভ হলে তাকে সাইন আউট করে দিন
        await supabase.auth.signOut();
        alert("Your account is inactive. Please contact the administrator.");
        return; // ফাংশন এখানেই শেষ, রিডাইরেক্ট হবে না
      }

      // ২. রোল ডিটেক্ট করা (Metadata অথবা Profile Table থেকে)
      const metaRole = data.user.app_metadata?.role;
      const finalRole = metaRole || profileData?.role;

      console.log("Login successful. Role detected:", finalRole);

      // ৩. রোল অনুযায়ী রিডাইরেক্ট করা
      if (finalRole === 'super_admin' || finalRole === 'manager') {
        router.push('/admin');
      } else if (finalRole === 'company') {
        router.push('/dashboard/company');
      } else if (finalRole === 'job_seeker') {
        router.push('/dashboard/seeker');
      } else {
        // fallback if role is missing or undefined
        router.push('/');
      }
    }
  }; // End of handleLogin

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#15803d] p-4">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-lg rounded-2xl border border-slate-200 w-96">
        <h1 className="text-2xl font-bold mb-6">Portal Login</h1>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-black" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-6 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-black" 
          required 
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Sign In
        </button>

        {/* Signup Redirect Button */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={() => router.push('/signup')}
              className="text-blue-600 font-bold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}