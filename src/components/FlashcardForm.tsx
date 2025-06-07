'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { createFlashcardSetAction, updateFlashcardSetAction } from '@/app/actions/flashcardAction';
import { FlashcardSet } from '@/types/types';

interface FlashcardFormProps {
  session?: FlashcardSet;
  onSuccess?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
  isViewOnly?: boolean;
}

export default function FlashcardForm({
  session,
  onSuccess,
  onCancel,
  isEditing = false,
  isViewOnly = false,
}: FlashcardFormProps) {
  const [flashcardSet, setFlashcardSet] = useState({
    id: '',
    title: '',
    description: '',
    cards: [
      { id: 1, term: '', definition: '' },
      { id: 2, term: '', definition: ''}
    ], 
    uploadedAt: new Date(),
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Add error state
  const [successMessage, setSuccessMessage] = useState(''); // Add success state

  // Initialize form with session data if editing or viewing
  useEffect(() => {
    if ((isEditing || isViewOnly) && session) {
      setFlashcardSet({
        id: session.id || '',
        title: session.title || '',
        description: session.description || '',
        uploadedAt: session.uploadedAt || '',
        cards: session.cards && session.cards.length > 0 
          ? session.cards.map((card, index) => ({
              id: card.id || index + 1,
              term: card.term || '',
              definition: card.definition || '',
            }))
          : [
              { id: 1, term: '', definition: ''},
              { id: 2, term: '', definition: '' }
            ]
      });
    }
  }, [isEditing, isViewOnly, session]);

  // Actions
  const handleSubmit = async () => {
    if (isViewOnly) return; // Prevent submission in view mode
    
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    try {
      let result;
      if (isEditing) {
        result = await updateFlashcardSetAction(flashcardSet);
      } else {
        result = await createFlashcardSetAction(flashcardSet);
      }
      
      if (result.success) {
        setSuccessMessage(result.message || 'Operation completed successfully!');
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // Display the error message from validation
        setErrorMessage(result.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} flashcard set:`, error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCard = () => {
    if (isViewOnly) return; // Prevent adding cards in view mode
    
    const newCard = {
      id: Date.now(),
      term: '',
      definition: '',
      image: null,
    };
    setFlashcardSet(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }));
  };

  const handleUpdateCard = (cardId: number, field: 'term' | 'definition', value: string) => {
    if (isViewOnly) return; // Prevent updates in view mode
    
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
    
    setFlashcardSet(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId ? { ...card, [field]: value } : card
      )
    }));
  };

  const handleInputChange = (field: 'title' | 'description', value: string) => {
    if (isViewOnly) return; // Prevent input changes in view mode
    
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
    
    setFlashcardSet(prev => ({ ...prev, [field]: value }));
  };

  const getFormTitle = () => {
    if (isViewOnly) return 'View Flashcard Set';
    if (isEditing) return 'Edit Flashcard Set';
    return 'Create Flashcard Set';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Form Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{getFormTitle()}</h1>
          {isViewOnly && (
            <p className="text-sm text-gray-600 mt-1">This flashcard set is in read-only mode.</p>
          )}
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <textarea
            placeholder="Add a title for the flashcard set..."
            value={flashcardSet.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              isViewOnly ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            rows={3}
            readOnly={isViewOnly}
            disabled={isViewOnly}
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            placeholder="Add a description..."
            value={flashcardSet.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              isViewOnly ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            rows={3}
            readOnly={isViewOnly}
            disabled={isViewOnly}
          />
        </div>

        {/* Flashcards */}
        <div className="space-y-4">
          {flashcardSet.cards.map((card, index) => (
            <div key={card.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                {!isViewOnly && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddCard}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="Add card"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete card"
                      disabled={flashcardSet.cards.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                {/* Term Side */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      TERM
                    </label>
                  </div>
                  <textarea
                    placeholder="Enter term"
                    value={card.term}
                    onChange={(e) => handleUpdateCard(card.id, 'term', e.target.value)}
                    className={`w-full text-lg border-none outline-none resize-none placeholder-gray-400 ${
                      isViewOnly ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    rows={3}
                    readOnly={isViewOnly}
                    disabled={isViewOnly}
                  />
                </div>

                {/* Definition Side */}
                <div className="p-6 relative">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      DEFINITION
                    </label>
                  </div>
                  <textarea
                    placeholder="Enter definition"
                    value={card.definition}
                    onChange={(e) => handleUpdateCard(card.id, 'definition', e.target.value)}
                    className={`w-full text-lg border-none outline-none resize-none placeholder-gray-400 ${
                      isViewOnly ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    rows={3}
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
              className="bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary transition-colors"
            >
              {isViewOnly ? 'Close' : 'Cancel'}
            </button>
          )}
          {!isViewOnly && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update' : 'Create')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};