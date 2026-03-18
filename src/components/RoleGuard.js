// Role-Based Security Guard 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export function withRole(Component, allowedRole) {
  return function ProtectedPage(props) {
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Get role from user_metadata (set during signup)
        const currentRole = user.user_metadata?.role;

        if (currentRole === allowedRole) {
          setAuthorized(true);
        } else {
          // If a Job Seeker tries to enter the Company Dash, kick them to home
          router.push('/');
        }
      };

      checkUser();
    }, [router]);

    if (!authorized) {
      return (
        <div className="flex h-screen items-center justify-center bg-white">
          <div className="text-[#15803d] font-bold animate-pulse">
            Verifying Authorization...
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}