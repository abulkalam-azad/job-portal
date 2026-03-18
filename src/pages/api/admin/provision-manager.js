import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  // 1. Get the Authorization Header
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No authorization header' });

  const token = authHeader.split(' ')[1];

  try {
    // 2. VERIFY: Is this a valid user session?
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) throw new Error('Invalid token');

    // 3. AUTHORIZE: Is this user a Super Admin?
    // We check BOTH the profile and app_metadata for security
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isSuperAdmin = profile?.role === 'super_admin' || user.app_metadata?.role === 'super_admin';

    if (profileError || !isSuperAdmin) {
      throw new Error('Unauthorized: Only Super Admins can provision managers');
    }

    // 4. PROVISION: Create the new Manager account
    const { email, password, full_name } = req.body;

    const { data: newAuthUser, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      // user_metadata is for the user's settings, app_metadata is for their PERMISSIONS
      user_metadata: { full_name },
      app_metadata: { role: 'manager' } 
    });

    if (createAuthError) throw createAuthError;

    // 5. SYNC: Add to public.profiles table
    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert([{
        id: newAuthUser.user.id,
        email,
        role: 'manager', // Forces the role to manager
        full_name,
        created_by: user.id 
      }]);

    if (insertError) throw insertError;

    return res.status(200).json({ message: 'Manager created successfully', userId: newAuthUser.user.id });

  } catch (error) {
    console.error('Admin Error:', error.message);
    return res.status(403).json({ error: error.message });
  }
}