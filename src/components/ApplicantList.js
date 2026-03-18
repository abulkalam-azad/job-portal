import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ApplicantList() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('job_matches')
      .select(`
        id,
        status,
        created_at,
        job_seeker_id,
        profiles:job_seeker_id (
          full_name,
          email,
          location_country
        )
      `)
      .eq('company_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setApplicants(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // স্ট্যাটাস আপডেট করার ফাংশন
  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from('job_matches')
      .update({ 
        status: newStatus,
        confirmed_at: newStatus === 'confirmed' ? new Date().toISOString() : null 
      })
      .eq('id', id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert(`Application ${newStatus}!`);
      fetchApplicants(); // লিস্ট রিফ্রেশ করা
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Loading applicants...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-10">
      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <span className="bg-blue-600 w-2 h-6 rounded-full inline-block"></span>
        Manage Applications
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Applicant</th>
              <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Country</th>
              <th className="pb-4 font-bold text-slate-400 text-xs uppercase">Current Status</th>
              <th className="pb-4 font-bold text-slate-400 text-xs uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {applicants.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition">
                <td className="py-4">
                  <p className="font-bold text-slate-900">{app.profiles?.full_name}</p>
                  <p className="text-xs text-slate-500">{app.profiles?.email}</p>
                </td>
                <td className="py-4 text-sm text-slate-600">{app.profiles?.location_country}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                    app.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="py-4 text-right space-x-2">
                  {app.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(app.id, 'confirmed')}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-700 transition"
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={() => handleStatusChange(app.id, 'rejected')}
                        className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-100 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {app.status !== 'pending' && (
                    <span className="text-slate-400 text-xs italic">Decision Made</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}