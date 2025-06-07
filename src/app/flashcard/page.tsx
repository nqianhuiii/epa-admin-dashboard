import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import Link from "next/link";
import FlashcardsList from "@/components/FlashcardList";
import { FlashcardSet } from "@/types/types";
import { getAllFlashcardsAction } from "../actions/flashcardAction";
// import { getFlashcards } from "../actions/flashcardActions"; // Uncomment when you have this function

export const metadata: Metadata = {
  title: "Flashcard Sets",
  description: "Create and manage your flashcard sets"
};

export default async function FlashcardPage() {
  const result = await getAllFlashcardsAction();
  const flashcards: FlashcardSet[] = result.success ? (result.data || []) : [];  
  return (
    <div>
      <Breadcrumb pageName="Flashcard Sets" />
        <div className="mb-6 flex justify-end gap-2">
          <Link 
            href="/flashcard/create"
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            + Create Flashcard Set
          </Link>
          <Link 
            href="/flashcard/create"
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            + AI Generated Flashcards
          </Link>
        </div>
      <div className="w-full space-y-6">
        <FlashcardsList initialFlashcards={flashcards} />
      </div>
    </div>
  );
}