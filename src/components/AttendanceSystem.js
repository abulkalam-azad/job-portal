import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AttendanceSystem() {
  const [deployment, setDeployment] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    // ১. চেক করা ইউজার Deployed কি না (আপনার স্কিমা অনুযায়ী)
    const { data: match } = await supabase
      .from('job_matches')
      .select('id, status')
      .eq('job_seeker_id', user.id)
      .eq('status', 'deployed')
      .single();

    if (match) {
      setDeployment(match);
      
      // ২. বর্তমানে কোনো পাঞ্চ-ইন করা সেশন আছে কি না (যেখানে punch_out খালি)
      const { data: session } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .is('punch_out', null)
        .single();
      
      if (session) setActiveSession(session);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  // ৩. পাঞ্চ ইন ফাংশন
  const handlePunchIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('attendance')
      .insert([{ 
        user_id: user.id, 
        match_id: deployment.id,
        is_verified: false // ডিফল্টভাবে ফলস থাকবে
      }])
      .select()
      .single();

    if (!error) {
      setActiveSession(data);
      alert("Clocked In Successfully!");
    } else {
      alert("Error: " + error.message);
    }
  };

  // ৪. পাঞ্চ আউট ফাংশন
  const handlePunchOut = async () => {
    const { error } = await supabase
      .from('attendance')
      .update({ 
        punch_out: new Date().toISOString()
      })
      .eq('id', activeSession.id);

    if (!error) {
      alert("Clocked Out Successfully! Waiting for manager verification.");
      setActiveSession(null);
      checkStatus(); // ডাটা রিফ্রেশ
    } else {
      alert("Error: " + error.message);
    }
  };

  if (loading) return <div className="animate-pulse text-xs font-bold text-slate-400">Verifying Deployment...</div>;
  if (!deployment) return null; // Deployed না হলে কিছুই দেখাবে না

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 my-8">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-3 h-3 rounded-full ${activeSession ? 'bg-green-500 animate-ping' : 'bg-slate-300'}`}></div>
        <h3 className="font-black text-slate-900 uppercase tracking-tight">Shift Tracker</h3>
      </div>
      
      {!activeSession ? (
        <div>
          <p className="text-sm text-slate-500 mb-4 font-medium italic">You are currently offline. Ready to start your shift?</p>
          <button 
            onClick={handlePunchIn}
            className="w-full bg-black text-white py-4 rounded-xl font-black hover:bg-[#15803d] transition-all shadow-lg active:scale-95"
          >
            PUNCH IN NOW
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Current Session Started</p>
            <p className="text-xl font-black text-slate-800">
              {new Date(activeSession.punch_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button 
            onClick={handlePunchOut}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-black hover:bg-red-700 transition-all shadow-lg active:scale-95"
          >
            PUNCH OUT & FINISH
          </button>
        </div>
      )}
    </div>
  );
}