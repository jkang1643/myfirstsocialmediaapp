'use client';
import { motion } from "framer-motion";
import { FaPlus, FaGift } from "react-icons/fa";

const friendSuggestions = [
  { name: "Julia Smith", handle: "@juliasmith", avatar: "https://randomuser.me/api/portraits/women/10.jpg" },
  { name: "Vermillion D. Gray", handle: "@vermilliongray", avatar: "https://randomuser.me/api/portraits/men/11.jpg" },
  { name: "Mai Senpai", handle: "@maisenpai", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
  { name: "Azunyan U. Wu", handle: "@azunyandesu", avatar: "https://randomuser.me/api/portraits/women/13.jpg" },
  { name: "Oarack Babama", handle: "@obama21", avatar: "https://randomuser.me/api/portraits/men/14.jpg" },
];

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
          {friendSuggestions.map((user, idx) => (
            <motion.div
              key={user.handle}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07, duration: 0.3, ease: "easeOut" }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
              <div className="flex-1">
                <div className="font-semibold text-sm text-[#222]">{user.name}</div>
                <div className="text-xs text-gray-400">{user.handle}</div>
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