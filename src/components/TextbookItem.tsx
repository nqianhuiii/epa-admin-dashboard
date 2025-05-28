'use client';
import { useTransition } from "react";
import { deleteTextbookAction } from "@/app/actions/textbookAction";
import { TextbookData } from "@/types/types";

interface TextbookItemProps {
  textbook: TextbookData;
}

export default function TextbookItem({ textbook }: TextbookItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete "${textbook.title}"?`)) return;
    
    startTransition(async () => {
      if (textbook.id) {
        const result = await deleteTextbookAction(textbook.id);
        if (!result.success) {
          alert(result.error || 'Failed to delete textbook');
        }
      }
    });
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatDate = (date: Date) => {
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
          <h3 className="font-medium text-dark dark:text-white mb-2">
            {textbook.title}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <p>File: {textbook.fileName}</p>
            <p>Size: {formatFileSize(textbook.fileSize)}</p>
            <p>Uploaded: {formatDate(textbook.uploadedAt)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <a
            href={`https://res.cloudinary.com/do9emnqcm/raw/upload/v1748439379/textbook/mm2axsqjjqufs0qtmxo6.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary/90 transition-colors"
            >
            View PDF
          </a>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
