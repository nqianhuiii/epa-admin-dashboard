import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import TextbookUploadForm from "@/components/TextbookUploadForm";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Textbook",
  description: "Create a new textbook"
};

export default function CreateTextbookPage() {
  return (
    <>
      <Breadcrumb pageName="Create Textbook" />
      
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/materials/form-textbook"
          className="inline-flex items-center text-primary hover:underline"
        >
          ← Back to List of Textbook
        </Link>
      </div>

      {/* Create Form */}
      <ShowcaseSection title="Create Note" className="space-y-5.5 !p-6.5">
        <TextbookUploadForm />
      </ShowcaseSection>
    </>
  );
}