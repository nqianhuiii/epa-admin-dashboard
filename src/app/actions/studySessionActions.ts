"use server";

import { revalidatePath } from "next/cache";
import { StudySessionsService } from "@/services/studySessionService";
import { StudySession, CreateStudySessionInput, UpdateStudySessionInput } from "@/types/types";
import { validateStudySessionInput } from "@/utils/formValidation";

// Response types for actions
interface ActionResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

// Get all study sessions
export async function getStudySessions(): Promise<StudySession[]> {
  try {
    const service = new StudySessionsService();
    return await service.getAllStudySessions();
  } catch (error) {
    console.error("Error in getStudySessions action:", error);
    return [];
  }
}

// Get study session by ID
export async function getStudySessionById(id: string): Promise<StudySession | null> {
  try {
    if (!id?.trim()) {
      return null;
    }
    const service = new StudySessionsService();
    return await service.getStudySessionById(id);
  } catch (error) {
    console.error("Error in getStudySessionById action:", error);
    return null;
  }
}

// Create new study session
export async function createStudySession(input: CreateStudySessionInput): Promise<ActionResponse<StudySession>> {
  try {
    // Validate input
    const validationError = validateStudySessionInput(input);
    if (validationError) {
      return { success: false, message: validationError };
    }

    // Create study session using service
    const service = new StudySessionsService();
    const newSession = await service.createStudySession(input);

    // Revalidate the page to show updated data
    revalidatePath("/study-sessions");
    return {
      success: true,
      message: "Study session created successfully",
      data: newSession
    };
  } catch (error) {
    console.error("Error in createStudySession action:", error);

    return {
      success: false,
      message: "Failed to create study session. Please try again."
    };
  }
}

// Update study session
export async function updateStudySession(input: UpdateStudySessionInput): Promise<ActionResponse<StudySession>> {
  try {
    // Validate input
    if (!input.id?.trim()) {
      return { success: false, message: "Session ID is required" };
    }

    const validationError = validateStudySessionInput(input);
    if (validationError) {
      return { success: false, message: validationError };
    }

    const service = new StudySessionsService();
    const updatedSession = await service.updateStudySession(input);

    revalidatePath("/study-sessions");

    return {
      success: true,
      message: "Study session updated successfully",
      data: updatedSession
    };
  } catch (error) {
    console.error("Error in updateStudySession action:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === "Study session not found") {
        return {
          success: false,
          message: "Study session not found"
        };
      }
      if (error.message.includes("permission")) {
        return {
          success: false,
          message: "You don't have permission to update this study session"
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
      message: "Failed to update study session. Please try again."
    };
  }
}

// Delete study session
export async function deleteStudySession(id: string): Promise<ActionResponse> {
  try {
    if (!id?.trim()) {
      return { success: false, message: "Session ID is required" };
    }

    const service = new StudySessionsService();
    await service.deleteStudySession(id);

    revalidatePath("/study-sessions");

    return {
      success: true,
      message: "Study session deleted successfully"
    };
  } catch (error) {
    console.error("Error in deleteStudySession action:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === "Study session not found") {
        return {
          success: false,
          message: "Study session not found"
        };
      }
      if (error.message.includes("permission")) {
        return {
          success: false,
          message: "You don't have permission to delete this study session"
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
      message: "Failed to delete study session. Please try again."
    };
  }
}


// Get upcoming study sessions
// export async function getUpcomingStudySessions(): Promise<StudySession[]> {
//   try {
//     const service = new StudySessionsService();
//     return await service.getUpcomingStudySessions();
//   } catch (error) {
//     console.error("Error in getUpcomingStudySessions action:", error);
//     return [];
//   }
// }

// Get past study sessions
// export async function getPastStudySessions(): Promise<StudySession[]> {
//   try {
//     const service = new StudySessionsService();
//     return await service.getPastStudySessions();
//   } catch (error) {
//     console.error("Error in getPastStudySessions action:", error);
//     return [];
//   }
// }