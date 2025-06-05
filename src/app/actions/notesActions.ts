// app/actions/textbookAction.ts
'use server';

import { uploadNotesToCloudinary } from "@/services/cloudinaryServer";
import { NotesService } from '@/services/notesService';
import { NotesData } from "@/types/types";
import { revalidatePath } from 'next/cache';


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
    const chapter = formData.get('subject') as string;

    if (!file || !title || !chapter) {
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
      chapter,
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

export async function updateNotesAction(formData: FormData) {
  try {
    const notesId = formData.get('notesId') as string;
    const title = formData.get('title') as string;
    const chapter = formData.get('subject') as string;
    const file = formData.get('file') as File | null;

    if (!notesId || !title || !chapter) {
      return { success: false, error: 'Missing required fields' };
    }

    // Get existing notes data
    const existingNotes = await NotesService.getById(notesId);
    if (!existingNotes) {
      return { success: false, error: 'Notes not found' };
    }

    let updateData: any = {
      title: title.trim(),
      chapter,
      updatedAt: new Date(),
    };

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
      const newPdfUrl = await uploadNotesToCloudinary(file);

      // Delete old file from Cloudinary if it exists
      // if (existingNotes.pdfUrl) {
      //   await deleteNotesFromCloudinary(existingNotes.pdfUrl);
      // }

      updateData = {
        ...updateData,
        fileName: file.name,
        fileSize: file.size,
        pdfUrl: newPdfUrl,
      };
    }

    // Update notes in Firestore
    await NotesService.update(notesId, updateData);

    // Revalidate the path to refresh the data
    revalidatePath('/material/form-notes');

    return { success: true };
  } catch (error) {
    console.error('Update notes error:', error);
    return { success: false, error: 'Failed to update notes' };
  }
}


