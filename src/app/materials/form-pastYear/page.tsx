import { getPastYears } from "@/app/actions/pastYearAction";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import PastYearList from "@/components/PastYearList";
import PastYearUploadForm from "@/components/PastYearUploadForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Past Year Question Upload",
  description: "Upload and manage past year question"
};

export default async function PastYearPage() {
  const initialPastYears = await getPastYears();

  return (
    <>
      <Breadcrumb pageName="Past Year Question" />
      
      <div className="w-full space-y-6">
        {/* Upload Form - Client Component */}
        <ShowcaseSection title="Upload Past Year Question" className="space-y-5.5 !p-6.5">
          <PastYearUploadForm />
        </ShowcaseSection>

        {/* Textbook List - Server Component with Client interactions */}
        {/* <TextbookList initialTextbooks={initialTextbooks} /> */}
        <PastYearList initialPastYears={initialPastYears} />
      </div>
    </>
  );
}