import "./globals.css";
import { AuthProvider } from "../lib/contexts/AuthContext";
import { HomeRefreshProvider } from "../lib/contexts/HomeRefreshContext";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";

export const metadata = {
  title: "Social Media App",
  description: "A modern social media platform built with Next.js and Firebase",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="bg-white min-h-screen">
        <AuthProvider>
          <HomeRefreshProvider>
            <div className="flex min-h-screen w-full">
              {/* Left Sidebar */}
              <aside className="hidden lg:flex flex-col w-[250px] bg-[#5a4fff] text-white p-0">
                <Sidebar />
              </aside>

              {/* Main Content */}
              <main className="flex-1 flex flex-col items-stretch bg-white px-0 md:px-6 py-6">
                {children}
              </main>

              {/* Right Sidebar */}
              <aside className="hidden xl:flex flex-col w-[300px] bg-white p-4 border-l border-gray-100">
                <RightSidebar />
              </aside>
            </div>
          </HomeRefreshProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
