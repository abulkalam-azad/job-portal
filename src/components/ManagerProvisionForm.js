import { useState, useEffect } from 'react'; // Added useEffect
import { supabase } from '../lib/supabaseClient';

export default function ManagerProvisionForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // New: prevents SSR errors

  // Only render fully once the component is mounted in the browser
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        alert("You must be logged in as Super Admin");
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/provision-manager', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}` 
        },
        body: JSON.stringify({ 
          email, 
          password, 
          full_name: name 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Success: Secondary Manager Provisioned!");
        setEmail(''); setPassword(''); setName('');
      } else {
        alert(`Error: ${result.error || 'Failed to provision'}`);
      }
    } catch (err) {
      alert("Network error occurred. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // If we aren't in the browser yet, show a simple placeholder 
  // to satisfy the Vercel Prerender engine.
  if (!isMounted) return <div className="p-6 text-center">Loading Form...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Provision Manager</h2>
      
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
        <input 
          type="text" placeholder="John Doe" value={name}
          onChange={(e) => setName(e.target.value)} required 
          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
        <input 
          type="email" placeholder="manager@company.com" value={email}
          onChange={(e) => setEmail(e.target.value)} required 
          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 ml-1">Temporary Password</label>
        <input 
          type="password" placeholder="••••••••" value={password}
          onChange={(e) => setPassword(e.target.value)} required 
          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <button 
        type="submit" disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
          loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
        ) : 'Create Manager Account'}
      </button>
    </form>
  );
}