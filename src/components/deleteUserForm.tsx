"use client";

import { TrashIcon } from "@/assets/icons";
import { deleteUserAction } from "@/app/actions/userActions";
import { useState, useTransition } from "react";
import { ToastAlert } from "@/components/ui-elements/alert/toast-alert";

interface DeleteUserFormProps {
  userId: string;
  userName: string;
}

export function DeleteUserForm({ userId, userName }: DeleteUserFormProps) {
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
      const result = await deleteUserAction(userId);
      if (result.success) {
        setShowConfirm(false);
        // Show success toast
        setToast({
          isOpen: true,
          variant: "success",
          title: "Success",
          description: `User "${userName}" has been deleted successfully.`
        });
      } else {
        // Show error toast
        setToast({
          isOpen: true,
          variant: "error",
          title: "Error",
          description: result.error || "Failed to delete user"
        });
      }
    });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }));
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-dark rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
            Delete User
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to delete user "{userName}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isPending}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="sr-only">Delete User</span>
        <TrashIcon />
      </button>

      <ToastAlert
        isOpen={toast.isOpen}
        onClose={closeToast}
        variant={toast.variant}
        title={toast.title}
        description={toast.description}
        duration={5000} // Auto-close after 5 seconds
      />
    </>
  );
}