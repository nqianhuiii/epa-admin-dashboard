'use client';
import { useState, useTransition } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { uploadNotesAction } from "@/app/actions/notesActions";

export default function NoteskUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

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
    if (!selectedFile || !title.trim()) return;

    startTransition(async () => {
      try {
        const result = await uploadNotesAction(formData);
        
        if (result.success) {
          // Reset form
          setSelectedFile(null);
          setTitle("");
          setError(null);
          setSuccess(true);
          
          // Clear file input
          const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
          
          // Hide success message after 3 seconds
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError(result.error || 'Upload failed');
          setSuccess(false);
        }
      } catch (error) {
        setError('Upload failed');
        setSuccess(false);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-5.5">
      <InputGroup
        type="text"
        label="Notes Title"
        placeholder="Enter notes title"
        value={title}
        handleChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <InputGroup
        type="file"
        fileStyleVariant="style1"
        label="Attach PDF file"
        placeholder="Select PDF file"
        handleChange={handleFileChange}
        name="file"
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
          Notes uploaded successfully!
        </div>
      )}
      
      <button
        type="submit"
        disabled={isPending || !selectedFile || !title.trim()}
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Uploading...' : 'Upload Notes'}
      </button>
    </form>
  );
}