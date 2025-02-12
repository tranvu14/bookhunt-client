import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase"; // Import generated types
import { NextResponse } from "next/server";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data: stories, error } = await supabase.from("stories").select(`*, votes(count)`);

    if (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
    }

    return NextResponse.json(stories);
}