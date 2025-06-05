'use server';

import { revalidatePath } from 'next/cache';
import { uploadTextbookToCloudinary } from "@/services/cloudinaryServer";
import { TextbookService } from "@/services/textbookService";
import { TextbookData } from "@/types/types";


export async function getTextbooks(): Promise<TextbookData[]> {
  try {
    return await TextbookService.getAll();
  } catch (error) {
    console.error('Failed to fetch textbooks:', error);
    return [];
  }
}

export async function uploadTextbookAction(formData: FormData) {
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
    const pdfUrl = await uploadTextbookToCloudinary(file);

    // Save to Firestore using service
    const textbookData = {
      title,
      pdfUrl,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date(),
    };

    await TextbookService.create(textbookData);

    // Revalidate the page to show new data
    revalidatePath('/textbook');

    return { success: true };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error: 'Upload failed' };
  }
}

export async function deleteTextbookAction(textbookId: string) {
  try {
    await TextbookService.delete(textbookId);

    // Revalidate the page to show updated data
    revalidatePath('/textbook');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete textbook:', error);
    return { success: false, error: 'Failed to delete textbook' };
  }
}

export async function updateTextbookAction(formData: FormData) {
  try {
    const textbookId = formData.get('textbookId') as string;
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    if (!file || !title) {
      return { success: false, error: 'Missing required fields' };
    }

    // Get existing notes data
    const existingTextbook = await TextbookService.getById(textbookId);
    if (!existingTextbook) {
      return { success: false, error: 'Textbook not found' };
    }


    let updateData: any = {
      title: title.trim(),
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
      const newPdfUrl = await uploadTextbookToCloudinary(file);
   
      updateData = {
        ...updateData,
        fileName: file.name,
        fileSize: file.size,
        pdfUrl: newPdfUrl,
      };
    }

    await TextbookService.update(textbookId, updateData);

    // Revalidate the page to show updated data
    revalidatePath('/material/form-textbook');

    return { success: true };
  } catch (error) {
    console.error('Update failed:', error);
    return { success: false, error: 'Update failed' };
  }
}