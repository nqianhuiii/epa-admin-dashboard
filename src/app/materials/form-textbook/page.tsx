import { getTextbooks } from "@/app/actions/textbookAction";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TextbookList from "@/components/TextbookList";
import type { Metadata } from "next";
import Link from "next/link";

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
        <div className="mb-6 flex justify-end">
          <Link 
            href="/materials/form-textbook/create"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            + Create Textbook
          </Link>
        </div>
        <div className="w-full space-y-6">
          <TextbookList initialTextbooks={initialTextbooks} />
        </div>
    </>
  );
}