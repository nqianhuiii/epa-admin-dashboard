// app/actions/createFlashcardSetAction.ts
'use server';

import { FlashcardSet } from "@/types/types";
import { FlashcardService } from "@/services/flashcardService";
import { revalidatePath } from "next/cache";

interface ActionResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export async function createFlashcardSetAction(input: FlashcardSet): Promise<ActionResponse<string>> {
  try {

    if (!input.title || input.title.length < 3) {
      return { success: false, message: 'Title must be at least 3 characters.' };
    }

    const id = await FlashcardService.createFlashcardSet(input);

    revalidatePath('/flashcards');

    return {
      success: true,
      message: 'Flashcard set created successfully!',
      data: id,
    };
  } catch (error) {
    console.error('Error in createFlashcardSetAction:', error);
    return {
      success: false,
      message: 'Failed to create flashcard set. Please try again.',
    };
  }
}


export async function updateFlashcardSetAction(input: FlashcardSet): Promise<ActionResponse<void>> {
  try {
    if (!input.id) {
      return { success: false, message: 'Flashcard set ID is required for updates.' };
    }
    
    if (!input.title || input.title.length < 3) {
      return { success: false, message: 'Title must be at least 3 characters.' };
    }

    // Validate cards array exists and has content
    if (!input.cards || input.cards.length === 0) {
      return { success: false, message: 'At least one flashcard is required.' };
    }

    // Check each term-definition pair
    for (let i = 0; i < input.cards.length; i++) {
      const card = input.cards[i];
      
      if (!card.term || card.term.trim() === '') {
        return { success: false, message: `Term ${i + 1} cannot be empty.` };
      }
      
      if (!card.definition || card.definition.trim() === '') {
        return { success: false, message: `Definition for term ${i + 1} cannot be empty.` };
      }
    } 
    
    // Move the service call inside try block
    await FlashcardService.updateFlashcardSet(input);
    revalidatePath('/flashcards');
    revalidatePath(`/flashcards/${input.id}`);
    
    return {
      success: true,
      message: 'Flashcard set updated successfully!',
    };
  } catch (error) {
    console.error('Error in updateFlashcardSetAction:', error);
    return {
      success: false,
      message: 'Failed to update flashcard set. Please try again.',
    };
  }
}

export async function getAllFlashcardsAction(): Promise<ActionResponse<FlashcardSet[]>> {
  try {
    const flashcards = await FlashcardService.getAllFlashcardSets();
    
    return {
      success: true,
      message: 'Flashcards retrieved successfully!',
      data: flashcards,
    };
  } catch (error) {
    console.error('Error in getAllFlashcardsAction:', error);
    return {
      success: false,
      message: 'Failed to retrieve flashcards. Please try again.',
      data: [],
    };
  }
}

export async function getFlashcardByIdAction(id: string): Promise<ActionResponse<FlashcardSet | null>> {
  try {
    if (!id) {
      return { 
        success: false, 
        message: 'Flashcard ID is required.',
        data: null 
      };
    }

    const flashcard = await FlashcardService.getFlashcardSetById(id);
    
    if (!flashcard) {
      return {
        success: false,
        message: 'Flashcard set not found.',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Flashcard retrieved successfully!',
      data: flashcard,
    };
  } catch (error) {
    console.error('Error in getFlashcardByIdAction:', error);
    return {
      success: false,
      message: 'Failed to retrieve flashcard. Please try again.',
      data: null,
    };
  }
}

export async function deleteFlashcard(id: string): Promise<ActionResponse<FlashcardSet | null>>  {
  try {
    if (!id?.trim()) {
      return { success: false, message: "Flashcard ID is required" };
    }

    await FlashcardService.deleteFlashcard(id);

    revalidatePath("/flashcards");

    return {
      success: true,
      message: "Flashcard deleted successfully"
    };
  } catch (error) {
    console.error("Error in deleteFlashcard action:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === "Flashcard not found") {
        return {
          success: false,
          message: "Flashcard not found"
        };
      }
      if (error.message.includes("permission")) {
        return {
          success: false,
          message: "You don't have permission to delete this flashcard"
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
