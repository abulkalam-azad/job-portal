import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function VerifyAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingAttendance = async () => {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        id,
        punch_in,
        punch_out,
        user_id,
        profiles:user_id (full_name),
        job_matches:match_id (hourly_rate)
      `)
      .not('punch_out', 'is', null) // কাজ শেষ হয়েছে এমন
      .eq('is_verified', false); // এখনো ভেরিফাই হয়নি

    if (!error) setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingAttendance();
  }, []);

  const handleVerify = async (record) => {
    const notes = window.prompt("Manager Notes (Optional):", "Work verified successfully");
    
    // ঘণ্টা ক্যালকুলেট করা (টাকা চেক করার জন্য)
    const hours = Math.abs(new Date(record.punch_out) - new Date(record.punch_in)) / 36e5;
    const totalPay = (hours * record.job_matches?.hourly_rate).toFixed(2);

    const confirm = window.confirm(`Verify ${hours.toFixed(2)} hours? Total Pay: $${totalPay}`);

    if (confirm) {
      const { error } = await supabase
        .from('attendance')
        .update({ 
          is_verified: true,
          manager_notes: notes 
        })
        .eq('id', record.id);

      if (!error) {
        alert("Attendance Verified!");
        fetchPendingAttendance();
      }
    }
  };

  if (loading) return <p className="text-sm">Loading logs...</p>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mt-10">
      <div className="bg-slate-900 p-5 text-white">
        <h3 className="font-black text-lg uppercase tracking-tight">Timesheet Verification</h3>
      </div>
      
      <div className="p-6">
        {records.length === 0 ? (
          <p className="text-slate-400 italic text-center py-4">No pending attendance logs to verify.</p>
        ) : (
          <div className="space-y-4">
            {records.map((rec) => (
              <div key={rec.id} className="flex flex-col md:flex-row justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition">
                <div className="mb-4 md:mb-0">
                  <p className="font-black text-slate-900">{rec.profiles?.full_name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {new Date(rec.punch_in).toLocaleDateString()} | 
                    {new Date(rec.punch_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                    {new Date(rec.punch_out).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                
                <button 
                  onClick={() => handleVerify(rec)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-black transition-all shadow-md active:scale-95"
                >
                  VERIFY & APPROVE
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}