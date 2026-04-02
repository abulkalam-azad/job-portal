import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) alert(error.message);
    else setUsers(data);
    setLoading(false);
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (id, email) => {
    if (confirm(`Are you sure you want to delete ${email}?`)) {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) alert(error.message);
      else fetchUsers(); // Refresh the list
    }
  };

  // --- TOGGLE ROLE FUNCTION ---
  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'super_admin' ? 'manager' : 'super_admin';
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', id);
    
    if (error) alert(error.message);
    else fetchUsers(); // Refresh the list
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <button onClick={() => router.push('/admin')} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px' }}>
        ← Back to Dashboard
      </button>
      
      <h1 style={{ color: '#1e293b' }}>User Management</h1>
      <p style={{ color: '#64748b' }}>Manage site managers and administrative roles.dd</p>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Email</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Role</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px' }}>{user.email}</td>
                <td style={{ padding: '12px' }}>
                  <button 
                    onClick={() => toggleRole(user.id, user.role)}
                    style={{ 
                      backgroundColor: user.role === 'super_admin' ? '#dcfce7' : '#dbeafe', 
                      color: user.role === 'super_admin' ? '#166534' : '#1e40af',
                      border: 'none', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' 
                    }}
                  >
                    {user.role.toUpperCase()}
                  </button>
                </td>
                <td style={{ padding: '12px' }}>
                  <button 
                    onClick={() => handleDelete(user.id, user.email)}
                    style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}