'use client';
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadExerciseAction, updateExerciseAction } from "@/app/actions/exerciseAction"; 
import InputGroup from "@/components/FormElements/InputGroup";
import { TYPE_OPTIONS } from "@/constants/exerciseTypeConstant";
import { Select } from "./FormElements/select";
import { CHAPTER_OPTIONS } from "@/constants/chapterConstant";
import { ExerciseData } from "@/types/types"; // Assuming you have this type

interface ExerciseUploadFormProps {
  exercise?: ExerciseData; // Optional exercise data for editing
  onSuccess?: () => void; // Success callback
  onCancel?: () => void; // Cancel callback
  isEditing?: boolean; // Flag to indicate edit mode
}

export default function ExerciseUploadForm({ 
  exercise, 
  onSuccess, 
  onCancel, 
  isEditing = false 
}: ExerciseUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState(isEditing && exercise ? exercise.title : "");
  const [type, setType] = useState(isEditing && exercise ? exercise.type : "");
  const [subject, setSubject] = useState(isEditing && exercise ? exercise.chapter || "" : "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formInitialized = useRef(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      setSelectedFile(file);
      setError(null);
      setSuccess(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    // For editing, file is optional (only if user wants to replace the PDF)
    // For new upload, file is required
    if (!isEditing && !selectedFile) return;
    if (!title.trim() || !type.trim()) return;
    if (type === "Practice" && !subject.trim()) return;

    startTransition(async () => {
      try {
        let result;
        
        if (isEditing && exercise) {
          // Add exercise ID to form data for update
          formData.append('exerciseId', exercise.id!);
          formData.append('type', type);
          formData.append('subject', subject);
          result = await updateExerciseAction(formData);
        } else {
          formData.append('type', type);
          formData.append('subject', subject);
          result = await uploadExerciseAction(formData);
        }
        
        if (result.success) {
          if (!isEditing) {
            // Reset form only for new uploads
            setSelectedFile(null);
            setTitle("");
            setType("");
            setSubject("");
            
            // Clear file input
            const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
          }
          
          setError(null);
          setSuccess(true);
          
          // Call success callback if provided
          if (onSuccess) {
            onSuccess();
          }
          
          // Redirect after a short delay to show success message
          setTimeout(() => {
            router.push('/materials/form-exercise');
          }, 1500);
          
        } else {
          setError(result.error || `${isEditing ? 'Update' : 'Upload'} failed`);
          setSuccess(false);
        }
      } catch (error) {
        setError(`${isEditing ? 'Update' : 'Upload'} failed`);
        setSuccess(false);
      }
    });
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Default behavior: redirect to form-exercise page
      router.push('/materials/form-exercise');
    }
  };

  return (
    <div>
      <form action={handleSubmit} className="space-y-5.5">
        <InputGroup
          type="file"
          fileStyleVariant="style1"
          label={isEditing ? "Replace PDF file (optional)" : "Attach PDF file"}
          placeholder="Select PDF file"
          handleChange={handleFileChange}
          name="file"
          required={!isEditing} // File is only required for new uploads
        />

        {isEditing && exercise && !selectedFile && (
          <div className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
            <p>Current file: {exercise.fileName}</p>
            <p>Leave file input empty to keep the current PDF</p>
          </div>
        )}

        <InputGroup
          type="text"
          label="Exercise Title"
          placeholder="Enter exercise title"
          value={title}
          handleChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <Select
          label="Type"
          placeholder="Select the type of exercise"
          className="mb-4.5"
          items={TYPE_OPTIONS}
          value={type}
          onValueChange={(val) => setType(val)}
          required
        />

        {type === "Practice" && (
          <Select
            label="Chapter"
            placeholder="Select the chapter"
            className="mb-4.5"
            items={CHAPTER_OPTIONS}
            value={subject}
            onValueChange={(val) => setSubject(val)}
            required
          />
        )}
        
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="subject" value={subject} />

        
        {selectedFile && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p>Selected: {selectedFile.name}</p>
            <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="text-green-500 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded">
            {isEditing ? 'Exercise updated successfully! Redirecting...' : 'Exercise uploaded successfully! Redirecting...'}
          </div>
        )}
        
        <div className="flex justify-center gap-3">
          <button
            type="submit"
            disabled={
              isPending || 
              !title.trim() || 
              !type.trim() || 
              (type === "Practice" && !subject.trim()) ||
              (!isEditing && !selectedFile)
            }
            className="bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (isEditing ? 'Updating...' : 'Uploading...') : (isEditing ? 'Update Exercise' : 'Upload Exercise')}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}