"use client";

import { ForumComment, getCommentsByPostId } from "@/services/forumService";
import dayjs from "dayjs";
import { MessageCircleIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CommentsProps {
  postId: string;
  commentCount?: number;
}

export default function Comments({ postId, commentCount = 0 }: CommentsProps) {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedComments = await getCommentsByPostId(postId);
        setComments(fetchedComments);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <MessageCircleIcon className="w-4 h-4" />
          <span>Loading comments...</span>
        </div>
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-red-500 mb-2">
          <MessageCircleIcon className="w-4 h-4" />
          <span>Comments</span>
        </div>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 dark:border-gray-700">

      {/* Comments List */}
      <div className="max-h-60 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No comments yet from the users.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {comments.map((comment) => (
              <div key={comment.id} className="px-4 py-3">
                <div className="flex gap-3">
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/user/user-03.png"
                      alt={`${comment.username}'s avatar`}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    {/* User Info */}
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {comment.username}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {dayjs(comment.createdAt).format("MMM DD, YYYY • h:mm A")}
                      </span>
                    </div>
                    
                    {/* Comment Text */}
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {comment.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}