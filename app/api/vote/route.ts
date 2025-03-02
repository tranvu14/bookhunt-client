import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase"; // Import generated types

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Phương thức không được phép" }, { status: 405 });
  }

  const { book_code, story_id } = await req.json();

  if (!book_code || !story_id) {
    return NextResponse.json({ error: "Yêu cầu mã sách và ID câu chuyện" }, { status: 400 });
  }

  // Check if the user exists and has not voted yet
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("book_code", book_code)
    .eq("has_voted", false)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "Mã sách không hợp lệ hoặc đã bầu chọn" }, { status: 403 });
  }

  // Insert the vote
  const { error: voteError } = await supabase.from("votes").insert([{ user_id: user.id, story_id }]);

  if (voteError) {
    console.log(voteError);
    return NextResponse.json({ error: "Không thể gửi bầu chọn" }, { status: 500 });
  }

  // Mark user as has_voted
  await supabase.from("users").update({ has_voted: true }).eq("id", user.id);

  return NextResponse.json({ message: "Bầu chọn thành công" });
}

export async function GET() {
  const { data: votes, error } = await supabase.from("votes").select("*");
console.log(votes);

  return NextResponse.json(votes);
}