'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";
import InputGroup from './FormElements/InputGroup';
import { createQuizSetAction, updateQuizSetAction } from '@/app/actions/quizAction';
import { QuizSet } from '@/types/types';
import { validateQuizSetInput, ValidationErrors } from '@/utils/formValidation';
import { useRouter } from "next/navigation";

interface QuizFormProps {
  quizset?: QuizSet;
  onSuccess?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
  isViewOnly?: boolean;
}

export default function QuizForm({
  quizset,
  onSuccess,
  onCancel,
  isEditing = false,
  isViewOnly = false,
}: QuizFormProps) {
  const router = useRouter();
  const [quizSet, setQuizSet] = useState({
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

  // Initialize form with quiz data if editing or viewing
  useEffect(() => {
    if ((isEditing || isViewOnly) && quizset) {
      setQuizSet({
        id: quizset.id || '',
        title: quizset.title || '',
        description: quizset.description || '',
        timeLimit: quizset.timeLimit || 4,
        passingScore: quizset.passingScore || 7,
        shuffleQuestions: quizset.shuffleQuestions || false,
        uploadedAt: quizset.uploadedAt || new Date(),
        questions: quizset.questions && quizset.questions.length > 0 
          ? quizset.questions.map((question, index) => ({
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
  }, [isEditing, isViewOnly, quizset]);

  // Actions
  const handleSubmit = async () => {
    if (isViewOnly) return;
    
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});
    
    // Client-side validation using extracted validation function
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
      let result;
      if (isEditing) {
        result = await updateQuizSetAction(quizSet);
      } else {
        result = await createQuizSetAction(quizSet);
      }
      
      if (result.success) {
        setSuccessMessage(result.message || 'Operation completed successfully!');
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
      console.error(`Error ${isEditing ? 'updating' : 'creating'} quiz set:`, error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddQuestion = () => {
    if (isViewOnly) return;
    
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
    if (isViewOnly || quizSet.questions.length <= 1) return;
    
    setQuizSet(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleUpdateQuestion = (questionId: number, field: 'question' | 'explanation', value: string) => {
    if (isViewOnly) return;
    
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
    if (isViewOnly) return;
    
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
    if (isViewOnly) return;
    
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
    if (isViewOnly) return;
    
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
              isViewOnly && "cursor-not-allowed bg-gray-100 disabled:bg-gray-2 dark:disabled:bg-dark",
              fieldErrors.title && "border-red-500 focus:border-red-500"
            )}
            rows={3}
            readOnly={isViewOnly}
            disabled={isViewOnly}
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
              isViewOnly && "cursor-not-allowed bg-gray-100 disabled:bg-gray-2 dark:disabled:bg-dark",
              fieldErrors.description && "border-red-500 focus:border-red-500"
            )}
            rows={3}
            readOnly={isViewOnly}
            disabled={isViewOnly}
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
              disabled={isViewOnly}
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
              disabled={isViewOnly}
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
                className={`mr-2 ${isViewOnly ? 'cursor-not-allowed' : ''}`}
                disabled={isViewOnly}
              />
              <span className="text-sm font-medium text-gray-700">Shuffle Questions</span>
            </label>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {quizSet.questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Question Header */}
              <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                {!isViewOnly && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddQuestion}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="Add question"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete question"
                      disabled={quizSet.questions.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
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
                      isViewOnly && "cursor-not-allowed bg-gray-50 disabled:bg-gray-2 dark:disabled:bg-dark",
                      fieldErrors[`question_${question.id}`] && "border-red-500 focus:border-red-500"
                    )}
                    rows={2}
                    readOnly={isViewOnly}
                    disabled={isViewOnly}
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
                          className={`${isViewOnly ? 'cursor-not-allowed' : ''}`}
                          disabled={isViewOnly}
                        />
                        <input
                          type="text"
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) => handleUpdateOption(question.id, optionIndex, e.target.value)}
                          className={cn(
                            "flex-1 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 px-5.5 py-3 text-dark placeholder:text-dark-6 dark:text-white dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark",
                            isViewOnly && "cursor-not-allowed bg-gray-50",
                            (fieldErrors[`options_${question.id}`] || fieldErrors[`options_unique_${question.id}`]) && "border-red-500 focus:border-red-500"
                          )}
                          readOnly={isViewOnly}
                          disabled={isViewOnly}
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
                    className={cn(
                      "w-full rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary px-5.5 py-3 text-dark placeholder:text-dark-6 dark:text-white dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary resize-none",
                      isViewOnly && "cursor-not-allowed bg-gray-50 disabled:bg-gray-2 dark:disabled:bg-dark"
                    )}
                    rows={2}
                    readOnly={isViewOnly}
                    disabled={isViewOnly}
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
              {isViewOnly ? 'Close' : 'Cancel'}
            </button>
          )}
          {!isViewOnly && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Quiz' : 'Create')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};