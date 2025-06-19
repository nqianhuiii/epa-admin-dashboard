'use client'
import React, { useState } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AIQuizGenerator from './AiQuizGenerator';
import GeneratedQuizForm from '@/components/GenerateQuizForm';
import { QuizSet } from '@/types/types';
import { ShowcaseSection } from '@/components/Layouts/showcase-section';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; 

export default function GenerateQuizPage() {
  const [generatedQuizData, setGeneratedQuizData] = useState<QuizSet | null>(null);

  // Handle AI quiz generation completion
  const handleAIGenerated = (transformedQuizData: QuizSet) => {
    console.log("Received transformed quiz data:", transformedQuizData);
    setGeneratedQuizData(transformedQuizData);
  };

  // Handle saving generated quiz (redirect back to quiz list)
  const handleSaveGeneratedQuiz = () => {
    // This will be handled by the form itself via router.push('/quiz')
    // Just reset state for cleanup
    setGeneratedQuizData(null);
  };

  // Handle canceling editing (go back to AI generator)
  const handleCancelEditing = () => {
    setGeneratedQuizData(null);
  };

  // Handle regenerating quiz (go back to AI generator)
  const handleRegenerate = () => {
    setGeneratedQuizData(null);
  };

  return (
    <div>
      <Breadcrumb pageName="Generate Quiz with AI" />
      
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/quiz"
          className="inline-flex items-center text-primary hover:underline"
        >
          ← Back to Quiz list
        </Link>
      </div>

      {!generatedQuizData ? (
        // Show AI Generator Form
        <ShowcaseSection title="Generate Quiz" className="space-y-5.5 !p-6.5">
            <AIQuizGenerator
            onGeneratedQuiz={handleAIGenerated}
            />
        </ShowcaseSection>
      ) : (
        // Show Generated Quiz Form for editing
        <ShowcaseSection title="Edit Generated Quiz" className="space-y-5.5 !p-6.5">
            <GeneratedQuizForm
                generatedQuizData={generatedQuizData}
                onSuccess={handleSaveGeneratedQuiz}
                onCancel={handleCancelEditing}
                onRegenerate={handleRegenerate}
            />
        </ShowcaseSection>

      )}
    </div>
  );
}