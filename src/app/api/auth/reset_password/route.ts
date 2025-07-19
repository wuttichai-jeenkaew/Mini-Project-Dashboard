import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { access_token, newPassword } = await request.json();

    // Validate input
    if (!access_token || !newPassword) {
      return NextResponse.json(
        { error: "Access token และรหัสผ่านใหม่จำเป็นต้องระบุ" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      );
    }

    // Create Supabase Admin client for server-side operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key for admin operations
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify the access token and get user
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(access_token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Token ไม่ถูกต้องหรือหมดอายุ" },
        { status: 400 }
      );
    }

    // Update password using Admin API
    const { data, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการอัปเดตรหัสผ่าน" },
        { status: 500 }
      );
    }

    // Log successful password reset
    try {
      if (user) {
        // Log the password reset completion
        await supabaseAdmin
          .from("password_reset_logs")
          .insert({
            user_id: user.id,
            email: user.email,
            action: "password_reset_completed",
            ip_address: request.headers.get("x-forwarded-for") || 
                       request.headers.get("x-real-ip") || 
                       "unknown",
            user_agent: request.headers.get("user-agent") || "unknown",
            created_at: new Date().toISOString()
          });
      }
    } catch (logError) {
      console.error("Reset completion log error:", logError);
    }

    return NextResponse.json(
      { 
        message: "รีเซ็ตรหัสผ่านสำเร็จ",
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}


