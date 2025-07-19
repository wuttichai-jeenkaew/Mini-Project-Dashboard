import { NextResponse } from "next/server";
import { requireAuth, optionalAuth } from "@/app/utils/auth";

export async function GET(request: Request) {
  const { error, supabase } = await optionalAuth();
  
  if (error) {
    return error;
  }

  // รับข้อมูล user จาก middleware (ถ้าต้องการ)
  // const userId = request.headers.get('user-id');
  
  // Get pagination params from query string
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const search = searchParams.get("search") || "";
  const topic = searchParams.get("topic") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  console.log("API Query params:", { page, pageSize, search, topic, startDate, endDate });

  try {
    let query = supabase.from("form").select("*", { count: "exact" });

    // Add topic filter if topic exists
    // สมมติว่าตาราง form มีฟิลด์ที่เชื่อมโยงกับ topic
    // ถ้าไม่มีฟิลด์ topic ให้ comment บรรทัดนี้ออก
    if (topic.trim()) {
      query = query.eq("topic", topic); // หรือใช้ชื่อฟิลด์ที่ถูกต้อง
    }

    // Add search filter if search query exists
    if (search.trim()) {
      // ใช้ exact word match - เฉพาะคำที่เริ่มต้นด้วยคำค้นหา หรือ หลังเว้นวรรค
      query = query.or(
        `product_name.ilike.${search}%,product_name.ilike.% ${search}%`
      );
    }

    // Add date range filter if dates exist
    if (startDate.trim()) {
      query = query.gte("date", startDate);
    }
    if (endDate.trim()) {
      query = query.lte("date", endDate);
    }

    console.log("Executing query for topic:", topic);
    
    const { data, error, count } = await query
      .order("date", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Query result:", { dataCount: data?.length, total: count });

    return NextResponse.json({ data, page, pageSize, total: count });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error, supabase } = await requireAuth();
  
  if (error) {
    return error;
  }

  try {
    const body = await request.json();
    const { date, product_name, color, amount, unit, topic } = body;

    const { data, error: insertError } = await supabase!
      .from("form")
      .insert([
        {
          date,
          product_name,
          color,
          amount,
          unit,
          topic: topic || null,
          // created_by: user!.id // user not used
        }
      ])
      .select();

    if (insertError) {
      console.error("Supabase error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ data: data[0] }, { status: 201 });
  } catch (err: unknown) {
    console.error("API Error:", err);
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
