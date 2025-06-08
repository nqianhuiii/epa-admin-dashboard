"use client";

import { useState } from "react";
import { QuizSet } from "@/types/types";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import QuizForm from "./QuizForm";
import { DeleteQuizForm } from "./DeleteQuizForm";

interface QuizListProps {
  initialQuizzes: QuizSet[];
}

export default function QuizList({ initialQuizzes }: QuizListProps) {
  const [quizzes, setQuizzes] = useState<QuizSet[]>(initialQuizzes);
  const [editingQuiz, setEditingQuiz] = useState<QuizSet | null>(null);
  const [viewingQuiz, setViewingQuiz] = useState<QuizSet | null>(null);

  const handleEditSuccess = () => {
    setEditingQuiz(null);
    setViewingQuiz(null);
    window.location.reload();
  };

  const handleCancel = () => {
    setEditingQuiz(null);
    setViewingQuiz(null);
  };

  const formatDateTime = (timestamp: any) => {
    let date;
    if (timestamp?.toDate) {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQuestionCount = (questions: any[]) => {
    return questions?.length || 0;
  };

  const getQuestionCountText = (count: number) => {
    return count === 1 ? '1 question' : `${count} questions`;
  };

  if (editingQuiz) {
    return (
      <ShowcaseSection title="Edit Quiz Set" className="space-y-5.5 !p-6.5">
        <QuizForm
          quizset={editingQuiz}
          onSuccess={handleEditSuccess}
          onCancel={handleCancel}
          isEditing={true}
        />
      </ShowcaseSection>
    );
  }

  if (viewingQuiz) {
    return (
      <ShowcaseSection title="View Quiz Set" className="space-y-5.5 !p-6.5">
        <QuizForm
          quizset={viewingQuiz}
          onSuccess={handleEditSuccess}
          onCancel={handleCancel}
          isEditing={false}
          isViewOnly={true}
        />
      </ShowcaseSection>
    );
  }

  return (
    <ShowcaseSection title="Quiz Sets" className="space-y-5.5 !p-6.5">
      {quizzes.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-body text-dark-4 dark:text-dark-6 mb-2">
            No quiz sets found
          </div>
          <p className="text-body-sm text-dark-5 dark:text-dark-6">
            Create your first quiz set to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-body-lg font-semibold text-dark dark:text-white">
                      {quiz.title}
                    </h3>
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-light-5 text-blue dark:bg-blue-light-2">
                      {getQuestionCountText(getQuestionCount(quiz.questions))}
                    </span>
                  </div>
                  <p className="text-body text-dark-4 dark:text-dark-6 mb-3">
                    {quiz.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-body-sm text-dark-5 dark:text-dark-6">
                  Created: {formatDateTime(quiz.uploadedAt)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingQuiz(quiz)}
                    className="bg-white text-primary border border-primary px-4 py-2 rounded text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setEditingQuiz(quiz)}
                    className="bg-white text-amber-500 border border-amber-500 px-4 py-2 rounded text-sm font-medium hover:bg-amber-500 hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <DeleteQuizForm
                    quizId={quiz.id}
                    quizTitle={quiz.title}
                    onSuccess={() => setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ShowcaseSection>
  );
}
