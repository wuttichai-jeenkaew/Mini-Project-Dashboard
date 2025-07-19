import { NextRequest, NextResponse } from "next/server";
import createSupabaseClient from "@/app/utils/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: "กรุณาระบุอีเมล" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "รูปแบบอีเมลไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createSupabaseClient();

    // Use Supabase's built-in password reset functionality
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/pages/reset_password`,
    });

    if (error) {
      console.error("Supabase reset password error:", error);
      return NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการส่งอีเมล กรุณาลองใหม่อีกครั้ง" },
        { status: 500 }
      );
    }

    // Log the password reset request for security audit
    try {
      // Check if user exists in our users table
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (user) {
        await supabase
          .from("password_reset_logs")
          .insert({
            user_id: user.id,
            email: email,
            ip_address: request.headers.get("x-forwarded-for") || 
                       request.headers.get("x-real-ip") || 
                       "unknown",
            user_agent: request.headers.get("user-agent") || "unknown",
            created_at: new Date().toISOString()
          });
      }
    } catch (logError) {
      // Log error but don't fail the request
      console.error("Reset log error:", logError);
    }

    // Return success message
    return NextResponse.json(
      { 
        message: "ลิงก์รีเซ็ตรหัสผ่านได้ถูกส่งไปยังอีเมลของคุณแล้ว",
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}


