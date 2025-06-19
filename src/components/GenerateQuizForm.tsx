'use client'
import { createQuizSetAction } from '@/app/actions/quizAction';
import { cn } from "@/lib/utils";
import { QuizSet } from '@/types/types';
import { validateQuizSetInput, ValidationErrors } from '@/utils/formValidation';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import InputGroup from './FormElements/InputGroup';

interface GeneratedQuizFormProps {
  generatedQuizData: QuizSet;
  onSuccess?: () => void;
  onCancel?: () => void;
  onRegenerate?: () => void;
}

export default function GeneratedQuizForm({
  generatedQuizData,
  onSuccess,
  onCancel,
  onRegenerate,
}: GeneratedQuizFormProps) {
  const router = useRouter();
  const [quizSet, setQuizSet] = useState<QuizSet>({
    id: '',
    title: '',
    description: '',
    questions: [
      { id: 1, question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: ''},
      { id: 2, question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }
    ], 
    timeLimit: 0,
    passingScore: 0,
    shuffleQuestions: false,
    uploadedAt: new Date(),
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});

  // Initialize form with generated quiz data
  useEffect(() => {
    if (generatedQuizData) {
      setQuizSet({
        id: generatedQuizData.id || '',
        title: generatedQuizData.title || '',
        description: generatedQuizData.description || '',
        timeLimit: generatedQuizData.timeLimit || 4,
        passingScore: generatedQuizData.passingScore || 7,
        shuffleQuestions: generatedQuizData.shuffleQuestions || false,
        uploadedAt: generatedQuizData.uploadedAt || new Date(),
        questions: generatedQuizData.questions && generatedQuizData.questions.length > 0 
          ? generatedQuizData.questions.map((question, index) => ({
              id: question.id || index + 1,
              question: question.question || '',
              options: question.options || ['', '', '', ''],
              correctAnswer: question.correctAnswer || 0,
              explanation: question.explanation || '',
            }))
          : [
              { id: 1, question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: ''},
              { id: 2, question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }
            ]
      });
    }
  }, [generatedQuizData]);

  // Actions
  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});
    
    // Client-side validation
    const validation = validateQuizSetInput(quizSet);
    
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      if (validation.generalError) {
        setErrorMessage(validation.generalError);
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createQuizSetAction(quizSet);
      
      if (result.success) {
        setSuccessMessage(result.message || 'Quiz created successfully!');
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
        router.push('/quiz');
        router.refresh(); 
      } else {
        setErrorMessage(result.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error creating generated quiz:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    };
    setQuizSet(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const handleDeleteQuestion = (questionId: number) => {
    if (quizSet.questions.length <= 1) return;
    
    setQuizSet(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleUpdateQuestion = (questionId: number, field: 'question' | 'explanation', value: string) => {
    if (errorMessage) {
      setErrorMessage('');
    }
    
    // Clear field-specific errors
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`question_${questionId}`];
      return newErrors;
    });
    
    setQuizSet(prev => ({
      ...prev,
      questions: prev.questions.map(question =>
        question.id === questionId ? { ...question, [field]: value } : question
      )
    }));
  };

  const handleUpdateOption = (questionId: number, optionIndex: number, value: string) => {
    if (errorMessage) {
      setErrorMessage('');
    }
    
    // Clear option-specific errors
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`options_${questionId}`];
      delete newErrors[`options_unique_${questionId}`];
      return newErrors;
    });
    
    setQuizSet(prev => ({
      ...prev,
      questions: prev.questions.map(question =>
        question.id === questionId 
          ? { 
              ...question, 
              options: question.options.map((option, index) =>
                index === optionIndex ? value : option
              )
            } 
          : question
      )
    }));
  };

  const handleUpdateCorrectAnswer = (questionId: number, correctIndex: number) => {
    // Clear correct answer error
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`correctAnswer_${questionId}`];
      return newErrors;
    });
    
    setQuizSet(prev => ({
      ...prev,
      questions: prev.questions.map(question =>
        question.id === questionId ? { ...question, correctAnswer: correctIndex } : question
      )
    }));
  };

  const handleInputChange = (field: 'title' | 'description' | 'timeLimit' | 'passingScore' | 'shuffleQuestions', value: string | number | boolean) => {
    if (errorMessage) {
      setErrorMessage('');
    }
    
    // Clear field-specific errors
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    
    setQuizSet(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      {/* Header with AI-generated badge */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 ml-4">
          <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded-full">
            ✨ AI Generated
          </div>
          <span className="text-sm text-gray-600">
            Review and customize your AI-generated quiz below
          </span>
        </div>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-4 py-2 mr-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Title */}
        <div className="mb-6">
          <label className="text-body-sm font-medium text-dark dark:text-white">
            Title
            <span className="ml-1 select-none text-red">*</span>
          </label>
          <textarea
            placeholder="Add a title for the quiz set..."
            value={quizSet.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={cn(
              "w-full mt-3 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary px-5.5 py-3 text-dark placeholder:text-dark-6 dark:text-white dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary resize-none",
              fieldErrors.title && "border-red-500 focus:border-red-500"
            )}
            rows={3}
            required
          />
          {fieldErrors.title && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="text-body-sm font-medium text-dark dark:text-white">
            Description
            <span className="ml-1 select-none text-red">*</span>
          </label>
          <textarea
            placeholder="Add a description..."
            value={quizSet.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={cn(
              "w-full mt-3 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary px-5.5 py-3 text-dark placeholder:text-dark-6 dark:text-white dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary resize-none",
              fieldErrors.description && "border-red-500 focus:border-red-500"
            )}
            rows={3}
            required
          />
          {fieldErrors.description && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.description}</p>
          )}
        </div>

        {/* Quiz Settings */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Time Limit */}
          <div>
            <InputGroup
              label="Time Limit (minutes)"
              type="number"
              placeholder="Enter time limit"
              value={quizSet.timeLimit?.toString() || ''}
              handleChange={(e) => handleInputChange('timeLimit', e.target.value ? parseInt(e.target.value) : 0)}
              required={true}
            />
            {fieldErrors.timeLimit && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.timeLimit}</p>
            )}
          </div>

          {/* Passing Score */}
          <div>
            <InputGroup
              label="Passing Score (%)"
              type="number"
              placeholder="Enter passing score"
              value={quizSet.passingScore?.toString() || ''}
              handleChange={(e) => handleInputChange('passingScore', e.target.value ? parseInt(e.target.value) : 0)}
              required={true}
            />
            {fieldErrors.passingScore && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.passingScore}</p>
            )}
          </div>

          {/* Shuffle Questions */}
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={quizSet.shuffleQuestions}
                onChange={(e) => handleInputChange('shuffleQuestions', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Shuffle Questions</span>
            </label>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {quizSet.questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              {/* Question Header */}
              <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddQuestion}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Add question"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete question"
                    disabled={quizSet.questions.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Content */}
              <div className="p-6">
                {/* Question Text */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                    QUESTION
                  </label>
                  <textarea
                    placeholder="Enter your question..."
                    value={question.question}
                    onChange={(e) => handleUpdateQuestion(question.id, 'question', e.target.value)}
                    className={cn(
                      "w-full text-lg rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary px-5.5 py-3 text-dark placeholder:text-dark-6 dark:text-white dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary resize-none",
                      fieldErrors[`question_${question.id}`] && "border-red-500 focus:border-red-500"
                    )}
                    rows={2}
                    required
                  />
                  {fieldErrors[`question_${question.id}`] && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors[`question_${question.id}`]}</p>
                  )}
                </div>

                {/* Options */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                    OPTIONS
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() => handleUpdateCorrectAnswer(question.id, optionIndex)}
                          className="text-primary"
                        />
                        <input
                          type="text"
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) => handleUpdateOption(question.id, optionIndex, e.target.value)}
                          className={cn(
                            "flex-1 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary px-5.5 py-3 text-dark placeholder:text-dark-6 dark:text-white dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary",
                            (fieldErrors[`options_${question.id}`] || fieldErrors[`options_unique_${question.id}`]) && "border-red-500 focus:border-red-500"
                          )}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select the correct answer by clicking the radio button</p>
                  {fieldErrors[`options_${question.id}`] && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors[`options_${question.id}`]}</p>
                  )}
                  {fieldErrors[`options_unique_${question.id}`] && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors[`options_unique_${question.id}`]}</p>
                  )}
                  {fieldErrors[`correctAnswer_${question.id}`] && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors[`correctAnswer_${question.id}`]}</p>
                  )}
                </div>

                {/* Explanation */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                    EXPLANATION (OPTIONAL)
                  </label>
                  <textarea
                    placeholder="Explain why this is the correct answer..."
                    value={question.explanation}
                    onChange={(e) => handleUpdateQuestion(question.id, 'explanation', e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary px-5.5 py-3 text-dark placeholder:text-dark-6 dark:text-white dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? 'Saving Quiz...' : 'Save Generated Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};