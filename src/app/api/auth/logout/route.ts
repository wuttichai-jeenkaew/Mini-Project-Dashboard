import { NextResponse } from "next/server";
import { requireAuth } from "@/app/utils/auth";

export async function POST() {
  try {
    const { error, supabase } = await requireAuth();
    
    if (error) {
      return error;
    }

    // ให้ Supabase จัดการ logout
    const { error: signOutError } = await supabase!.auth.signOut();
    
    if (signOutError) {
      return NextResponse.json({ error: signOutError.message }, { status: 500 });
    }

    // สร้าง response
    const response = NextResponse.json({ message: "Logged out successfully" });
    
    // ลบ Supabase cookies ทั้งหมด
    const projectId = process.env.SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'default';
    
    // ลบ cookies ที่เป็นไปได้ทั้งหมด
    const cookiesToDelete = [
      `sb-${projectId}-auth-token`,
      `sb-${projectId}-auth-token-refresh`,
      `sb-${projectId}-auth-token.0`,
      `sb-${projectId}-auth-token.1`,
      'access_token',
      'refresh_token'
    ];

    cookiesToDelete.forEach(cookieName => {
      // ลบ cookie จริงๆ
      response.cookies.delete({
        name: cookieName,
        path: "/",
      });
      
      // Set empty value และ expire ทันที (backup method)
      response.cookies.set(cookieName, "", {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        expires: new Date(0),
      });
    });
    
    return response;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
