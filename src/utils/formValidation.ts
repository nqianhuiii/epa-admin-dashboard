// utils/validation/studySessionValidation.ts

import { CreateStudySessionInput } from "@/types/types";

export function validateStudySessionInput(input: CreateStudySessionInput): string | null {
  if (!input.title?.trim()) {
    return "Title is required";
  }
  if (!input.description?.trim()) {
    return "Description is required";
  }
  if (!input.date) {
    return "Date is required";
  }
  if (!input.meetingLink?.trim()) {
    return "Meeting link is required";
  }
  if (!input.teacherName?.trim()) {
    return "Teacher name is required";
  }

  // Validate meeting link format
  const urlPattern = /^https?:\/\/.+/;
  if (!urlPattern.test(input.meetingLink)) {
    return "Please enter a valid meeting link (must start with http:// or https://)";
  }

  // Validate date is not in the past
  const sessionDate = new Date(input.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (sessionDate < today) {
    return "Session date cannot be in the past";
  }

  return null; // No validation errors
}
