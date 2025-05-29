"use client";

import { TrashIcon } from "@/assets/icons";
import { useState, useTransition } from "react";
import { deleteStudySession } from "@/app/actions/studySessionActions";
import { ToastAlert } from "@/components/ui-elements/alert/toast-alert";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface DeleteStudySessionFormProps {
  sessionId: string;
  sessionTitle: string;
  onSuccess?: () => void;
}

export function DeleteStudySessionForm({
  sessionId,
  sessionTitle,
  onSuccess,
}: DeleteStudySessionFormProps) {
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
    description: "",
  });

  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteStudySession(sessionId);
      if (result.success) {
        setShowConfirm(false);
        setToast({
          isOpen: true,
          variant: "success",
          title: "Success",
          description: `Study session "${sessionTitle}" deleted successfully.`,
        });
        onSuccess?.();
      } else {
        setToast({
          isOpen: true,
          variant: "error",
          title: "Error",
          description: result.message || "Failed to delete study session.",
        });
      }
    });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-[7px] border border-red px-4 py-2 text-center font-medium text-red hover:bg-red hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            Deleting...
          </div>
        ) : (
          <>
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </>
        )}
      </button>

      <DeleteConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Study Session"
        message="Are you sure you want to delete the study session"
        itemName={sessionTitle}
        isLoading={isPending}
        confirmText="Delete Session"
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
