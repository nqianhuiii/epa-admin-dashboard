import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FlashcardForm from "@/components/FlashcardForm";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import QuizForm from "@/components/QuizForm";
import StudySessionForm from "@/components/studySessionForm";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Quiz",
  description: "Create a new quiz set"
};

export default function CreateQuizPage() {
  return (
    <>
      <Breadcrumb pageName="Create quiz" />
      
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/quiz"
          className="inline-flex items-center text-primary hover:underline"
        >
          ← Back to Quiz list
        </Link>
      </div>

      {/* Create Form */}
      <ShowcaseSection title="Create Quiz" className="space-y-5.5 !p-6.5">
        {/* <FlashcardForm/> */}
        <QuizForm/>
      </ShowcaseSection>
    </>
  );
}