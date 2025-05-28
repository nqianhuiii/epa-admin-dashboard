import { getTextbooks } from "@/app/actions/textbookAction";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import TextbookList from "@/components/TextbookList";
import TextbookUploadForm from "@/components/TextbookUploadForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Textbook Upload",
  description: "Upload and manage textbooks"
};

export default async function TextbookPage() {
  // Fetch all textbooks (no user filtering)
  const initialTextbooks = await getTextbooks();

  return (
    <>
      <Breadcrumb pageName="Textbook" />
      
      <div className="w-full space-y-6">
        {/* Upload Form - Client Component */}
        <ShowcaseSection title="Upload Textbook" className="space-y-5.5 !p-6.5">
          <TextbookUploadForm />
        </ShowcaseSection>

        {/* Textbook List - Server Component with Client interactions */}
        <TextbookList initialTextbooks={initialTextbooks} />
      </div>
    </>
  );
}