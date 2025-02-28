import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase"; // Import generated types
import { NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data: stories, error } = await supabase
    .from("stories")
    .select(`*, votes(count)`);

  if (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Không thể tải danh sách câu chuyện' }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  }

  return NextResponse.json(stories, {
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}