import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export default async function createSupabaseClient(rememberMe = false) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key must be provided');
  }

  const cookieStore = await cookies();

  // กำหนด session storage persistence ตาม remember me
  const sessionStorageOptions = rememberMe 
    ? {
        // ถ้า remember me = true, ใช้ local storage persistence (เก็บนานขึ้น)
        storageKey: 'sb-' + new URL(supabaseUrl).hostname + '-auth-token',
        storage: {
          getItem: (key: string) => {
            return cookieStore.get(key)?.value ?? null;
          },
          setItem: (key: string, value: string) => {
            // ตั้งค่า cookie ให้หมดอายุใน 7 วัน สำหรับ remember me
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 7);
            cookieStore.set(key, value, {
              expires: expiryDate,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax'
            });
          },
          removeItem: (key: string) => {
            cookieStore.set(key, '', { expires: new Date(0) });
          },
        },
      }
    : {
        // ถ้า remember me = false, ใช้ session storage (หมดอายุเมื่อปิด browser)
        storageKey: 'sb-' + new URL(supabaseUrl).hostname + '-auth-token',
        storage: {
          getItem: (key: string) => {
            return cookieStore.get(key)?.value ?? null;
          },
          setItem: (key: string, value: string) => {
            // ตั้งค่า cookie แบบ session (หมดอายุเมื่อปิด browser)
            cookieStore.set(key, value, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax'
            });
          },
          removeItem: (key: string) => {
            cookieStore.set(key, '', { expires: new Date(0) });
          },
        },
      };

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      ...sessionStorageOptions,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}