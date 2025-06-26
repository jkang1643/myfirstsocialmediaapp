"use client";

import { useState, useEffect } from 'react';
import { getDocuments } from '../lib/firebase/firebaseUtils';
import PostCard from './PostCard';
import { Loader2 } from 'lucide-react';

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

export default function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      }
    };

    fetchPosts();
  }, []);

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
        <p className="text-gray-500">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
} 