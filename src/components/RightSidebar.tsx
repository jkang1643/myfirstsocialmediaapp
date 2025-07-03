'use client';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { FaPlus, FaGift, FaGoogle } from "react-icons/fa";
import { getDocuments } from '../lib/firebase/firebaseUtils';

const profileActivity = {
  followers: 1158,
  growth: 23,
  avatars: [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/women/65.jpg",
    "https://randomuser.me/api/portraits/men/45.jpg",
    "https://randomuser.me/api/portraits/women/22.jpg",
  ],
};

const upcomingEvents = [
  { name: "Friend's Birthday", date: "Jun 25, 2028", icon: <FaGift className="text-[#5a4fff]" /> },
];

export default function RightSidebar() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersFromPosts = async () => {
      try {
        const posts = await getDocuments('posts');
        // Extract unique users from posts
        const userMap: { [userId: string]: any } = {};
        posts.forEach((post: any) => {
          if (post.userId && !userMap[post.userId]) {
            userMap[post.userId] = {
              userId: post.userId,
              displayName: post.userName || post.userEmail || 'Unknown',
              email: post.userEmail || '',
              photoURL: post.userPhotoURL || '',
            };
          }
        });
        setUsers(Object.values(userMap));
      } catch (error) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersFromPosts();
  }, []);

  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-8"
    >
      {/* Friend Suggestions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[16px] text-[#333]">Friend Suggestions</h3>
          <button className="text-xs text-[#5a4fff] font-semibold">See All</button>
        </div>
        <div className="flex flex-col gap-3">
          {loading ? (
            <span className="text-gray-400 text-sm">Loading...</span>
          ) : users.length === 0 ? (
            <span className="text-gray-400 text-sm">No users found</span>
          ) : users.map((user, idx) => (
            <motion.div
              key={user.id || user.email || idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07, duration: 0.3, ease: "easeOut" }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              {/* Avatar with colored ring */}
              <div className="bg-gradient-to-tr from-orange-400 via-pink-500 to-yellow-400 p-1 rounded-full">
                <div className="bg-white p-1 rounded-full">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}`}
                    alt={user.displayName || user.email || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                </div>
              </div>
              {/* User info vertical */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="font-semibold text-sm text-[#222] flex items-center gap-1">
                  {user.displayName || user.email || 'Unknown'}
                  {user.providerId === 'google.com' && <FaGoogle className="text-[#4285F4] ml-1" title="Google user" />}
                </div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </div>
              <button className="bg-[#5a4fff] text-white rounded-full p-2 hover:bg-[#6c5fff] transition">
                <FaPlus />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Profile Activity */}
      <div className="bg-[#eef3ff] rounded-2xl p-5 flex flex-col items-center text-[#222]">
        <div className="flex -space-x-3 mb-2">
          {profileActivity.avatars.map((avatar, idx) => (
            <img
              key={idx}
              src={avatar}
              alt="Follower"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
              style={{ zIndex: 10 - idx }}
            />
          ))}
        </div>
        <div className="font-bold text-lg mb-1">+{profileActivity.followers} Followers</div>
        <div className="text-xs text-green-600 font-semibold mb-1">↑ {profileActivity.growth}% vs last month</div>
        <div className="text-xs text-gray-500 text-center">You gained a substantial amount of followers this month!</div>
      </div>
      {/* Upcoming Events */}
      <div>
        <h3 className="font-bold text-[16px] text-[#333] mb-3">Upcoming Events</h3>
        <div className="flex flex-col gap-3">
          {upcomingEvents.map((event, idx) => (
            <div key={event.name} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100">
              <div className="bg-[#eef3ff] rounded-full p-2 flex items-center justify-center">
                {event.icon}
              </div>
              <div>
                <div className="font-semibold text-sm text-[#222]">{event.name}</div>
                <div className="text-xs text-gray-400">{event.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 