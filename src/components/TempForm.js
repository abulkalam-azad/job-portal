import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Your standard client

export default function ManagerProvisionForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get the current Super Admin's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        alert("You must be logged in as Super Admin");
        return;
      }

      // 2. Call your API with the Authorization Header
      const response = await fetch('/api/admin/provision-manager', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // THIS IS THE SECRET SAUCE:
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
        // Clear form
        setEmail(''); setPassword(''); setName('');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      alert("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-xl font-black text-slate-800">Provision Manager</h2>
      <input 
        type="text" placeholder="Manager Full Name" value={name}
        onChange={(e) => setName(e.target.value)} required 
        className="w-full p-3 border rounded-xl"
      />
      <input 
        type="email" placeholder="Manager Email" value={email}
        onChange={(e) => setEmail(e.target.value)} required 
        className="w-full p-3 border rounded-xl"
      />
      <input 
        type="password" placeholder="Temporary Password" value={password}
        onChange={(e) => setPassword(e.target.value)} required 
        className="w-full p-3 border rounded-xl"
      />
      <button 
        type="submit" disabled={loading}
        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition"
      >
        {loading ? 'Processing...' : 'Create Manager Account'}
      </button>
    </form>
  );
}