"use client";

import { TrashIcon } from "@/assets/icons";
import { deletePostAction } from "@/app/actions/forumAction";
import { useState, useTransition } from "react";
import { ToastAlert } from "@/components/ui-elements/alert/toast-alert";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface DeleteForumFormProps {
  postId: string;
  onSuccess?: () => void;
}

export function DeleteForumForm({ 
  postId, 
  onSuccess 
}: DeleteForumFormProps) {
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
      const result = await deletePostAction(postId);
      if (result.success) {
        setShowConfirm(false);
        setToast({
          isOpen: true,
          variant: "success",
          title: "Success",
          description: "Post has been deleted successfully."
        });
      } else {
        setToast({
          isOpen: true,
          variant: "error",
          title: "Error",
          description: result.error || "Failed to delete notes"
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
        title="Delete Post"
        message="Are you sure you want to delete this post"
        isLoading={isPending}
        confirmText="Delete Post"
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