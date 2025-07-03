"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import SignInWithGoogle from "../components/SignInWithGoogle";
import HomeFeed from "../components/HomeFeed";
import Profile from "../components/Profile";
import CreatePost from "../components/CreatePost";
import { motion } from "framer-motion";
import TopBar from "../components/TopBar";
import StoriesCarousel from "../components/StoriesCarousel";
import { useHomeRefresh } from "../lib/contexts/HomeRefreshContext";

export default function Home() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [mounted, setMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { refreshCount } = useHomeRefresh();

  useEffect(() => {
    setMounted(true);
    
    // Handle mobile-specific issues
    if (typeof window !== 'undefined') {
      // Prevent zoom on input focus (iOS)
      const preventZoom = (e: any) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          e.target.style.fontSize = '16px';
        }
      };
      
      document.addEventListener('focusin', preventZoom);
      
      return () => {
        document.removeEventListener('focusin', preventZoom);
      };
    }
  }, []);

  // Function to refresh home page
  const refreshHome = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab("home");
  };

  // Listen for refreshCount changes from context
  useEffect(() => {
    if (mounted) {
      refreshHome();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCount]);

  // Show loading state until component is mounted
  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#5a4fff]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#5a4fff] rounded-lg w-12 h-12 flex items-center justify-center text-white text-2xl font-bold shadow-md">S</div>
            <span className="text-2xl font-extrabold text-[#5a4fff] tracking-tight">SocialApp</span>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome to SocialApp
          </h1>
          <p className="text-center text-gray-500 mb-8 text-base">
            Connect with friends and share your moments
          </p>
          <div className="w-full flex flex-col gap-4">
            <SignInWithGoogle />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar is now only rendered in layout.tsx */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-2xl mx-auto bg-white min-h-screen shadow-lg flex-1"
      >
        <TopBar onAddPost={() => setActiveTab('create')} />
        <StoriesCarousel />
        <main className="p-4">
          {activeTab === "home" && <HomeFeed key={refreshKey} onRefresh={refreshHome} />}
          {activeTab === "profile" && <Profile />}
          {activeTab === "create" && <CreatePost onPostCreated={refreshHome} />}
        </main>
        {/* TabNavigation removed */}
      </motion.div>
    </div>
  );
}
