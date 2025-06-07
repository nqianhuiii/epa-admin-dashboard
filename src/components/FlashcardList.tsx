"use client";

import { useState } from "react";
import { FlashcardSet } from "@/types/types";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import FlashcardForm from "./FlashcardForm";
import { DeleteFlashcardForm } from "./DeleteFlashcardForm";

interface FlashcardListProps {
  initialFlashcards: FlashcardSet[];
}

export default function FlashcardList({ initialFlashcards }: FlashcardListProps) {
  const [flashcards, setFlashcards] = useState<FlashcardSet[]>(initialFlashcards);
  const [editingFlashcard, setEditingFlashcard] = useState<FlashcardSet | null>(null);
  const [viewingFlashcard, setViewingFlashcard] = useState<FlashcardSet | null>(null);

  const handleEditSuccess = () => {
    setEditingFlashcard(null);
    setViewingFlashcard(null);
    // Refresh the page to get updated data
    window.location.reload();
  };

  const handleCancel = () => {
    setEditingFlashcard(null);
    setViewingFlashcard(null);
  };

  const formatDateTime = (timestamp: any) => {
    // Handle Firestore timestamp or date string
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

  const getCardCount = (cards: any[]) => {
    return cards?.length || 0;
  };

  const getCardCountText = (count: number) => {
    return count === 1 ? '1 card' : `${count} cards`;
  };

  if (editingFlashcard) {
    return (
      <ShowcaseSection title="Edit Flashcard Set" className="space-y-5.5 !p-6.5">
        <FlashcardForm
          session={editingFlashcard}
          onSuccess={handleEditSuccess}
          onCancel={handleCancel}
          isEditing={true}
        />
      </ShowcaseSection>
    );
  }

  if (viewingFlashcard) {
    return (
      <ShowcaseSection title="View Flashcard Set" className="space-y-5.5 !p-6.5">
        <FlashcardForm
          session={viewingFlashcard}
          onSuccess={handleEditSuccess}
          onCancel={handleCancel}
          isEditing={false}
          isViewOnly={true}
        />
      </ShowcaseSection>
    );
  }

  return (
    <ShowcaseSection title="Flashcard Sets" className="space-y-5.5 !p-6.5">
      {flashcards.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-body text-dark-4 dark:text-dark-6 mb-2">
            No flashcard sets found
          </div>
          <p className="text-body-sm text-dark-5 dark:text-dark-6">
            Create your first flashcard set to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {flashcards.map((flashcard) => (
            <div
              key={flashcard.id}
              className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-body-lg font-semibold text-dark dark:text-white">
                      {flashcard.title}
                    </h3>
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-light-5 text-blue dark:bg-blue-light-2">
                      {getCardCountText(getCardCount(flashcard.cards))}
                    </span>
                  </div>
                  <p className="text-body text-dark-4 dark:text-dark-6 mb-3">
                    {flashcard.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-body-sm text-dark-5 dark:text-dark-6">
                  Created: {formatDateTime(flashcard.uploadedAt)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingFlashcard(flashcard)}
                    className="bg-white text-primary border border-primary px-4 py-2 rounded text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setEditingFlashcard(flashcard)}
                    className="bg-white text-amber-500 border border-amber-500 px-4 py-2 rounded text-sm font-medium hover:bg-amber-500 hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                <DeleteFlashcardForm
                    flashcardId={flashcard.id}
                    flashcardTitle={flashcard.title}
                    onSuccess={() => setFlashcards((prev) => prev.filter((s) => s.id !== flashcard.id))}
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