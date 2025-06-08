// utils/validation/studySessionValidation.ts

import { CreateStudySessionInput } from "@/types/types";
import { QuizSet } from "@/types/types";

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

export interface ValidationErrors {
  [key: string]: string;
}

export function validateQuizSetInput(input: QuizSet): {
  isValid: boolean;
  errors: ValidationErrors;
  generalError?: string;
} {
  const errors: ValidationErrors = {};
  let isValid = true;

  // Validate title
  if (!input.title?.trim()) {
    errors.title = 'Title is required';
    isValid = false;
  } else if (input.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
    isValid = false;
  }

  // Validate description
  if (!input.description?.trim()) {
    errors.description = 'Description is required';
    isValid = false;
  }

  // Validate time limit
  if (!input.timeLimit || input.timeLimit <= 0) {
    errors.timeLimit = 'Time limit must be greater than 0';
    isValid = false;
  }

  // Validate passing score
  if (input.passingScore === undefined || input.passingScore === null || input.passingScore < 0 || input.passingScore > 100) {
    errors.passingScore = 'Passing score must be between 0 and 100';
    isValid = false;
  }

  // Validate questions
  if (!input.questions || input.questions.length === 0) {
    return {
      isValid: false,
      errors,
      generalError: 'At least one question is required'
    };
  }

  input.questions.forEach((question, index) => {
    const questionKey = `question_${question.id}`;
    const optionsKey = `options_${question.id}`;
    const optionsUniqueKey = `options_unique_${question.id}`;

    // Validate question text
    if (!question.question?.trim()) {
      errors[questionKey] = 'Question text is required';
      isValid = false;
    }

    // Validate options
    if (!question.options || question.options.length !== 4) {
      errors[optionsKey] = 'Must have exactly 4 options';
      isValid = false;
    } else {
      // Check if all options are filled
      const emptyOptions = question.options.filter(option => !option?.trim()).length;
      if (emptyOptions > 0) {
        errors[optionsKey] = 'All options must be filled';
        isValid = false;
      }

      // Check if options are unique (case-insensitive)
      const trimmedOptions = question.options.map(opt => opt?.trim().toLowerCase()).filter(Boolean);
      const uniqueOptions = new Set(trimmedOptions);
      if (uniqueOptions.size !== trimmedOptions.length) {
        errors[optionsUniqueKey] = 'All options must be unique';
        isValid = false;
      }
    }

    // Validate correct answer index
    if (question.correctAnswer < 0 || question.correctAnswer >= (question.options?.length || 0)) {
      errors[`correctAnswer_${question.id}`] = 'Please select a correct answer';
      isValid = false;
    }
  });

  return {
    isValid,
    errors,
    generalError: isValid ? undefined : 'Please fix the errors below before submitting.'
  };
}

// Server-side validation function (simplified version for server actions)
export function validateQuizSetForServer(input: QuizSet): string | null {
  // Basic validations
  if (!input.title?.trim() || input.title.trim().length < 3) {
    return 'Title must be at least 3 characters.';
  }

  if (!input.description?.trim()) {
    return 'Description is required';
  }

  if (!input.timeLimit || input.timeLimit <= 0) {
    return 'Time limit must be greater than 0';
  }

  if (input.passingScore === undefined || input.passingScore < 0 || input.passingScore > 100) {
    return 'Passing score must be between 0 and 100';
  }

  if (!input.questions || input.questions.length === 0) {
    return 'At least one question is required';
  }

  // Validate each question
  for (let i = 0; i < input.questions.length; i++) {
    const question = input.questions[i];
    
    if (!question.question?.trim()) {
      return `Question ${i + 1}: Question text is required`;
    }

    if (!question.options || question.options.length !== 4) {
      return `Question ${i + 1}: Must have exactly 4 options`;
    }

    for (let j = 0; j < question.options.length; j++) {
      if (!question.options[j]?.trim()) {
        return `Question ${i + 1}: Option ${j + 1} cannot be empty`;
      }
    }

    const uniqueOptions = new Set(question.options.map(opt => opt.trim().toLowerCase()));
    if (uniqueOptions.size !== question.options.length) {
      return `Question ${i + 1}: All options must be unique`;
    }

    if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
      return `Question ${i + 1}: Please select a correct answer`;
    }
  }

  return null; // No validation errors
}