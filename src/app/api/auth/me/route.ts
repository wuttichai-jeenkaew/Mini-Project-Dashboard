import { NextResponse } from "next/server";
import { requireAuth } from "@/app/utils/auth";

export async function GET() {
  const { user, error, supabase } = await requireAuth();
  
  if (error) {
    return error;
  }

  try {
    // Get user profile from database
    const { data: profile, error: profileError } = await supabase!
      .from("user_profile")
      .select("name")
      .eq("id", user!.id)
      .single();

    const userData = {
      id: user!.id,
      email: user!.email,
      name: profile?.name || null
    };

    return NextResponse.json({
      user: userData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 });
  }
}
