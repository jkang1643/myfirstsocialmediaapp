"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import SignInWithGoogle from "../components/SignInWithGoogle";
import TabNavigation from "../components/TabNavigation";
import HomeFeed from "../components/HomeFeed";
import Profile from "../components/Profile";
import CreatePost from "../components/CreatePost";

export default function Home() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [mounted, setMounted] = useState(false);

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
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome to SocialApp
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Connect with friends and share your moments
          </p>
          <SignInWithGoogle />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white min-h-screen shadow-lg">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="p-4">
          {activeTab === "home" && <HomeFeed />}
          {activeTab === "profile" && <Profile />}
          {activeTab === "create" && <CreatePost />}
        </main>
      </div>
    </div>
  );
}
