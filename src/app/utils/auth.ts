import { NextResponse } from "next/server";
import createSupabaseClient from "./supabase";

export async function requireAuth() {
  try {
    const supabase = await createSupabaseClient(); // ใช้ default value (false) สำหรับ rememberMe
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        user: null,
        error: NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนใช้งาน" }, { status: 401 }),
        supabase
      };
    }

    return {
      user,
      error: null,
      supabase
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unexpected error";
    return {
      user: null,
      error: NextResponse.json({ error: errorMessage }, { status: 500 }),
      supabase: null
    };
  }
}

export async function optionalAuth() {
  try {
    const supabase = await createSupabaseClient(); // ใช้ default value (false) สำหรับ rememberMe
    const { data: { user }, error } = await supabase.auth.getUser();

    // ไม่ return error ถ้าไม่มี user (optional)
    return {
      user: error ? null : user,
      error: null,
      supabase
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unexpected error";
    return {
      user: null,
      error: NextResponse.json({ error: errorMessage }, { status: 500 }),
      supabase: null
    };
  }
}
