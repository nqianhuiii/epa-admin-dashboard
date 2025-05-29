"use client";

import { TrashIcon } from "@/assets/icons";
import { deletePastYearAction } from "@/app/actions/pastYearAction";
import { useState, useTransition } from "react";
import { ToastAlert } from "@/components/ui-elements/alert/toast-alert";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface DeletePastYearFormProps {
  pastYearId: string;
  pastYearTitle: string;
  fileName: string;
}

export function DeletePastYearForm({ 
  pastYearId, 
  pastYearTitle, 
  fileName 
}: DeletePastYearFormProps) {
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
      const result = await deletePastYearAction(pastYearId);
      if (result.success) {
        setShowConfirm(false);
        setToast({
          isOpen: true,
          variant: "success",
          title: "Success",
          description: `Past year "${fileName}" has been deleted successfully.`
        });
      } else {
        setToast({
          isOpen: true,
          variant: "error",
          title: "Error",
          description: result.error || "Failed to delete past year"
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
        title="Delete Past Year"
        message="Are you sure you want to delete past year"
        itemName={pastYearTitle}
        isLoading={isPending}
        confirmText="Delete Past Year"
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