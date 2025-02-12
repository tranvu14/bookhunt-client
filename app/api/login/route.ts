import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const { book_code } = await request.json();

  if (!book_code) {
    return NextResponse.json({ error: 'Book code is required' }, { status: 400 });
  }

  // Check if the book code is valid
  const { data: codeRecord, error } = await supabase
    .from('book_codes')
    .select('*')
    .eq('unique_code', book_code)
    .eq('is_used', false)
    .single();

  if (error || !codeRecord) {
    return NextResponse.json({ error: 'Invalid or already used code' }, { status: 401 });
  }
  // Find the user with the book code
  const { data: existingUser, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('book_code', book_code)
    .single();

  if (!existingUser) {
    // Create a user with the book code and authenticated session
    const { data: user, error: userError } = await supabase
    .from('users')
    .insert([{ book_code, has_voted: false }])
    .select()
    .single();

    if (userError) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Login successful', user });
  }

  return NextResponse.json({ message: 'Login successful', existingUser });
}
