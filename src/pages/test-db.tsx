import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TestDB() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, company_name')
        .limit(1);

      if (error) setError(error);
      else setData(data);
    }
    fetchData();
  }, []);

  if (error) return <div style={{color: 'red'}}>Error: {JSON.stringify(error)}</div>;
  if (!data) return <div>Connecting to Supabase...</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid green' }}>
      <h1>Connection Successful!</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}