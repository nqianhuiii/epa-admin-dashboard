'use server';

import { revalidatePath } from 'next/cache';
import { uploadPastYearToCloudinary } from "@/services/cloudinaryServer";
import { ExerciseService } from '@/services/exerciseService';
import { ExerciseData, ExerciseType } from "@/types/types";


export async function getExercise(): Promise<ExerciseData[]> {
  try {
    return await ExerciseService.getAll();
  } catch (error) {
    console.error('Failed to fetch exercise:', error);
    return [];
  }
}

export async function uploadExerciseAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const chapter = formData.get('subject') as string;

    if (!file || !title || !type) {
      return { success: false, error: 'Missing required fields' };
    }

    // Fix: Make comparison case-insensitive
    if (type.toLowerCase() === 'practice' && !chapter) {
      return { success: false, error: 'Chapter is required for practice exercises' };
    }

    // Validate file
    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Please upload a PDF file' };
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 50MB' };
    }

    // Upload to Cloudinary
    const pdfUrl = await uploadPastYearToCloudinary(file);

    // Save to Firestore using service
    const exerciseData: Omit<ExerciseData, 'id'> = {
      type: type as ExerciseType,
      title,
      pdfUrl,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date(),
      // Fix: Make comparison case-insensitive
      ...(type.toLowerCase() === 'practice' && { chapter })
    };

    await ExerciseService.create(exerciseData);

    // Revalidate the page to show new data
    revalidatePath('/materials/form-exercise');

    return { success: true };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error: 'Upload failed' };
  }
}
export async function deleteExerciseAction(exerciseId: string) {
  try {
    await ExerciseService.delete(exerciseId);

    // Revalidate the page to show updated data
    revalidatePath('/materials/form-exercise');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete exercise:', error);
    return { success: false, error: 'Failed to delete exercise' };
  }
}

export async function updateExerciseAction(formData: FormData) {
  try {
    const exerciseId = formData.get('exerciseId') as string;
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const chapter = formData.get('subject') as string;
    const file = formData.get('file') as File | null;

    if (!exerciseId || !title || !type) {
      return { success: false, error: 'Missing required fields' };
    }

    // Fix: Make comparison case-insensitive
    if (type.toLowerCase() === 'practice' && !chapter) {
      return { success: false, error: 'Chapter is required for practice exercises' };
    }

    // Get existing exercise data
    const existingExercise = await ExerciseService.getById(exerciseId);
    if (!existingExercise) {
      return { success: false, error: 'Exercise not found' };
    }

    let updateData: any = {
      title: title.trim(),
      type: type as ExerciseType,
      updatedAt: new Date(),
    };

    if (type.toLowerCase() === 'practice') {
      updateData.chapter = chapter;
    } else {
      updateData.chapter = '';
    }

    // If a new file is uploaded, handle file upload and update file-related fields
    if (file && file.size > 0) {
      // Validate file
      if (file.type !== 'application/pdf') {
        return { success: false, error: 'Please upload a PDF file' };
      }

      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        return { success: false, error: 'File size must be less than 50MB' };
      }

      // Upload new file to Cloudinary
      const newPdfUrl = await uploadPastYearToCloudinary(file);

      updateData = {
        ...updateData,
        fileName: file.name,
        fileSize: file.size,
        pdfUrl: newPdfUrl,
      };
    }

    // Update exercise in Firestore
    await ExerciseService.update(exerciseId, updateData);

    // Revalidate the path to refresh the data
    revalidatePath('/materials/form-exercise');

    return { success: true };
  } catch (error) {
    console.error('Update exercise error:', error);
    return { success: false, error: 'Failed to update exercise' };
  }
}