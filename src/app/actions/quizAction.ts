'use server';

import { QuizSet } from '@/types/types';
import { validateQuizSetForServer } from '@/utils/formValidation';
import { QuizService } from '@/services/quizService';
import { revalidatePath } from 'next/cache';

interface ActionResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export async function createQuizSetAction(input: QuizSet): Promise<ActionResponse<string>> {
  try {
    // Use extracted validation function
    const validationError = validateQuizSetForServer(input);
    
    if (validationError) {
      return { 
        success: false, 
        message: validationError 
      };
    }

    // If validation passes, create the quiz set
    const id = await QuizService.createQuizSet(input);

    revalidatePath("/quiz");

    return {
      success: true,
      message: 'Quiz set created successfully!',
      data: id,
    };
  } catch (error) {
    console.error('Error in createQuizSetAction:', error);
    return {
      success: false,
      message: 'Failed to create quiz set. Please try again.',
    };
  }
}

export async function updateQuizSetAction(input: QuizSet): Promise<ActionResponse<string>> {
  try {
    // Use extracted validation function
    const validationError = validateQuizSetForServer(input);
    
    if (validationError) {
      return { 
        success: false, 
        message: validationError 
      };
    }

    // If validation passes, update the quiz set
    await QuizService.updateQuizSet(input);

    revalidatePath("/quiz");

    return {
      success: true,
      message: 'Quiz set updated successfully!',
    };
  } catch (error) {
    console.error('Error in updateQuizSetAction:', error);
    return {
      success: false,
      message: 'Failed to update quiz set. Please try again.',
    };
  }
}

export async function getAllQuizAction(): Promise<ActionResponse<QuizSet[]>> {
  try {
    const quiz = await QuizService.getAllQuizSets();
    
    return {
      success: true,
      message: 'Quizs retrieved successfully!',
      data: quiz,
    };
  } catch (error) {
    console.error('Error in getAllQuizAction:', error);
    return {
      success: false,
      message: 'Failed to retrieve quiz. Please try again.',
      data: [],
    };
  }
}

export async function deleteQuiz(id: string): Promise<ActionResponse<QuizSet | null>>  {
  try {
    if (!id?.trim()) {
      return { success: false, message: "Flashcard ID is required" };
    }

    await QuizService.deleteQuizSet(id);

    revalidatePath("/quiz");

    return {
      success: true,
      message: "Quiz deleted successfully"
    };
  } catch (error) {
    console.error("Error in deleteQuiz action:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === "Quiz not found") {
        return {
          success: false,
          message: "Quiz not found"
        };
      }
      if (error.message.includes("permission")) {
        return {
          success: false,
          message: "You don't have permission to delete this quiz"
        };
      }
      if (error.message.includes("network")) {
        return {
          success: false,
          message: "Network error. Please check your connection and try again"
        };
      }
    }

    return {
      success: false,
      message: "Failed to delete flashcard. Please try again."
    };
  }
}
