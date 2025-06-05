"use client";

import { deleteExerciseAction} from "@/app/actions/exerciseAction";
import { ToastAlert } from "@/components/ui-elements/alert/toast-alert";
import { useState, useTransition } from "react";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface DeleteExerciseFormProps {
  exerciseId: string;
  exerciseTitle: string;
  fileName: string;
}

export function DeleteExerciseForm({ 
  exerciseId, 
  exerciseTitle, 
  fileName 
}: DeleteExerciseFormProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    variant: "success" | "error";
    title: string;
    description: string;
  }>({
    isOpen: false,
    variant: "error",
    title: "",
    description: ""
  });
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteExerciseAction(exerciseId);
      if (result.success) {
        setShowConfirm(false);
        setToast({
          isOpen: true,
          variant: "success",
          title: "Success",
          description: `Exercise "${fileName}" has been deleted successfully.`
        });
      } else {
        setToast({
          isOpen: true,
          variant: "error",
          title: "Error",
          description: result.error || "Failed to delete exercise"
        });
      }
    });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="bg-white text-red-500 border border-red-500 px-4 py-2 rounded text-sm font-medium hover:bg-red-500 hover:text-white transition-colors"
      >
        {isPending ? 'Deleting...' : 'Delete'}
      </button>

      <DeleteConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Exercise"
        message="Are you sure you want to delete exercise"
        itemName={exerciseTitle}
        isLoading={isPending}
        confirmText="Delete Exercise"
      />

      <ToastAlert
        isOpen={toast.isOpen}
        onClose={closeToast}
        variant={toast.variant}
        title={toast.title}
        description={toast.description}
        duration={5000}
      />
    </>
  );
}