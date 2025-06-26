"use client";

import { useState } from 'react';
import { useAuth } from '../lib/hooks/useAuth';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { updateDocument } from '../lib/firebase/firebaseUtils';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhotoURL: string;
  content: string;
  imageURL?: string;
  likes: string[];
  comments: Comment[];
  createdAt: any;
}

interface Comment {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhotoURL?: string;
  content: string;
  createdAt: any;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.uid || '') || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(post.comments || []);

  const handleLike = async () => {
    if (!user) return;

    const newLikes = isLiked 
      ? post.likes?.filter(id => id !== user.uid) || []
      : [...(post.likes || []), user.uid];

    try {
      await updateDocument('posts', post.id, { likes: newLikes });
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleComment = async () => {
    if (!user || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.uid,
      userEmail: user.email || '',
      userName: user.displayName || 'Anonymous',
      content: newComment.trim(),
      createdAt: new Date(),
    };

    const updatedComments = [...comments, comment];

    try {
      await updateDocument('posts', post.id, { comments: updatedComments });
      setComments(updatedComments);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNow(dateObj, { addSuffix: true });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.userPhotoURL || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDEwQzIyLjIwOTEgMTAgMjQgMTEuNzkwOSAyNCAxNEMyNCAxNi4yMDkxIDIyLjIwOTEgMTggMjAgMThDMTcuNzkwOSAxOCAxNiAxNi4yMDkxIDE2IDE0QzE2IDExLjc5MDkgMTcuNzkwOSAxMCAyMCAxMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI4IDMwQzI4IDI2LjY4NjMgMjQuNDE4MyAyNCAyMCAyNEMxNS41ODE3IDI0IDEyIDI2LjY4NjMgMTIgMzBIMjhaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='}
            alt={post.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.userName}</h3>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content */}
      <p className="text-gray-900 mb-3">{post.content}</p>
      
      {/* Post Image */}
      {post.imageURL && (
        <img
          src={post.imageURL}
          alt="Post"
          className="w-full rounded-lg mb-3 object-cover max-h-96"
        />
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-sm">{likeCount}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={20} />
            <span className="text-sm">{comments.length}</span>
          </button>
          
          <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
            <Share size={20} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          {/* Add Comment */}
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <button
              onClick={handleComment}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Post
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.userPhotoURL || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDEwQzIyLjIwOTEgMTAgMjQgMTEuNzkwOSAyNCAxNEMyNCAxNi4yMDkxIDIyLjIwOTEgMTggMjAgMThDMTcuNzkwOSAxOCAxNiAxNi4yMDkxIDE2IDE0QzE2IDExLjc5MDkgMTcuNzkwOSAxMCAyMCAxMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI4IDMwQzI4IDI2LjY4NjMgMjQuNDE4MyAyNCAyMCAyNEMxNS41ODE3IDI0IDEyIDI2LjY4NjMgMTIgMzBIMjhaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 