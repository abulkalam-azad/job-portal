import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function AdminProvision() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const [users, setUsers] = useState([]);
  const [viewUsers, setViewUsers] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setRole(profile?.role || 'No Role Found');
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

 JavaScript
const fetchAllUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    console.log("Error Details:", error); // এটি কনসোলে এরর দেখাবে
    alert("Error: " + error.message);
  } else {
    setUsers(data);
    setViewUsers(true);
  }
};

  const handlePromote = async (userId) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'manager' })
      .eq('id', userId);

    if (error) {
      alert("Failed: " + error.message);
    } else {
      alert("User promoted!");
      fetchAllUsers(); 
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="bg-white p-6 rounded-2xl shadow-sm border mb-8 flex justify-between">
          <div>
            <h1 className="text-2xl font-black">Super d Admin</h1>
            <p className="text-blue-600 font-bold">Role: {role}</p>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl">Sign fdfOut</button>
        </header>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-lg mb-4">User Management</h3>
          
          {/* এই বাটনটি চেক করুন */}
          <button 
            onClick={viewUsers ? () => setViewUsers(false) : fetchAllUsers} 
            className={`px-6 py-2 rounded-xl font-bold ${viewUsers ? 'bg-gray-200' : 'bg-blue-600 text-white'}`}
          >
            {viewUsers ? 'CLOSE LIST' : 'VIEW ALL USERS'}
          </button>

          {/* টেবিল ডিসপ্লে */}
          {viewUsers && (
            <div className="mt-6 border-t pt-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase">
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b">
                      <td className="py-3 font-medium">{u.email}</td>
                      <td className="py-3 text-xs uppercase font-bold">{u.role}</td>
                      <td className="py-3 text-right">
                        {u.role === 'job_seeker' && (
                          <button onClick={() => handlePromote(u.id)} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold">Promote</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}