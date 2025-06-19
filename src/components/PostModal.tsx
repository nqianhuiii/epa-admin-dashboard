// components/PostModal.tsx
"use client";

import { AppPost } from "@/services/forumService";
import dayjs from "dayjs";
import { HeartIcon, MessageCircleIcon, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import Comments from "./CommentSection";
import ImageCarousel from "./ImageCarousel";


interface PostModalProps {
  post: AppPost;
  onClose: () => void;
}

export default function PostModal({ post, onClose }: PostModalProps) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Close modal when clicking on backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex items-start justify-center px-4 pt-25"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[85vh] overflow-y-auto my-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[70] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700  transition-colors "
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Post Header */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/images/user/user-03.png"
                  alt={`${post.username}'s avatar`}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* User Info */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {post.username}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {dayjs(post.createdAt).format("MMMM DD, YYYY • h:mm A")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-3">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {post.title}
          </h2>
          
          {/* Description */}
          <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
            {post.description}
          </p>
        </div>

        {/* Post Images - Using ImageCarousel */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="px-4 pb-3">
            <ImageCarousel
              images={post.imageUrls}
              alt="Post image"
              width={600}
              height={400}
              imageClassName="max-h-96"
              showControls={true}
              showDots={true}
              showCounter={true}
            />
          </div>
        )}

        {/* Post Stats */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              {/* Likes */}
              <div className="flex items-center gap-1">
                <HeartIcon className="w-4 h-4" />
                <span>{post.likedBy?.length ?? 0} likes</span>
              </div>
              
              {/* Comments */}
              <div className="flex items-center gap-1">
                <MessageCircleIcon className="w-4 h-4" />
                <span>{post.commentCount ?? 0} comment{(post.commentCount ?? 0) !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <Comments postId={post.id} commentCount={post.commentCount} />
      </div>
    </div>
  );
}