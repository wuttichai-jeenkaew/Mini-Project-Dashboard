
import createSupabaseClient from "@/app/utils/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // สร้าง Supabase client พร้อมส่ง rememberMe option
    const supabase = await createSupabaseClient(rememberMe);

    // Login
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session || !data.user) {
      return NextResponse.json({ error: error?.message || "Login failed" }, { status: 401 });
    }

    // สร้าง response - Supabase จะจัดการ cookies อัตโนมัติตาม rememberMe setting
    const response = NextResponse.json({ 
      user: { 
        id: data.user.id, 
        email: data.user.email 
      } 
    });

    return response;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
