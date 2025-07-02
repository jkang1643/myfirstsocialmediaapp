"use client";

import { useState, useEffect } from 'react';
import { getDocuments } from '../lib/firebase/firebaseUtils';
import PostCard from './PostCard';
import { Loader2, RefreshCw } from 'lucide-react';
import { motion } from "framer-motion";

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

interface HomeFeedProps {
  onRefresh?: () => void;
}

export default function HomeFeed({ onRefresh }: HomeFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      const postsData = await getDocuments('posts') as Post[];
      // Sort posts by creation date (newest first)
      const sortedPosts = postsData.sort((a: Post, b: Post) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    if (onRefresh) {
      onRefresh();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-500 mb-4">Be the first to share something!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 mx-auto px-4 py-2 bg-[#5a4fff] text-white rounded-lg hover:bg-[#6c5fff] disabled:bg-gray-300 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </motion.button>
      </div>

      {/* Posts */}
      <motion.div
        className="flex flex-col gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
      >
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
            }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 