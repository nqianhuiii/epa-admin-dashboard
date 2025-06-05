'use client'
import React, { useState, useRef } from 'react';
import { Plus, Upload, FileText, Trash2, Settings, MoreHorizontal, Image, Lock, Volume2, AlignCenter } from 'lucide-react';

// Mock services (similar to your study session structure)
// const flashcardService = {
//   createFlashcardSet: async (data) => {
//     console.log('Creating flashcard set:', data);
//     return { id: Date.now(), ...data };
//   },
//   uploadFile: async (file) => {
//     console.log('Uploading file:', file.name);
//     return { url: URL.createObjectURL(file), success: true };
//   },
//   saveCard: async (card) => {
//     console.log('Saving card:', card);
//     return { ...card, id: Date.now() };
//   }
// };

const FlashcardUploadSystem = () => {
  const [flashcardSet, setFlashcardSet] = useState({
    title: '',
    description: '',
    cards: [
      { id: 1, term: '', definition: '', image: null, audio: null },
      { id: 2, term: '', definition: '', image: null, audio: null }
    ]
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef(null);
  const [activeCardId, setActiveCardId] = useState(null);

  // Actions
  const handleCreateSet = async () => {
    setIsCreating(true);
    try {
    //   const result = await flashcardService.createFlashcardSet(flashcardSet);
    //   console.log('Flashcard set created:', result);
      // Reset form or redirect
    } catch (error) {
      console.error('Error creating flashcard set:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddCard = () => {
    const newCard = {
      id: Date.now(),
      term: '',
      definition: '',
      image: null,
      audio: null
    };
    setFlashcardSet(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }));
  };

//   const handleUpdateCard = (cardId, field, value) => {
//     setFlashcardSet(prev => ({
//       ...prev,
//       cards: prev.cards.map(card =>
//         card.id === cardId ? { ...card, [field]: value } : card
//       )
//     }));
//   };

//   const handleDeleteCard = (cardId) => {
//     if (flashcardSet.cards.length > 1) {
//       setFlashcardSet(prev => ({
//         ...prev,
//         cards: prev.cards.filter(card => card.id !== cardId)
//       }));
//     }
//   };

//   const handleImageUpload = async (cardId, file) => {
//     try {
//       const result = await flashcardService.uploadFile(file);
//       handleUpdateCard(cardId, 'image', result.url);
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     }
//   };

  const handleImportFromFile = () => {
    // fileInputRef.current?.click();
  };

//   const handleFileImport = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       // Handle CSV/text file import logic here
//       console.log('Importing from file:', file.name);
//     }
//   };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter a title, like 'Biology - Chapter 22: Evolution'"
              value={flashcardSet.title}
              onChange={(e) => setFlashcardSet(prev => ({ ...prev, title: e.target.value }))}
              className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400 w-full"
            />
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">Saved just now</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              Create
            </button>
            <button
              onClick={handleCreateSet}
              disabled={isCreating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create and practice'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            placeholder="Add a description..."
            value={flashcardSet.description}
            onChange={(e) => setFlashcardSet(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={handleImportFromFile}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Plus className="w-4 h-4" />
            Add diagram
            <Lock className="w-3 h-3 text-yellow-500" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FileText className="w-4 h-4" />
            Create from notes
          </button>
          <div className="ml-auto">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Flashcards */}
        <div className="space-y-4">
          {flashcardSet.cards.map((card, index) => (
            <div key={card.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                <div className="flex items-center gap-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  <button
                    // onClick={() => handleDeleteCard(card.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                {/* Term Side */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      TERM
                    </label>
                    <div className="flex items-center gap-1">
                      <button className="text-xs text-blue-600 hover:underline">
                        CHOOSE LANGUAGE
                      </button>
                    </div>
                  </div>
                  <textarea
                    placeholder="Enter term"
                    value={card.term}
                    // onChange={(e) => handleUpdateCard(card.id, 'term', e.target.value)}
                    className="w-full text-lg border-none outline-none resize-none placeholder-gray-400"
                    rows={3}
                  />
                </div>

                {/* Definition Side */}
                <div className="p-6 relative">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      DEFINITION
                    </label>
                    <div className="flex items-center gap-1">
                      <button className="text-xs text-blue-600 hover:underline">
                        CHOOSE LANGUAGE
                      </button>
                    </div>
                  </div>
                  <textarea
                    placeholder="Enter definition"
                    value={card.definition}
                    // onChange={(e) => handleUpdateCard(card.id, 'definition', e.target.value)}
                    className="w-full text-lg border-none outline-none resize-none placeholder-gray-400"
                    rows={3}
                  />
                  
                  {/* Image Upload Button */}
                  <div className="absolute bottom-4 right-4">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        // onChange={(e) => e.target.files[0] && handleImageUpload(card.id, e.target.files[0])}
                        className="hidden"
                      />
                      <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50">
                        <Image className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="text-xs text-center mt-1 text-gray-500">Image</div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Card Actions (if needed) */}
              {index === 1 && (
                <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-200">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span className="w-4 h-4 bg-blue-600 rounded" />
                    <Volume2 className="w-4 h-4 text-gray-400" />
                    <Lock className="w-4 h-4 text-yellow-500" />
                    <AlignCenter className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Card Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleAddCard}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium"
          >
            ADD A CARD
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt,.xlsx"
        // onChange={handleFileImport}
        className="hidden"
      />
    </div>
  );
};

export default FlashcardUploadSystem;