'use client';

import { TextbookData } from "@/types/types";
import { DeleteTextbookForm } from "./DeleteTextbookForm";
import { useState, useEffect } from "react";

interface TextbookItemProps {
  textbook: TextbookData;
  onEditClick: (textbook: TextbookData) => void;
  onTextbookUpdate?: () => void;
}

export default function TextbookItem({ textbook, onEditClick, onTextbookUpdate }: TextbookItemProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatDate = (date: Date) => {
    if (!mounted) return 'Loading...';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="border border-stroke dark:border-dark-3 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-medium text-dark dark:text-white mb-2">
              {textbook.title}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>File: {textbook.fileName}</p>
              <p>Size: {formatFileSize(textbook.fileSize)}</p>
              <div className="text-body-sm text-dark-5 dark:text-dark-6">
                Created: {formatDate(textbook.uploadedAt)}
                {textbook.updatedAt && textbook.updatedAt !== textbook.uploadedAt && (
                  <span className="ml-2">
                    • Updated: {formatDate(textbook.updatedAt)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={textbook.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary border border-primary px-4 py-2 rounded text-sm font-medium hover:bg-primary hover:text-white transition-colors"
              >
                View PDF
              </a>
              
              <button
                onClick={() => onEditClick(textbook)}
                className="bg-white text-amber-500 border border-amber-500 px-4 py-2 rounded text-sm font-medium hover:bg-amber-500 hover:text-white transition-colors"
              >
                Edit
              </button>

              <DeleteTextbookForm
                textbookId={textbook.id!}
                textbookTitle={textbook.title}
                fileName={textbook.fileName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}