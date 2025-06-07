import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FlashcardForm from "@/components/FlashcardForm";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import StudySessionForm from "@/components/studySessionForm";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Flashcard",
  description: "Create a new flashcard set"
};

export default function CreateFlashcardPage() {
  return (
    <>
      <Breadcrumb pageName="Create Flashcard" />
      
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/flashcard"
          className="inline-flex items-center text-primary hover:underline"
        >
          ← Back to Flashcard list
        </Link>
      </div>

      {/* Create Form */}
      <ShowcaseSection title="Create Flashcard" className="space-y-5.5 !p-6.5">
        <FlashcardForm/>
      </ShowcaseSection>
    </>
  );
}