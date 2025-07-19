import { NextResponse } from "next/server";
import { optionalAuth } from "@/app/utils/auth";

export async function GET() {
  const { user, error, supabase } = await optionalAuth();
  
  if (error) {
    return error;
  }

  try {
    // ดึงข้อมูล topic พร้อมจำนวน form ในแต่ละ topic
    const { data: topicData, error: topicError } = await supabase
      .from('topic')
      .select('id, name');

    if (topicError) {
      console.error("Error fetching topics:", topicError);
      return NextResponse.json({ error: topicError.message }, { status: 500 });
    }

    // ดึงข้อมูล form ทั้งหมด
    const { data: formData, error: formError } = await supabase
      .from('form')
      .select('topic');

    if (formError) {
      console.error("Error fetching form data:", formError);
      return NextResponse.json({ error: formError.message }, { status: 500 });
    }

    // สร้าง mapping ของ topic ID -> topic name
    const topicMap = topicData.reduce((acc, topic) => {
      acc[topic.id] = topic.name;
      return acc;
    }, {} as Record<string, string>);

    // นับจำนวน form ของแต่ละ topic โดยใช้ topic name
    const topicCounts = formData.reduce((acc, form) => {
      if (form.topic) {
        const topicName = topicMap[form.topic];
        if (topicName) {
          acc[topicName] = (acc[topicName] || 0) + 1;
        }
      }
      return acc;
    }, {} as Record<string, number>);

    // รวมข้อมูล topic และจำนวน form
    const statsData = topicData.map(topic => ({
      name: topic.name,
      count: topicCounts[topic.name] || 0
    }));

    // ดึงข้อมูลสถิติเพิ่มเติม
    const { count: totalForms, error: totalError } = await supabase
      .from('form')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      console.error("Error counting total forms:", totalError);
    }

    return NextResponse.json({
      data: {
        topicStats: statsData,
        totalForms: totalForms || 0,
        dateStats: []
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error in stats API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
