import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const confirmed = window.confirm(`ইউজারকে কি ${newStatus} করতে চান?`);
    if (!confirmed) return;

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', userId);

    if (error) alert(error.message);
    else fetchUsers();
    setLoading(false);
  };

  const handleChangeRole = async (userId, userEmail, newRole) => {
    const confirmed = window.confirm(`${userEmail}-কে কি ${newRole} বানাতে চান?`);
    if (!confirmed) return;

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) alert(error.message);
    else fetchUsers();
  };

  const handleDelete = async (userId, userEmail) => {
    const confirmed = window.confirm(`${userEmail}-কে কি স্থায়ীভাবে মুছে ফেলতে চান?`);
    if (!confirmed) return;

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) alert(error.message);
    else fetchUsers();
  };

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">User Management</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Admin Control Center</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search user..."
              className="flex-1 md:w-64 bg-slate-900 border border-slate-800 text-white px-5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={fetchUsers} 
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
            >
              Sync
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/40 border-b border-slate-800">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">User Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Permissions</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-20">
                      <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-100">{u.email}</span>
                        {/* Copy ID Button */}
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(u.id);
                            alert('ID Copied to Clipboard!');
                          }}
                          className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-blue-400 mt-1 transition-colors w-fit font-mono"
                          title="Click to copy full ID"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                          ID: {u.id.substring(0, 8)}...
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border ${
                        u.role === 'super_admin' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleStatus(u.id, u.status)}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all border ${
                          u.status === 'inactive' 
                            ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'inactive' ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                        {u.status || 'active'}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {u.role !== 'super_admin' ? (
                          <>
                            <button
                              onClick={() => handleChangeRole(u.id, u.email, 'manager')}
                              className="bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border border-slate-700"
                            >
                              PROMOTE
                            </button>
                            <button 
                              onClick={() => handleDelete(u.id, u.email)}
                              className="bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border border-slate-700"
                            >
                              DELETE
                            </button>
                          </>
                        ) : (
                          <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest px-3 py-1.5">Master Access</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}