'use client'
import React, { useState, useTransition } from 'react';
import { Wand2, X, FileText, Upload } from 'lucide-react';
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { QuizSet, QuizQuestion } from '@/types/types';

interface AIQuizGeneratorFormProps {
  onGeneratedQuiz: (quizData: QuizSet) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const QUESTION_COUNT_OPTIONS = [
  { value: "3", label: "3 Questions" },
  { value: "5", label: "5 Questions" },
  { value: "10", label: "10 Questions" },
  { value: "15", label: "15 Questions" },
  { value: "20", label: "20 Questions" }
];

const DIFFICULTY_OPTIONS = [
  { value: "mudah", label: "Mudah (Easy)" },
  { value: "sederhana", label: "Sederhana (Medium)" },
  { value: "sukar", label: "Sukar (Hard)" }
];

export default function AIQuizGeneratorForm({ 
  onGeneratedQuiz, 
  onSuccess, 
  onCancel 
}: AIQuizGeneratorFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("5");
  const [difficulty, setDifficulty] = useState("sederhana");
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [fileContent, setFileContent] = useState('');

  // Transform AI response to QuizSet format
  const transformAIResponseToQuizSet = (aiResponse: any): QuizSet => {
    console.log("🔄 Transforming AI Response:", aiResponse);
    
    const { data } = aiResponse;
    
    if (!data) {
      console.error("❌ No data property in AI response");
      throw new Error("Invalid AI response format");
    }

    if (!data.questions || !Array.isArray(data.questions)) {
      console.error("❌ No questions array in AI response");
      throw new Error("No questions found in AI response");
    }

    const transformedQuestions: QuizQuestion[] = data.questions.map((q: any, index: number) => {
      console.log(`🔄 Transforming question ${index + 1}:`, q);
      
      // Clean options by removing letter prefixes (A), B), C), D))
      const cleanOptions = q.options.map((option: string) => {
        return option.replace(/^[A-D]\)\s*/, '');
      });

      // Since you've modified the prompt to return correctAnswer as number index, use it directly
      const correctAnswerIndex = typeof q.correctAnswer === 'number' 
        ? q.correctAnswer 
        : parseInt(q.correctAnswer, 10);
      
      return {
        id: index + 1,
        question: q.question,
        options: cleanOptions,
        correctAnswer: correctAnswerIndex,
        explanation: q.explanation
      };
    });

    const transformedQuizSet: QuizSet = {
      id: '', // Will be generated when saving to database
      title: data.title || 'Generated Quiz',
      description: data.description || 'AI Generated Quiz',
      questions: transformedQuestions,
      uploadedAt: new Date(),
    };

    console.log("✅ Successfully transformed quiz set:", transformedQuizSet);
    return transformedQuizSet;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a text file, PDF, or Word document');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setSuccess(false);

    // Read file content
    try {
      let content = '';
      
      if (file.type === 'text/plain') {
        content = await file.text();
      } else if (file.type === 'application/pdf') {
        // For PDF files, you'd need a PDF parser
        content = 'PDF content parsing not implemented in this example';
      } else {
        // For Word documents, you'd need a Word parser
        content = 'Word document parsing not implemented in this example';
      }
      
      setFileContent(content);
    } catch (err) {
      setError('Failed to read file content');
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!selectedFile && !topic.trim()) {
      setError('Please upload a file or enter a topic');
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          questionCount: parseInt(questionCount),
          difficulty,
          topic,
          includeExplanations,
          language: 'malay',
          fileContent: fileContent,
          hasFile: !!selectedFile,
          fileName: selectedFile?.name
        };

        console.log("📤 Sending request to generate quiz:", payload);

        const response = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        console.log("📥 Raw API response:", result);

        if (!response.ok) {
          throw new Error(result.error || 'Failed to generate quiz');
        }

        // Transform the raw ChatGPT response to QuizSet format
        const transformedQuizSet = transformAIResponseToQuizSet(result);
        
        // Pass the transformed data to parent
        onGeneratedQuiz(transformedQuizSet);
        
        // Reset form
        setSelectedFile(null);
        setTopic("");
        setQuestionCount("5");
        setDifficulty("sederhana");
        setIncludeExplanations(true);
        setFileContent("");
        
        // Clear file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        setError(null);
        setSuccess(true);
        
        // Call success callback
        if (onSuccess) {
          setTimeout(() => onSuccess(), 1500);
        }
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
        
      } catch (err: any) {
        console.error("❌ Error generating quiz:", err);
        setError(err.message || 'Failed to generate quiz');
        setSuccess(false);
      }
    });
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileContent('');
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div>
      <div className= "max-w-6xl mx-auto px-6 py-6">
      <form action={handleSubmit} className="space-y-5.5">
        {/* File Upload */}
        {/* Display uploaded file info */}
        <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-700">
            Upload your file <span className="text-red-500">*</span>
        </label>
        {!selectedFile ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              Supports: PDF, Word, Text files (Max 5MB)
            </p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}


        {/* Topic Input */}
        <InputGroup
          type="text"
          label="Enter Topic "
          placeholder="cth: Perkakasan Komputer, Perisian Sistem, Internet..."
          value={topic}
          handleChange={(e) => setTopic(e.target.value)}
          required
        />

        {/* Question Count */}
        <Select
          label="Number of Questions"
          placeholder="Select number of questions"
          className="mb-4.5"
          items={QUESTION_COUNT_OPTIONS}
          value={questionCount}
          onValueChange={(val) => setQuestionCount(val)}
          required
        />

        {/* Difficulty Level */}
        <Select
          label="Difficulty Level"
          placeholder="Select difficulty level"
          className="mb-4.5"
          items={DIFFICULTY_OPTIONS}
          value={difficulty}
          onValueChange={(val) => setDifficulty(val)}
          required
        />

        {/* Include Explanations Checkbox */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeExplanations}
              onChange={(e) => setIncludeExplanations(e.target.checked)}
              className="mr-3"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Include explanations for answers
            </span>
          </label>
        </div>

        {/* Hidden inputs for form data */}
        <input type="hidden" name="topic" value={topic} />
        <input type="hidden" name="questionCount" value={questionCount} />
        <input type="hidden" name="difficulty" value={difficulty} />
        <input type="hidden" name="includeExplanations" value={includeExplanations.toString()} />

        {/* File content info */}
        {selectedFile && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p>Selected: {selectedFile.name}</p>
            <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="text-green-500 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded">
            Quiz generated successfully!
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center gap-3">
          <button
            type="submit"
            disabled={isPending || (!selectedFile && !topic.trim())}
            className="bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Wand2 className="w-5 h-5" />
            {isPending ? 'Generating Quiz...' : 'Generate Quiz with AI'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-500 pt-2">
          AI will generate quiz questions based on your uploaded content or topic.
          You can edit the generated questions before saving.
        </div>
      </form>
      </div>
    </div>
  );
}