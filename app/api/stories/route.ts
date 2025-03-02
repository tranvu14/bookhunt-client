import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET() {
  const { data: stories, error } = await supabase
    .from("stories")
    .select(`
      *,
      votes: votes(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Không thể tải danh sách câu chuyện' }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
          'CDN-Cache-Control': 'no-store',
          'Edge-Control': 'no-store'
        }
      }
    );
  }

  return NextResponse.json(stories, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
      'CDN-Cache-Control': 'no-store',
      'Edge-Control': 'no-store'
    }
  });
}