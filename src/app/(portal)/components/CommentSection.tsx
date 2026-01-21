'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp, doc, updateDoc, increment, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import { Send, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

type Comment = {
    id: string;
    text: string;
    userId: string;
    userName: string;
    userAvatar: string;
    createdAt: Timestamp | null;
};

export default function CommentSection({ slug }: { slug: string }) {
    const { user, loginWithGoogle } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Real-time listener for comments
        const q = query(
            collection(db, 'posts_stats', slug, 'comments'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Comment[];
            setComments(commentsData);
        });

        return () => unsubscribe();
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, 'posts_stats', slug, 'comments'), {
                text: newComment.trim(),
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userAvatar: user.photoURL || '',
                createdAt: serverTimestamp()
            });

            // Increment comment count in parent doc
            const parentDocRef = doc(db, 'posts_stats', slug);
            await updateDoc(parentDocRef, {
                commentCount: increment(1)
            }).catch(async (err) => {
                // If parent doc doesn't exist yet (e.g. no votes yet), create it
                if (err.code === 'not-found') {
                    await setDoc(parentDocRef, {
                        helpful: 0,
                        not_helpful: 0,
                        commentCount: 1
                    });
                }
            });

            setNewComment('');
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('コメントを削除してもよろしいですか？')) return;

        try {
            // Delete the comment document
            await deleteDoc(doc(db, 'posts_stats', slug, 'comments', commentId));

            // Decrement comment count in parent doc
            const parentDocRef = doc(db, 'posts_stats', slug);
            await updateDoc(parentDocRef, {
                commentCount: increment(-1)
            });
        } catch (error: any) {
            console.error("Error deleting comment:", error);
            alert(`削除に失敗しました: ${error.message}`);
        }
    };

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Comments
                <span className="text-sm font-normal text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">
                    {comments.length}
                </span>
            </h3>

            {/* Comment Form */}
            <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                {user ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="text-sm text-neutral-400">
                                    Logged in as: <span className="text-neutral-200 font-bold">{user.displayName || 'Anonymous'}</span>
                                    {user.email && <span className="text-neutral-500 text-xs ml-2">({user.email})</span>}
                                </div>
                            </div>
                            <button
                                onClick={() => auth.signOut()}
                                className="text-xs text-neutral-500 hover:text-white transition-colors underline"
                            >
                                Sign out
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    {user.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || "User"}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
                                            <UserIcon size={20} className="text-neutral-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="記事の感想や議論を投稿..."
                                        className="w-full bg-black/20 border border-neutral-700 rounded-lg p-3 text-neutral-200 focus:outline-none focus:border-emerald-500/50 transition-colors h-24 resize-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submitting || !newComment.trim()}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    <Send size={16} />
                                    {submitting ? 'Sending...' : 'Post Comment'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="text-center py-6 space-y-4">
                        <p className="text-neutral-400">コメントを投稿するにはログインが必要です</p>
                        <button
                            onClick={() => loginWithGoogle()}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-100 hover:bg-white text-neutral-900 rounded-full font-bold transition-colors cursor-pointer"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                            Sign in with Google
                        </button>
                    </div>
                )}
            </div>

            {/* Comment List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-center text-neutral-500 py-12">まだコメントはありません。最初のコメントを投稿しましょう！</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 group">
                            <div className="flex-shrink-0">
                                {comment.userAvatar ? (
                                    <Image
                                        src={comment.userAvatar}
                                        alt={comment.userName}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
                                        <UserIcon size={20} className="text-neutral-500" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow space-y-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-neutral-200 text-sm">{comment.userName}</span>
                                        <span className="text-xs text-neutral-500">
                                            {comment.createdAt?.toDate().toLocaleDateString('ja-JP')}
                                        </span>
                                    </div>
                                    {user && user.uid === comment.userId && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-neutral-500 hover:text-red-400 transition-colors text-xs cursor-pointer underline"
                                            title="削除する"
                                        >
                                            削除
                                        </button>
                                    )}
                                </div>
                                <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {comment.text}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
