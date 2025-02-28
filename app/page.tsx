'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useStories, useVote } from './hooks/useStories'
import { useLogin } from './hooks/useAuth'

interface Story {
    id: number;
    title: string;
    description: string;
    author: string;
    votes: {
        count: number;
    }[];
}

export default function Page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [bookCode, setBookCode] = useState('');
    const [selectedStory, setSelectedStory] = useState<number | null>(null);
    const { data: stories, isLoading, error } = useStories()
    const voteMutation = useVote()
    const loginMutation = useLogin()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            const result = await loginMutation.mutateAsync(bookCode)
            setIsLoggedIn(true)
            toast.success('Đăng nhập thành công!')
        } catch (err) {
            console.error('Login failed:', err)
            toast.error(err instanceof Error ? err.message : 'Đăng nhập thất bại')
        }
    }

    const handleVote = async (storyId: number) => {
        if (!bookCode) return

        try {
            await voteMutation.mutateAsync({ storyId, bookCode })
            toast.success('Bầu chọn thành công!')
        } catch (err) {
            console.error('Failed to vote:', err)
            toast.error(err instanceof Error ? err.message : 'Không thể bầu chọn')
        }
    }

    const handleLogout = () => {
        setIsLoggedIn(false);
        setBookCode('');
        setSelectedStory(null);
    };

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-950 to-black text-white">
            <div className="absolute top-4 right-4 flex items-center gap-4">
                {isLoggedIn && (
                    <>
                        <p className="text-white/80">Mã của bạn: {bookCode}</p>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-700 rounded-lg hover:bg-red-800 transition"
                        >
                            Đăng xuất
                        </button>
                    </>
                )}
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-center text-5xl font-bold mb-8 animate-pulse">
                    📚 Sát nhân đồ tể
                </h1>

                {!isLoggedIn && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl mb-8">
                        <h2 className="text-2xl font-semibold mb-6">Nhập mã ở cuốn sách của bạn</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={bookCode}
                                onChange={(e) => setBookCode(e.target.value)}
                                placeholder="Nhập mã"
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500 outline-none transition"
                            />
                            <button
                                onClick={handleLogin}
                                className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-red-800 rounded-lg font-semibold hover:opacity-90 transform hover:scale-105 transition"
                            >
                                Đăng nhập để bầu chọn
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-6">Bảng xếp hạng</h2>
                    <div className="grid gap-6">
                        {stories && stories.length > 0 &&
                            stories.sort((a, b) => b.votes[0]?.count - a.votes[0]?.count).map((story) => (
                                <div
                                    key={story.id}
                                    onClick={() => isLoggedIn && setSelectedStory(story.id)}
                                    className={`p-6 rounded-xl ${isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed'} transform hover:scale-102 transition
                                    ${
                                        selectedStory === story.id
                                            ? 'bg-gradient-to-r from-red-600 to-red-800 border-2 border-white'
                                            : 'bg-black/30 hover:bg-black/40'
                                    }`}
                                >
                                    <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                                    <p className="text-white/80 mb-4">{story.description}</p>
                                    <div className="flex justify-between items-center text-sm text-white/60">
                                        <div className="flex items-center gap-2">
                                            <span>👤</span>
                                            <span>{story.author}</span>
                                        </div>
                                        {isLoggedIn && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleVote(story.id);
                                                    }}
                                                    disabled={voteMutation.isPending}
                                                    className="text-green-500 hover:text-green-700"
                                                >
                                                    👍
                                                </button>
                                                <span>{story.votes[0]?.count}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                    {isLoggedIn && selectedStory && (
                        <button
                            onClick={() => handleVote(selectedStory)}
                            className="w-full py-3 px-6 bg-gradient-to-r from-red-700 to-red-900 rounded-lg font-semibold hover:opacity-90 transition"
                        >
                            Bầu chọn
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
