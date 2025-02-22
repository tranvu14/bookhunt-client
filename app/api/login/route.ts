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
    return NextResponse.json({ error: 'Vui lòng nhập mã sách' }, { status: 400 });
  }

  // Check if the book code is valid
  const { data: codeRecord, error } = await supabase
    .from('book_codes')
    .select('*')
    .eq('unique_code', book_code)
    .eq('is_used', false)
    .single();

  if (error || !codeRecord) {
    return NextResponse.json({ error: 'Mã không hợp lệ hoặc đã được sử dụng' }, { status: 401 });
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
      return NextResponse.json({ error: 'Không thể tạo người dùng mới' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Đăng nhập thành công', 
      user,
      hasVoted: false 
    });
  }

  return NextResponse.json({ 
    message: 'Đăng nhập thành công', 
    user: existingUser,
    hasVoted: existingUser.has_voted 
  });
}
