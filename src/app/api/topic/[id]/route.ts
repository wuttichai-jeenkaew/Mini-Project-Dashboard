import { NextResponse } from 'next/server';
import createSupabaseClient from '../../../utils/supabase';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseClient();
    const body = await request.json();
    const name = body.name?.trim();
    const topicId = params.id;
    
    // ตรวจสอบ login
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนแก้ไขหัวข้อ' }, { status: 401 });
    }
    
    if (!name) {
      return NextResponse.json({ error: 'กรุณาระบุชื่อหัวข้อ' }, { status: 400 });
    }
    
    // ตรวจสอบชื่อซ้ำ (ยกเว้นตัวเอง)
    const { data: existing, error: errorCheck } = await supabase
      .from('topic')
      .select('id')
      .eq('name', name)
      .neq('id', topicId)
      .single();
    
    if (errorCheck && errorCheck.code !== 'PGRST116') {
      console.error("PATCH /api/topic/[id] - Check error:", errorCheck);
      return NextResponse.json({ error: errorCheck.message }, { status: 500 });
    }
    
    if (existing) {
      return NextResponse.json({ error: 'หัวข้อนี้มีอยู่แล้ว' }, { status: 409 });
    }
    
    // แก้ไขหัวข้อ
    const { data, error: errorUpdate } = await supabase
      .from('topic')
      .update({ name })
      .eq('id', topicId)
      .select('id, name')
      .single();
    
    if (errorUpdate) {
      console.error("PATCH /api/topic/[id] - Update error:", errorUpdate);
      return NextResponse.json({ error: errorUpdate.message }, { status: 500 });
    }
    
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/topic/[id] - Unexpected error:", error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดที่ไม่คาดคิด' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseClient();
    const topicId = params.id;
    
    // ตรวจสอบ login
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนลบหัวข้อ' }, { status: 401 });
    }
    
    // ลบข้อมูลในหัวข้อก่อน
    const { error: errorDeleteForm } = await supabase
      .from('form')
      .delete()
      .eq('topic', topicId);
    
    if (errorDeleteForm) {
      console.error("DELETE /api/topic/[id] - Delete form error:", errorDeleteForm);
      return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูลในหัวข้อ' }, { status: 500 });
    }
    
    // ลบหัวข้อ
    const { error: errorDelete } = await supabase
      .from('topic')
      .delete()
      .eq('id', topicId);
    
    if (errorDelete) {
      console.error("DELETE /api/topic/[id] - Delete error:", errorDelete);
      return NextResponse.json({ error: errorDelete.message }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'ลบหัวข้อสำเร็จ' }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/topic/[id] - Unexpected error:", error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดที่ไม่คาดคิด' }, { status: 500 });
  }
}
