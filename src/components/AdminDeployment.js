import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminDeployment() {
  const [confirmedMatches, setConfirmedMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConfirmedMatches = async () => {
    // শুধুমাত্র 'confirmed' স্ট্যাটাসের ম্যাচগুলো আনবে
    const { data, error } = await supabase
      .from('job_matches')
      .select(`
        id,
        status,
        job_seeker_id,
        company_id,
        profiles:job_seeker_id (full_name),
        company:company_id (company_name)
      `)
      .eq('status', 'confirmed');

    if (!error) setConfirmedMatches(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchConfirmedMatches();
  }, []);

  const handleDeploy = async (matchId, seekerId) => {
    const remarks = window.prompt("Enter deployment remarks (e.g., Visa Issued, Contract Signed):");
    if (!remarks) return;

    const { data: { user } } = await supabase.auth.getUser();

    // ১. job_matches স্ট্যাটাস আপডেট করে 'deployed' করা (যদি আপনার enum-এ থাকে) 
    // অথবা আলাদা কলামে ট্র্যাক করা। এখানে আমরা স্ট্যাটাস আপডেট করছি।
    const { error: matchError } = await supabase
      .from('job_matches')
      .update({ status: 'deployed', manager_id: user.id })
      .eq('id', matchId);

    if (matchError) {
      alert("Error updating match: " + matchError.message);
      return;
    }

    // ২. deployment_logs টেবিলে এন্ট্রি দেওয়া
    const { error: logError } = await supabase
      .from('deployment_logs')
      .insert([{
        match_id: matchId,
        action_by_id: user.id,
        previous_status: 'confirmed',
        new_status: 'deployed',
        remarks: remarks
      }]);

    if (!logError) {
      alert("Deployment Successful!");
      setConfirmedMatches(confirmedMatches.filter(m => m.id !== matchId));
    }
  };

  if (loading) return <p>Loading deals for deployment...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-black">
      <h3 className="text-xl font-black mb-6">Final Deployment (Admin Control)</h3>
      <div className="space-y-4">
        {confirmedMatches.length === 0 ? (
          <p className="text-slate-400 italic">No confirmed deals waiting for deployment.</p>
        ) : (
          confirmedMatches.map((match) => (
            <div key={match.id} className="p-4 border rounded-xl flex justify-between items-center bg-slate-50">
              <div>
                <p className="font-bold text-slate-900">{match.profiles?.full_name}</p>
                <p className="text-xs text-blue-600 font-bold uppercase">→ {match.company?.company_name}</p>
              </div>
              <button 
                onClick={() => handleDeploy(match.id, match.job_seeker_id)}
                className="bg-black text-white px-6 py-2 rounded-lg font-black hover:bg-[#15803d] transition"
              >
                DEPLOY NOW
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}