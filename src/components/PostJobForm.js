import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function PostJobForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState(''); // comma separated
  const [rate, setRate] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    // Convert comma-separated string into an Array for your SQL 'requirements' column
    const requirementsArray = requirements.split(',').map(item => item.trim()).filter(item => item !== "");

    const { error } = await supabase.from('jobs').insert([
      {
        company_id: user.id,
        title,
        description,
        requirements: requirementsArray, // Sending as Array []
        hourly_rate: parseFloat(rate),
        location_country: country,
        job_type: 'full-time',
        status: 'open',
        vacancy_count: 1
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Job Posted successfully!");
      setTitle(''); setDescription(''); setRequirements(''); setRate(''); setCountry('');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handlePostJob} className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 space-y-5">
      <h3 className="text-2xl font-black text-slate-800 border-b pb-4">Post a New Vacancy</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-600">Job Title</label>
        <input 
          type="text" placeholder="e.g. Construction Supervisor" value={title} 
          onChange={(e) => setTitle(e.target.value)} required 
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#15803d] outline-none text-black"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-600">Description</label>
        <textarea 
          placeholder="Describe the job roles..." value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="w-full p-3 border rounded-xl h-24 focus:ring-2 focus:ring-[#15803d] outline-none text-black"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-600">Requirements (Separate with commas)</label>
        <input 
          type="text" placeholder="e.g. 5 years experience, Valid Passport, English Fluency" 
          value={requirements} onChange={(e) => setRequirements(e.target.value)} 
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#15803d] outline-none text-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600">Hourly Rate ($)</label>
          <input 
            type="number" step="0.01" placeholder="0.00" value={rate} 
            onChange={(e) => setRate(e.target.value)} required 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#15803d] outline-none text-black"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600">Target Country</label>
          <input 
            type="text" placeholder="e.g. Romania, Poland" value={country} 
            onChange={(e) => setCountry(e.target.value)} required 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#15803d] outline-none text-black"
          />
        </div>
      </div>

      <button 
        type="submit" disabled={loading}
        className="w-full bg-[#15803d] text-white py-4 rounded-xl font-black text-lg hover:bg-black transition-all shadow-lg"
      >
        {loading ? 'Processing...' : 'Publish Vacancy'}
      </button>
    </form>
  );
}