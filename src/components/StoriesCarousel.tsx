'use client';
import { useEffect, useState } from 'react';
import { getDocuments } from '../lib/firebase/firebaseUtils';
import { motion } from "framer-motion";

interface UserStory {
  userId: string;
  userName: string;
  userPhotoURL: string;
}

export default function StoriesCarousel() {
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const posts = await getDocuments('posts');
        // Extract unique users who have posted
        const userMap: { [userId: string]: UserStory } = {};
        posts.forEach((post: any) => {
          if (post.userId && !userMap[post.userId]) {
            userMap[post.userId] = {
              userId: post.userId,
              userName: post.userName || post.userEmail || 'Unknown',
              userPhotoURL: post.userPhotoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.userName || 'U'),
            };
          }
        });
        setUserStories(Object.values(userMap));
      } catch (error) {
        setUserStories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserStories();
  }, []);

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex gap-4 min-w-max px-2">
        {loading ? (
          <span className="text-gray-400 text-sm">Loading stories...</span>
        ) : userStories.length === 0 ? (
          <span className="text-gray-400 text-sm">No stories yet</span>
        ) : userStories.map((story, idx) => (
          <motion.div
            key={story.userId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07, duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="bg-gradient-to-tr from-orange-400 via-pink-500 to-yellow-400 p-1 rounded-full">
              <div className="bg-white p-1 rounded-full">
                <img
                  src={story.userPhotoURL}
                  alt={story.userName}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white"
                />
              </div>
            </div>
            <span className="text-xs mt-2 text-gray-700 font-medium max-w-[60px] truncate text-center">
              {story.userName}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 