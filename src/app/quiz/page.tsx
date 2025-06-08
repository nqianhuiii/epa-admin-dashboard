import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import QuizList from "@/components/quizList";
import { QuizSet } from "@/types/types";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllQuizAction } from "../actions/quizAction";
// import FlashcardsList from "@/components/FlashcardList";
// import { FlashcardSet } from "@/types/types";
// import { getAllFlashcardsAction } from "../actions/flashcardAction";
// import { getFlashcards } from "../actions/flashcardActions"; // Uncomment when you have this function

export const metadata: Metadata = {
  title: "Quiz Sets",
  description: "Create and manage your quiz sets"
};

export default async function QuizPage() {
  const result = await getAllQuizAction();
  const quiz: QuizSet[] = result.success ? (result.data || []) : [];  
  return (
    <div>
      <Breadcrumb pageName="Quiz Sets" />
        <div className="mb-6 flex justify-end gap-2">
          <Link 
            href="/quiz/create"
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            + Create Quiz Set
          </Link>
          <Link 
            href="/flashcard/create"
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            + AI Generated Quiz
          </Link>
        </div>
      <div className="w-full space-y-6">
        <QuizList initialQuizzes={quiz} />
      </div>
    </div> 
  );
}