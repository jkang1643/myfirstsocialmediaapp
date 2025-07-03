'use client';
import { motion } from "framer-motion";
import { FaHome, FaList, FaUserFriends, FaCube, FaCreditCard, FaCog, FaCommentDots, FaStar, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../lib/hooks/useAuth";
import Link from "next/link";
import { useHomeRefresh } from "../lib/contexts/HomeRefreshContext";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Feed", icon: <FaHome />, href: "/", tab: "home" },
  { label: "Stories", icon: <FaList />, href: "/stories", tab: "stories" },
  { label: "Friends", icon: <FaUserFriends />, href: "/friends", tab: "friends" },
  { label: "APIs", icon: <FaCube />, href: "/apis", tab: "apis" },
  { label: "Subscription", icon: <FaCreditCard />, href: "/subscription", tab: "subscription" },
  { label: "Settings", icon: <FaCog />, href: "/settings", tab: "settings" },
  { label: "Help & Support", icon: <FaCommentDots />, href: "/help", tab: "help" },
];

interface SidebarProps {
  onRefreshHome?: () => void;
}

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const { triggerRefresh } = useHomeRefresh();
  const pathname = usePathname();
  const router = useRouter();

  const handleFeedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      triggerRefresh();
    } else {
      router.push("/");
    }
  };

  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col h-full min-h-screen"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 mt-2 cursor-pointer select-none" onClick={triggerRefresh} title="Return to Home">
        <div className="bg-white rounded-lg w-10 h-10 flex items-center justify-center text-[#5a4fff] text-xl font-bold shadow">S</div>
        <span className="text-xl font-extrabold tracking-tight">SocialApp</span>
      </div>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-[#6c5fff] text-white placeholder-white rounded-lg px-4 py-2 outline-none focus:bg-[#7d6fff] transition"
        />
      </div>
      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2 mb-6">
        {/* Feed button with refresh logic */}
        <a
          href="/"
          onClick={handleFeedClick}
          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative text-white hover:bg-[#6c5fff] focus:outline-none cursor-pointer font-medium text-base"
        >
          <span className="text-lg"><FaHome /></span>
          <span>Feed</span>
        </a>
        {/* Other nav items */}
        {navItems.slice(1).map((item, idx) => (
          <Link href={item.href} key={item.label} legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.04, backgroundColor: "#6c5fff" }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative text-white hover:bg-[#6c5fff] focus:outline-none cursor-pointer"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-base">{item.label}</span>
            </motion.a>
          </Link>
        ))}
      </nav>
      {/* Go Pro Button */}
      <motion.button
        whileHover={{ scale: 1.05, borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.08)" }}
        className="mt-auto mb-4 border border-white rounded-2xl px-4 py-2 flex items-center gap-2 justify-center text-white font-semibold transition-all"
      >
        <FaStar className="text-lg" /> Go Pro
      </motion.button>
      {/* User Profile Card */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#6c5fff] mt-2">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <img
            src={user?.photoURL || "https://randomuser.me/api/portraits/men/32.jpg"}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm">{user?.displayName || user?.email || "Guest"}</div>
          <div className="text-xs text-white/80">{user?.email || ""}</div>
        </div>
        <button className="text-white hover:text-red-200 transition" onClick={signOut} title="Sign out">
          <FaSignOutAlt />
        </button>
      </div>
    </motion.div>
  );
} 