import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // State for the name
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName, // This sends the name to your SQL trigger
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="p-10 bg-white rounded-3xl shadow-2xl w-full max-w-md">
        {success ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">Account Created!</h2>
            <p className="mt-4 text-slate-600">Please check your email to confirm your account.</p>
          </div>
        ) : (
          <form onSubmit={handleSignUp}>
            <h1 className="text-3xl font-black mb-8">Join the Portal</h1>
            
            {/* Full Name Input */}
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)} 
                className="w-full p-4 bg-slate-50 border rounded-2xl focus:outline-blue-500"
                required 
              />
            </div>

            <div className="mb-4">
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-4 bg-slate-50 border rounded-2xl focus:outline-blue-500" 
                required 
              />
            </div>

            <div className="mb-8">
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-4 bg-slate-50 border rounded-2xl focus:outline-blue-500" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg disabled:bg-blue-300"
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}