import { NextResponse } from "next/server";
import { requireAuth } from "@/app/utils/auth";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { user, error, supabase } = await requireAuth();
  
  if (error) {
    return error;
  }

  const id = params.id;
  const body = await request.json();

  // Only allow updating these fields
  const { date, product_name, color, amount, unit } = body;

  const { error: updateError } = await supabase!
    .from("form")
    .update({ date, product_name, color, amount, unit })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { user, error, supabase } = await requireAuth();
  
  if (error) {
    return error;
  }

  const id = params.id;

  const { error: deleteError } = await supabase!
    .from("form")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
