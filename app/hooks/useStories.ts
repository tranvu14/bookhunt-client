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
      const res = await fetch('/api/stories')
      if (!res.ok) {
        throw new Error('Không thể tải danh sách câu chuyện')
      }
      return res.json()
    }
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
    onMutate: async ({ storyId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['stories'] })

      // Snapshot previous value
      const previousStories = queryClient.getQueryData<Story[]>(['stories'])

      // Optimistically update to the new value
      if (previousStories) {
        queryClient.setQueryData<Story[]>(['stories'], old => {
          return old?.map(story => {
            if (story.id === storyId) {
              return {
                ...story,
                votes: [{ count: (story.votes[0]?.count || 0) + 1 }]
              }
            }
            return story
          })
        })
      }

      // Return context with the snapshotted value
      return { previousStories }
    },
    // If mutation fails, use context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousStories) {
        queryClient.setQueryData(['stories'], context.previousStories)
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] })
    },
  })
} 