"use client";

import { TrashIcon } from "@/assets/icons";
import { deleteTextbookAction } from "@/app/actions/textbookAction";
import { useState, useTransition } from "react";
import { ToastAlert } from "@/components/ui-elements/alert/toast-alert";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface DeleteTextbookFormProps {
  textbookId: string;
  textbookTitle: string;
  fileName: string;
}

export function DeleteTextbookForm({ 
  textbookId, 
  textbookTitle, 
  fileName 
}: DeleteTextbookFormProps) {
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
      const result = await deleteTextbookAction(textbookId);
      if (result.success) {
        setShowConfirm(false);
        setToast({
          isOpen: true,
          variant: "success",
          title: "Success",
          description: `Textbook "${fileName}" has been deleted successfully.`
        });
      } else {
        setToast({
          isOpen: true,
          variant: "error",
          title: "Error",
          description: result.error || "Failed to delete textbook"
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
        className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Deleting...' : 'Delete'}
      </button>

      <DeleteConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Textbook"
        message="Are you sure you want to delete textbook"
        itemName={textbookTitle}
        isLoading={isPending}
        confirmText="Delete Textbook"
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