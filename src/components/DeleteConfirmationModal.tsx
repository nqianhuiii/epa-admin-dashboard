"use client";

import { useState } from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message,
  itemName,
  isLoading = false,
  confirmText = "Delete",
  cancelText = "Cancel"
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-dark rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
          {itemName && (
            <span className="font-medium"> "{itemName}"</span>
          )}
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}