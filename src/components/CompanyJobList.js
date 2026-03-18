import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function CompanyJobList() {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. ডাটা ফেচ করার ফাংশন
  const fetchMyJobs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!error) setMyJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  // ২. ডিলিট করার ফাংশন
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    
    if (confirmDelete) {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) {
        alert("Error: " + error.message);
      } else {
        // লিস্ট থেকে ওই আইডিটি সরিয়ে ফেলা (UI আপডেট)
        setMyJobs(myJobs.filter(job => job.id !== id));
        alert("Job deleted successfully!");
      }
    }
  };

  if (loading) return <p className="text-slate-500">Loading your jobs...</p>;

  return (
    <div className="mt-10">
      <h3 className="text-xl font-black text-slate-800 mb-4">Your Active Listings</h3>
      <div className="space-y-4">
        {myJobs.length === 0 ? (
          <p className="text-slate-500 italic">No jobs posted yet.</p>
        ) : (
          myJobs.map(job => (
            <div key={job.id} className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm hover:shadow-md transition">
              <div>
                <h4 className="font-bold text-slate-900">{job.title}</h4>
                <p className="text-sm text-slate-500">
                  {job.location_country} • ${job.hourly_rate}/hr
                </p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded uppercase">
                  {job.status}
                </span>
              </div>
              
              {/* ডিলিট বাটন */}
              <button 
                onClick={() => handleDelete(job.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Delete Job"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}