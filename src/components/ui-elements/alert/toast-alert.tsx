// components/ui/toast-alert.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Alert, AlertProps } from "@/components/ui-elements/alert";

interface ToastAlertProps extends Omit<AlertProps, 'className'> {
  isOpen: boolean;
  onClose: () => void;
  duration?: number; // Auto-close duration in ms
}

export function ToastAlert({ 
  isOpen, 
  onClose, 
  duration = 5000, 
  ...alertProps 
}: ToastAlertProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 3000); // Wait for fade out animation
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen || !mounted) return null;

  const toastContent = (
    <div className="fixed top-4 right-4 z-[99999] max-w-md">
      <div
        className={`transform transition-all duration-3000 ${
          isVisible 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0'
        }`}
      >
        <div className="relative">
          <Alert {...alertProps} />
          
          {/* Close button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 3000);
            }}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  // Use portal to render at document root
  return createPortal(toastContent, document.body);
}