import createSupabaseClient from "@/app/utils/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseClient(); // ใช้ default value (false) สำหรับ rememberMe
    const body = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }
    if (typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Register user
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || "Register failed" }, { status: 400 });
    }

    // Insert profile
    const { error: profileError } = await supabase
      .from("user_profile")
      .insert({ id: data.user.id, name });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ user: { id: data.user.id, email: data.user.email, name } }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}
