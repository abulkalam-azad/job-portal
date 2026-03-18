// My Applications List 
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApps = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      // এখানে আমরা 'jobs' টেবিল থেকে জবের টাইটেল এবং কান্ট্রি একসাথে আনছি
      const { data, error } = await supabase
        .from('job_matches')
        .select(`
          id,
          status,
          created_at,
          hourly_rate,
          jobs:company_id (
            title,
            location_country
          )
        `)
        .eq('job_seeker_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setApplications(data);
      setLoading(false);
    };

    fetchMyApps();
  }, []);

  if (loading) return <p className="text-sm text-slate-500">Updating your status...</p>;

  return (
    <div className="mt-12 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <span className="bg-[#15803d] w-2 h-6 rounded-full inline-block"></span>
        My Application Status
      </h3>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <p className="text-slate-400 italic text-center py-6">You haven't applied for any jobs yet.</p>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition rounded-xl">
              <div>
                <h4 className="font-bold text-slate-900">{app.jobs?.title || 'Job Title'}</h4>
                <p className="text-xs text-slate-500">
                   {app.jobs?.location_country} • Rate: ${app.hourly_rate}/hr
                </p>
              </div>

              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                  app.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  {app.status}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Applied on: {new Date(app.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}