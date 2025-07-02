"use client";

import { useState } from 'react';
import { useAuth } from '../lib/hooks/useAuth';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { updateDocument } from '../lib/firebase/firebaseUtils';
import { formatDistanceToNow } from 'date-fns';
import { motion } from "framer-motion";
import { FaThumbsUp, FaComment, FaShare, FaBookmark, FaPaperclip, FaSmile, FaPaperPlane } from "react-icons/fa";

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
    <motion.div
      className="bg-white border border-gray-200 rounded-2xl p-6 mb-2 shadow-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.01, boxShadow: "0 4px 24px 0 rgba(90,84,255,0.08)" }}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.userPhotoURL || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDEwQzIyLjIwOTEgMTAgMjQgMTEuNzkwOSAyNCAxNEMyNCAxNi4yMDkxIDIyLjIwOTEgMTggMjAgMThDMTcuNzkwOSAxOCAxNiAxNi4yMDkxIDE2IDE0QzE2IDExLjc5MDkgMTcuNzkwOSAxMCAyMCAxMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI4IDMwQzI4IDI2LjY4NjMgMjQuNDE4MyAyNCAyMCAyNEMxNS41ODE3IDI0IDEyIDI2LjY4NjMgMTIgMzBIMjhaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='}
            alt={post.userName}
            className="w-10 h-10 rounded-full object-cover border-2 border-[#5a4fff]"
          />
          <div>
            <h3 className="font-bold text-sm text-gray-900">{post.userName}</h3>
            <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <button className="text-gray-300 hover:text-gray-500">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content */}
      <p className="text-[#333] text-[14px] leading-relaxed mb-3">
        {post.content.split(/(#[\w]+)/g).map((part, i) =>
          part.startsWith('#') ? (
            <span key={i} className="text-[#5a4fff] font-medium">{part}</span>
          ) : (
            part
          )
        )}
      </p>
      
      {/* Post Image */}
      {post.imageURL && (
        <img
          src={post.imageURL}
          alt="Post"
          className="w-full rounded-2xl mb-3 object-cover aspect-video"
        />
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition-colors ${
              isLiked ? 'text-[#5a4fff]' : 'text-[#777] hover:text-[#5a4fff]'
            }`}
          >
            <FaThumbsUp className="text-base" />
            <span className="text-sm">{likeCount}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-[#777] hover:text-[#5a4fff] transition-colors"
          >
            <FaComment className="text-base" />
            <span className="text-sm">{comments.length}</span>
          </button>
          <button className="flex items-center gap-1 text-[#777] hover:text-[#5a4fff] transition-colors">
            <FaShare className="text-base" />
          </button>
          <button className="flex items-center gap-1 text-[#777] hover:text-[#5a4fff] transition-colors">
            <FaBookmark className="text-base" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          {/* Add Comment */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={user?.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 flex items-center bg-gray-100 rounded-2xl px-3 py-2">
              <FaPaperclip className="text-[#5a4fff] mr-2" />
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment.."
                className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <FaSmile className="text-[#5a4fff] mx-2" />
              <button onClick={handleComment} className="ml-2">
                <FaPaperPlane className="text-[#5a4fff]" />
              </button>
            </div>
          </div>
          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.userPhotoURL || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDEwQzIyLjIwOTEgMTAgMjQgMTEuNzkwOSAyNCAxNEMyNCAxNi4yMDkxIDIyLjIwOTEgMTggMjAgMThDMTcuNzkwOSAxOCAxNiAxNi4yMDkxIDE2IDE0QzE2IDExLjc5MDkgMTcuNzkwOSAxMCAyMCAxMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI4IDMwQzI4IDI2LjY4NjMgMjQuNDE4MyAyNCAyMCAyNEMxNS41ODE3IDI0IDEyIDI2LjY4NjMgMTIgMzBIMjhaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-xs text-gray-900">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
} 