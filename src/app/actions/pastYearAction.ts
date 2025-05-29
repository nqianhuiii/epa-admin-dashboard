'use server';

import { revalidatePath } from 'next/cache';
import { uploadPastYearToCloudinary } from "@/services/cloudinaryServer";
import { PastYearService } from '@/services/pastYearService';
import { PastYearData } from "@/types/types";


export async function getPastYears(): Promise<PastYearData[]> {
  try {
    return await PastYearService.getAll();
  } catch (error) {
    console.error('Failed to fetch past years:', error);
    return [];
  }
}

export async function uploadPastYearAction(formData: FormData) {
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
    const pdfUrl = await uploadPastYearToCloudinary(file);

    // Save to Firestore using service
    const pastYearData = {
      title,
      pdfUrl,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date(),
    };

    await PastYearService.create(pastYearData);

    // Revalidate the page to show new data
    revalidatePath('/pastYear');

    return { success: true };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error: 'Upload failed' };
  }
}

export async function deletePastYearAction(pastYearId: string) {
  try {
    await PastYearService.delete(pastYearId);

    // Revalidate the page to show updated data
    revalidatePath('/pastYear');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete past year:', error);
    return { success: false, error: 'Failed to delete past year' };
  }
}