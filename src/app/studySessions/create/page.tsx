import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import StudySessionForm from "@/components/studySessionForm";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Study Session",
  description: "Create a new study session"
};

export default function CreateStudySessionPage() {
  return (
    <>
      <Breadcrumb pageName="Create Study Session" />
      
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/studySessions"
          className="inline-flex items-center text-primary hover:underline"
        >
          ← Back to Study Sessions
        </Link>
      </div>

      {/* Create Form */}
      <ShowcaseSection title="Create Study Session" className="space-y-5.5 !p-6.5">
        <StudySessionForm />
      </ShowcaseSection>
    </>
  );
}