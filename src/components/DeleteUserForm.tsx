"use client";

import { TrashIcon } from "@/assets/icons";
import { deleteUserAction } from "@/app/actions/userActions";
import { useState, useTransition } from "react";
import { ToastAlert } from "@/components/ui-elements/alert/toast-alert";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

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
        setToast({
          isOpen: true,
          variant: "success",
          title: "Success",
          description: `User "${userName}" has been deleted successfully.`
        });
      } else {
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

      <DeleteConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete user"
        itemName={userName}
        isLoading={isPending}
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