'use client';
import { motion } from "framer-motion";
import { FaPlus, FaSearch } from "react-icons/fa";

export default function TopBar({ 
  onAddPost, 
  onRefreshHome 
}: { 
  onAddPost?: () => void;
  onRefreshHome?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 px-2 md:px-4 bg-white sticky top-0 z-20 border-b border-gray-100">
      {/* App Logo - Clickable to refresh home */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRefreshHome}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="bg-[#5a4fff] rounded-lg w-8 h-8 flex items-center justify-center text-white text-lg font-bold shadow-md">
          S
        </div>
        <span className="text-xl font-extrabold text-[#5a4fff] tracking-tight hidden sm:block">
          SocialApp
        </span>
      </motion.div>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full max-w-md">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search for friends, groups, pages"
          className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
        />
      </div>
      
      {/* Add New Post Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAddPost}
        className="flex items-center gap-2 bg-[#5a4fff] text-white px-5 py-2 rounded-2xl font-semibold shadow transition-all"
      >
        <FaPlus />
        <span>Add New Post</span>
      </motion.button>
    </div>
  );
} 