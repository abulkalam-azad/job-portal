import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('job_seeker'); // UI states: 'job_seeker' or 'company'
  const [companyName, setCompanyName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const handleSignUp = async (e) => {
  e.preventDefault();
  setLoading(true);

  // No more dbRole mapping needed since 'company' is the correct DB label!
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { 
        full_name: fullName,
        role: role, // This will be 'company' or 'job_seeker'
        company_name: role === 'company' ? companyName : null,
        business_reg_no: role === 'company' ? regNo : null,
        location_country: country,
        status: 'active'
      }
    }
  });

  if (error) {
    alert("Signup Error: " + error.message);
  } else {
    alert("Registration successful! Please check your email for verification.");
    router.push('/login');
  }
  setLoading(false);
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#15803d] p-4">
      <form onSubmit={handleSignUp} className="p-8 bg-white shadow-lg rounded-2xl border border-slate-200 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h1>
        
        {/* Role Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="job_seeker">Job Seeker</option>
            <option value="company">Company / Employer</option>
          </select>
        </div>

        <input 
          type="text" 
          placeholder="Full Name" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)} 
          className="w-full p-3 mb-4 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-black" 
          required 
        />

        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-black" 
          required 
        />

        {/* Conditional Company Fields */}
        {role === 'company' && (
          <>
            <input 
              type="text" 
              placeholder="Company Name" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)} 
              className="w-full p-3 mb-4 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-black" 
              required 
            />
            <input 
              type="text" 
              placeholder="Business Registration No" 
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)} 
              className="w-full p-3 mb-4 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-black" 
              required 
            />
          </>
        )}

        <input 
          type="text" 
          placeholder="Country" 
          value={country}
          onChange={(e) => setCountry(e.target.value)} 
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

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className="mt-4 text-center">
          <button 
            type="button" 
            onClick={() => router.push('/login')}
            className="text-sm text-gray-600 hover:underline"
          >
            Already have an account? Log In
          </button>
        </div>
      </form>
    </div>
  );
}