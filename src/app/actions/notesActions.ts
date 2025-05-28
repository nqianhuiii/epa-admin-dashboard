// app/actions/textbookAction.ts
'use server';

import { revalidatePath } from 'next/cache';
import { uploadNotesToCloudinary } from "@/services/cloudinaryServer";
import { NotesService } from '@/services/notesService';
import { NotesData } from "@/types/types";


export async function getNotes(): Promise<NotesData[]> {
  try {
    return await NotesService.getAll();
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return [];
  }
}

export async function uploadNotesAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    if (!file || !title) {
      return { success: false, error: 'Missing required fields' };
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
    const pdfUrl = await uploadNotesToCloudinary(file);

    // Save to Firestore using service
    const notesData = {
      title,
      pdfUrl,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date(),
    };

    await NotesService.create(notesData);

    // Revalidate the page to show new data
    revalidatePath('/notes');

    return { success: true };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error: 'Upload failed' };
  }
}

export async function deleteNotesAction(notesId: string) {
  try {
    await NotesService.delete(notesId);

    // Revalidate the page to show updated data
    revalidatePath('/notes');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete notes:', error);
    return { success: false, error: 'Failed to delete notes' };
  }
}