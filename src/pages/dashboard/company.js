import { withRole } from '../../components/RoleGuard';
import PostJobForm from '../../components/PostJobForm';
import CompanyJobList from '../../components/CompanyJobList';
import ApplicantList from '../../components/ApplicantList'; // নতুন ইমপোর্ট
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

function CompanyDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-black text-[#15803d]">JOB PORTAL | EMPLOYER</h1>
        <button onClick={handleLogout} className="text-sm font-bold text-red-500 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition">
          Logout
        </button>
      </nav>

      <div className="p-8 max-w-7xl mx-auto space-y-10">
        <header>
          <h2 className="text-4xl font-black text-slate-900">Employer Dashboard</h2>
          <p className="text-slate-500">Post new vacancies and review incoming applications.</p>
        </header>

        {/* প্রথম রো: জব পোস্ট এবং জব লিস্ট */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <PostJobForm />
          <CompanyJobList />
        </div>

        {/* দ্বিতীয় রো: এপ্লিক্যান্টদের তালিকা */}
        <div className="grid grid-cols-1">
          <ApplicantList />
        </div>
      </div>
    </div>
  );
}

export default withRole(CompanyDashboard, 'company');