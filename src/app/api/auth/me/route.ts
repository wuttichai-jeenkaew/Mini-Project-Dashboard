import { NextResponse } from "next/server";
import { requireAuth } from "@/app/utils/auth";

export async function GET() {
  const { user, error, supabase } = await requireAuth();
  
  if (error) {
    return error;
  }

  try {
    // Get user profile from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

    const userData = {
      id: user!.id,
      email: user!.email,
      name: profile?.name || null
    };

    return NextResponse.json({
      user: userData,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
