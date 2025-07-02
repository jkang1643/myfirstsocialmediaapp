"use client";

import { useState } from 'react';
import { useAuth } from '../lib/hooks/useAuth';
import { addDocument } from '../lib/firebase/firebaseUtils';
import { Image, Send, X } from 'lucide-react';
import { motion } from "framer-motion";

interface CreatePostProps {
  onPostCreated?: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB for base64)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setIsSubmitting(true);

    try {
      // Create post data with base64 image
      const postData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'Anonymous',
        userPhotoURL: user.photoURL || '',
        content: content.trim(),
        imageURL: imagePreview || '', // Store base64 image directly
        likes: [],
        comments: [],
        createdAt: new Date(),
      };

      // Add post to database
      await addDocument('posts', postData);

      // Reset form
      setContent('');
      setImageFile(null);
      setImagePreview('');
      
      // Call the callback function to refresh home page
      if (onPostCreated) {
        onPostCreated();
      }
      
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Create a Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Content */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5a4fff] resize-none bg-gray-50 text-gray-800"
            required
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded-2xl"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Image Upload */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
            <Image size={20} />
            <span>Add Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
          
          <span className="text-sm text-gray-500">
            {imageFile ? `${imageFile.name} (${(imageFile.size / 1024 / 1024).toFixed(1)}MB)` : 'Max 5MB'}
          </span>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-[#5a4fff] text-white rounded-2xl hover:bg-[#6c5fff] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 