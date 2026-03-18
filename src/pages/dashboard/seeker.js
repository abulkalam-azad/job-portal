import { withRole } from '../../components/RoleGuard';
import JobFeed from '../../components/JobFeed';
import MyApplications from '../../components/MyApplications';
import AttendanceSystem from '../../components/AttendanceSystem'; // ১. ইমপোর্ট করুন
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

function SeekerDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-black text-[#15803d]">CAREER PORTAL</h1>
        <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg">
          Logout
        </button>
      </nav>

      <div className="p-8 max-w-6xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-slate-900">Worker Dashboard</h2>
          <p className="text-slate-500">Track your applications and daily work sessions.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* ২. এটেনডেন্স সিস্টেম এখানে বসান */}
            {/* এটি অটোমেটিক চেক করবে ইউজার Deployed কি না */}
            <AttendanceSystem /> 
            
            <h3 className="text-lg font-bold text-slate-700">Available Opportunities</h3>
            <JobFeed />
          </div>
          
          <div className="lg:col-span-1">
            <MyApplications />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRole(SeekerDashboard, 'job_seeker');