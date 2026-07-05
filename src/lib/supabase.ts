import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = 
  supabaseUrl && 
  !supabaseUrl.includes('your_supabase_project_url_here') && 
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('your_supabase_anon_key_here');

// Recursive proxy to safely handle arbitrary chainable database calls without throwing
const makeSafeProxy = (): any => {
  return new Proxy(() => {}, {
    get(target, prop) {
      if (prop === 'then') {
        return (onFulfilled: any, onRejected: any) => {
          return Promise.resolve({
            data: null,
            error: {
              message: 'Supabase credentials are not fully configured in your environment. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
            }
          }).then(onFulfilled, onRejected);
        };
      }
      return makeSafeProxy();
    },
    apply() {
      return makeSafeProxy();
    }
  });
};

// Initialize Supabase client safely
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : makeSafeProxy();

