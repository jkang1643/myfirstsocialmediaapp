import "./globals.css";
import { AuthProvider } from "../lib/contexts/AuthContext";

export const metadata = {
  title: "Social Media App",
  description: "A modern social media platform built with Next.js and Firebase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
