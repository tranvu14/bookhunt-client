import { useMutation } from '@tanstack/react-query'
import { Database } from '@/types/supabase'

type User = Database['public']['Tables']['users']['Row']

interface LoginResponse {
  message: string
  user: User
  hasVoted: boolean
}

export function useLogin() {
  return useMutation({
    mutationFn: async (bookCode: string) => {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_code: bookCode }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Đăng nhập thất bại')
      }
      
      const data: LoginResponse = await res.json()
      return data
    }
  })
} 