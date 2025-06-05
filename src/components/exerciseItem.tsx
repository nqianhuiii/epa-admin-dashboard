'use client';

import { ExerciseData } from "@/types/types";
import { DeleteExerciseForm } from "./DeleteExerciseForm";

interface ExerciseItemProps {
  exercise: ExerciseData;
  onEditClick: (exercise: ExerciseData) => void;
  onExerciseUpdate?: () => void;
}

export default function ExerciseItem({ exercise, onEditClick, onExerciseUpdate }: ExerciseItemProps) {
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

  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'practice':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pastyear':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
  }};

  return (
    <div className="border border-stroke dark:border-dark-3 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-medium text-dark dark:text-white">
              {exercise.title}
            </h3>
            <div className="flex items-center gap-2">
              {exercise.type && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(exercise.type)}`}>
                  {exercise.type}
                </span>
              )}
              {exercise.type?.toLowerCase() === 'practice' && exercise.chapter && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {exercise.chapter}
                </span>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <p>File: {exercise.fileName}</p>
            <p>Size: {formatFileSize(exercise.fileSize)}</p>
            <div className="text-body-sm text-dark-5 dark:text-dark-6">
                Created: {formatDate(exercise.uploadedAt)}
                {exercise.updatedAt && exercise.updatedAt !== exercise.uploadedAt && (
                  <span className="ml-2">
                    • Updated: {formatDate(exercise.updatedAt)}
                  </span>
                )}
              </div>
          </div>
        </div>
      
        <div className="flex items-center gap-2">
            <a
              href={exercise.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary border border-primary px-4 py-2 rounded text-sm font-medium hover:bg-primary hover:text-white transition-colors"
            >
              View PDF
            </a>
              
            <button
              onClick={() => onEditClick(exercise)}
              className="bg-white text-amber-500 border border-amber-500 px-4 py-2 rounded text-sm font-medium hover:bg-amber-500 hover:text-white transition-colors"
            >
              Edit
            </button>

          <DeleteExerciseForm
            exerciseId={exercise.id!}
            exerciseTitle={exercise.title}
            fileName={exercise.fileName}
          />
          </div>
      </div>
    </div>
  );
}