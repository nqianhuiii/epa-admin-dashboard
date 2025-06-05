import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { getStudySessions } from "../actions/studySessionActions";
import StudySessionsList from "@/components/studySessionsList";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Flashcard Set",
  description: "Create and manage flashcard set"
};

export default async function FlashcardPage() {
//   const initialSessions = await getStudySessions();

  return (
    <>
      <Breadcrumb pageName="Flashcard" />
        <div className="mb-6 flex justify-end">
        <Link 
            href="/flashcard/create"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
            + Create Flashcard
        </Link>
        <Link 
            href="/flashcard/generate"
            className="ml-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
            + AI Generated Flashcard
        </Link>
        </div>
        <div className="w-full space-y-6">
            {/* Sessions List - Client Component */}
            {/* <StudySessionsList initialSessions={initialSessions} /> */}
        </div>
    </>
  );
}