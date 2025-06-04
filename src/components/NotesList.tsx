'use client';

import { useState } from "react";
import NotesItem from "./NotesItem";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import NotesUploadForm from "./NotesUploadForm";
import { NotesData } from "@/types/types";

interface NotesListProps {
  initialNotes: NotesData[];
  onNotesUpdate?: () => void;
}

export default function NotesList({ initialNotes, onNotesUpdate }: NotesListProps) {
  const [editingNotes, setEditingNotes] = useState<NotesData | null>(null);

  const handleEditSuccess = () => {
    setEditingNotes(null);
    if (onNotesUpdate) {
      onNotesUpdate();
    } else {
      window.location.reload();
    }
  };

  const handleEditClick = (notes: NotesData) => {
    setEditingNotes(notes);
  };

  // If editing, show the edit form instead of the notes list
  if (editingNotes) {
    return (
      <ShowcaseSection title="Edit Notes" className="space-y-5.5 !p-6.5">
        <NotesUploadForm
          notes={editingNotes}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingNotes(null)}
          isEditing={true}
        />
      </ShowcaseSection>
    );
  }

  // Normal notes list view
  return (
    <ShowcaseSection title="All Notes" className="!p-6.5">
      <div className="space-y-4">
        {initialNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No notes uploaded yet
          </div>
        ) : (
          initialNotes.map((notes) => (
            <NotesItem 
              key={notes.id} 
              notes={notes}
              onEditClick={handleEditClick}
              onNotesUpdate={onNotesUpdate}
            />
          ))
        )}
      </div>
    </ShowcaseSection>
  );
}