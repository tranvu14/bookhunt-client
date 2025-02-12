import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase"; // Import generated types

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  const { book_code, story_id } = await req.json();

  if (!book_code || !story_id) {
    return NextResponse.json({ error: "Book code and story ID are required" }, { status: 400 });
  }

  // Check if the user exists and has not voted yet
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("book_code", book_code)
    .eq("has_voted", false)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "Invalid book code or already voted" }, { status: 403 });
  }

  // Insert the vote
  const { error: voteError } = await supabase.from("votes").insert([{ user_id: user.id, story_id }]);

  if (voteError) {
    console.log(voteError);
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 });
  }

  // Mark user as has_voted
  await supabase.from("users").update({ has_voted: true }).eq("id", user.id);

  return NextResponse.json({ message: "Vote submitted successfully" });
}


export async function GET() {
  const { data: votes, error } = await supabase.from("votes").select("*");
console.log(votes);

  return NextResponse.json(votes);
}