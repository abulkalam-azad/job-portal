import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function JobFeed() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]); // ইতিমধ্যে যেগুলোতে আবেদন করা হয়েছে
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobsAndMatches = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      // ১. সব ওপেন জব ফেচ করা
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      // ২. এই ইউজার ইতিমধ্যে কোনগুলোতে আবেদন করেছে তা চেক করা
      const { data: matchData } = await supabase
        .from('job_matches')
        .select('company_id, hourly_rate') // এখানে আমরা চেকিংয়ের জন্য ডাটা আনছি
        .eq('job_seeker_id', user.id);

      if (jobData) setJobs(jobData);
      if (matchData) setAppliedJobs(matchData.map(m => m.company_id)); // সিম্পল চেকিং
      setLoading(false);
    };

    fetchJobsAndMatches();
  }, []);

  const handleApply = async (job) => {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('job_matches').insert([
      {
        job_seeker_id: user.id,
        company_id: job.company_id,
        hourly_rate: job.hourly_rate,
        status: 'pending' // আপনার SQL অনুযায়ী ডিফল্ট ভ্যালু
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Applied Successfully!");
      setAppliedJobs([...appliedJobs, job.company_id]);
    }
  };

  if (loading) return <p className="text-center p-10 font-bold text-[#15803d]">Loading Jobs...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.length === 0 ? (
        <p className="text-slate-500 italic">No vacancies found.</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-xl font-black text-slate-800">{job.title}</h4>
              <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-full font-bold uppercase">
                {job.job_type}
              </span>
            </div>
            
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{job.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {job.requirements?.map((req, i) => (
                <span key={i} className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500">
                  #{req}
                </span>
              ))}
            </div>

            <div className="border-t pt-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-black text-[#15803d]">${job.hourly_rate}/hr</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{job.location_country}</p>
              </div>

              <button 
                onClick={() => handleApply(job)}
                disabled={appliedJobs.includes(job.company_id)}
                className={`px-6 py-2 rounded-xl font-bold transition ${
                  appliedJobs.includes(job.company_id) 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-[#15803d]'
                }`}
              >
                {appliedJobs.includes(job.company_id) ? 'Applied' : 'Apply Now'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}