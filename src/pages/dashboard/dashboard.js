import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';
import AdminDeployment from '../../components/AdminDeployment';
import VerifyAttendance from '../../components/VerifyAttendance'; // নতুন ইমপোর্ট

export default function AdminProvision() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        // প্রোফাইল টেবিল থেকে রোল নিশ্চিত করা
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        setRole(profile?.role || user.app_metadata?.role || 'No Role Found');
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Super Admin</h1>
            <p className="text-slate-500 font-medium text-sm">System Management | Europe Division</p>
            <p className="text-xs font-bold text-blue-600 uppercase mt-1">Role: {role}</p>
          </div>
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition"
          >
            Sign Out
          </button>
        </header>

        {/* Welcome Card */}
        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl mb-8">
          <h2 className="text-xl font-bold mb-2">Welcome Back, {user?.email}</h2>
          <p className="opacity-90 font-medium text-sm">
            Your connection from Bangladesh is secure. All systems are operational.
          </p>
        </div>

        {/* Deployment Section (The Hard Core) */}
        <div className="mb-10">
           <AdminDeployment />
        </div>

        {/* Attendance Verification Section (New) */}
        <div className="mt-12 mb-10">
           <VerifyAttendance />
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {role === 'super_admin' ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-slate-800">User Management</h3>
              <p className="text-slate-500 text-sm mb-4 font-medium">
                Create manager accounts for European company sites and track activity.
              </p>
              <button 
                onClick={() => router.push('/admin/users')} 
                className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-black transition"
              >
                View All Users
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
              <p className="text-slate-400 font-bold italic">Standard Manager View</p>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Payroll Logs</h3>
            <p className="text-slate-500 text-sm mb-4 font-medium">
              Review history of job matching and payment distributions.
            </p>
            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-black transition">
               Generate Payroll Report
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}