'use client';

import { useState } from "react";
import ExerciseItem from "./exerciseItem";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import ExerciseUploadForm from "./ExerciseUploadForm";
import { ExerciseData } from "@/types/types";

interface ExerciseListProps {
  initialExercise: ExerciseData[];
  onExerciseUpdate?: () => void;
}

export default function ExerciseList({ initialExercise, onExerciseUpdate }: ExerciseListProps) {
  const [editingExercise, setEditingExercise] = useState<ExerciseData | null>(null);

  const handleEditSuccess = () => {
    setEditingExercise(null);
    if (onExerciseUpdate) {
      onExerciseUpdate();
    } else {
      window.location.reload();
    }
  };

  const handleEditClick = (exercise: ExerciseData) => {
    setEditingExercise(exercise);
  };

  // If editing, show the edit form instead of the exercise list
  if (editingExercise) {
    return (
      <ShowcaseSection title="Edit Exercise" className="space-y-5.5 !p-6.5">
        <ExerciseUploadForm
          exercise={editingExercise}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingExercise(null)}
          isEditing={true}
        />
      </ShowcaseSection>
    );
  }

  // Normal exercise list view
  return (
    <ShowcaseSection title="All Exercise" className="!p-6.5">
      <div className="space-y-4">
        {initialExercise.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No exercise uploaded yet
          </div>
        ) : (
          initialExercise.map((exercise) => (
            <ExerciseItem
              key={exercise.id} 
              exercise={exercise}
              onEditClick={handleEditClick}
              onExerciseUpdate={onExerciseUpdate}
            />
          ))
        )}
      </div>
    </ShowcaseSection>
  );
}