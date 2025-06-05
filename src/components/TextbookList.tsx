'use client';

import { useState } from "react";
import TextbookItem from "./TextbookItem";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import TextbookUploadForm from "./TextbookUploadForm";
import { TextbookData } from "@/types/types";

interface TextbookListProps {
  initialTextbooks: TextbookData[];
  onTextbookUpdate?: () => void;
}

export default function TextbookList({ initialTextbooks, onTextbookUpdate }: TextbookListProps) {
  const [editingTextbook, setEditingTextbook] = useState<TextbookData | null>(null);

  const handleEditSuccess = () => {
    setEditingTextbook(null);
    if (onTextbookUpdate) {
      onTextbookUpdate();
    } else {
      window.location.reload();
    }
  };

  const handleEditClick = (textbook: TextbookData) => {
    setEditingTextbook(textbook);
  };

  // If editing, show the edit form instead of the textbook list
  if (editingTextbook) {
    return (
      <ShowcaseSection title="Edit Textbook" className="space-y-5.5 !p-6.5">
        <TextbookUploadForm
          textbook={editingTextbook}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingTextbook(null)}
          isEditing={true}
        />
      </ShowcaseSection>
    );
  }

  // Normal textbook list view
  return (
    <ShowcaseSection title="All Textbooks" className="!p-6.5">
      <div className="space-y-4">
        {initialTextbooks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No textbooks uploaded yet
          </div>
        ) : (
          initialTextbooks.map((textbook) => (
            <TextbookItem 
              key={textbook.id} 
              textbook={textbook}
              onEditClick={handleEditClick}
              onTextbookUpdate={onTextbookUpdate}
            />
          ))
        )}
      </div>
    </ShowcaseSection>
  );
}