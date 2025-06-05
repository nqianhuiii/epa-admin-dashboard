import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import NotesUploadForm from "@/components/NotesUploadForm";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Notes",
  description: "Create a new note"
};

export default function CreateStudySessionPage() {
  return (
    <>
      <Breadcrumb pageName="Create Note" />
      
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/materials/form-notes"
          className="inline-flex items-center text-primary hover:underline"
        >
          ← Back to List of Notes
        </Link>
      </div>

      {/* Create Form */}
      <ShowcaseSection title="Create Note" className="space-y-5.5 !p-6.5">
        <NotesUploadForm />
      </ShowcaseSection>
    </>
  );
}