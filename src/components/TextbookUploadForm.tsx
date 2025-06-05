'use client';
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation"; // Add this import
import InputGroup from "@/components/FormElements/InputGroup";
import { uploadTextbookAction, updateTextbookAction } from "@/app/actions/textbookAction"; // Add updateTextbookAction
import { TextbookData } from "@/types/types";

interface TextbookUploadFormProps {
  textbook?: TextbookData; // Optional textbook data for editing
  onSuccess?: () => void; // Success callback
  onCancel?: () => void; // Cancel callback
  isEditing?: boolean; // Flag to indicate edit mode
}

export default function TextbookUploadForm({ 
  textbook, 
  onSuccess, 
  onCancel, 
  isEditing = false 
}: TextbookUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState(isEditing && textbook ? textbook.title : "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formInitialized = useRef(false);
  const router = useRouter(); // Add router hook

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
    if (!title.trim()) return;

    startTransition(async () => {
      try {
        let result;
        
        if (isEditing && textbook) {
          // Add textbook ID to form data for update
          formData.append('textbookId', textbook.id!);
          result = await updateTextbookAction(formData);
        } else {
          result = await uploadTextbookAction(formData);
        }
        
        if (result.success) {
          if (!isEditing) {
            // Reset form only for new uploads
            setSelectedFile(null);
            setTitle("");
            
            // Clear file input
            const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
          }
          
          setError(null);
          setSuccess(true);
          
          // Call success callback
          if (onSuccess) {
            setTimeout(() => onSuccess(), 1000); // Small delay to show success message
          }
          
          // Add redirect here
          setTimeout(() => {
            router.push('/materials/form-textbook');
          }, 1500); // Small delay to show success message
          
          // Hide success message after 3 seconds
          setTimeout(() => setSuccess(false), 3000);
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

        {isEditing && textbook && !selectedFile && (
          <div className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
            <p>Current file: {textbook.fileName}</p>
            <p>Leave file input empty to keep the current PDF</p>
          </div>
        )}

        <InputGroup
          type="text"
          label="Textbook Title"
          placeholder="Enter textbook title"
          value={title}
          handleChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <input type="hidden" name="title" value={title} />
        
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
            {isEditing ? 'Textbook updated successfully!' : 'Textbook uploaded successfully!'}
          </div>
        )}
        
        <div className="flex justify-center gap-3">
          <button
            type="submit"
            disabled={isPending || !title.trim() || (!isEditing && !selectedFile)}
            className="bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (isEditing ? 'Updating...' : 'Uploading...') : (isEditing ? 'Update Textbook' : 'Upload Textbook')}
          </button>
          
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}