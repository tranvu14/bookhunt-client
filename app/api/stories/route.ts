import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data: stories, error } = await supabase
    .from("stories")
    .select(`
      *,
      votes: votes(count)
    `);

  if (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Không thể tải danh sách câu chuyện' }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
  }

  return NextResponse.json(stories, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
}