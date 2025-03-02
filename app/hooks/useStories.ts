import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Database } from '@/types/supabase'

type Story = Database['public']['Tables']['stories']['Row'] & {
  votes: {
    count: number
  }[]
}

// Fetch stories
export function useStories() {
  return useQuery<Story[]>({
    queryKey: ['stories'],
    queryFn: async () => {
      const res = await fetch('/api/stories?' + new Date().getTime(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        next: { 
          revalidate: 0,
          tags: ['stories']
        }
      })
      if (!res.ok) {
        throw new Error('Không thể tải danh sách câu chuyện')
      }
      return res.json()
    },
    
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0,
    gcTime: 0, // Changed from cacheTime (deprecated)
  })
}

// Vote mutation
export function useVote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ storyId, bookCode }: { storyId: number, bookCode: string }) => {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ story_id: storyId, book_code: bookCode }),
      })
      if (!res.ok) {
        throw new Error('Không thể bầu chọn')
      }
      return res.json()
    },
    // When mutate is called:

    // If mutation fails, use context returned from onMutate to roll back
    onError: (err, variables, context) => {
      console.log(err)
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] })
    },
  })
} 