import { getNotes } from "@/app/actions/notesActions";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import NotesUploadForm from "@/components/NotesUploadForm";
import NotesList from "@/components/NotesList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes Upload",
  description: "Upload and manage notes"
};

export default async function NotesPage() {
  const initialNotes = await getNotes();

  return (
    <>
      <Breadcrumb pageName="Notes" />
      
      <div className="w-full space-y-6">
        {/* Upload Form - Client Component */}
        <ShowcaseSection title="Upload Notes" className="space-y-5.5 !p-6.5">
          <NotesUploadForm />
        </ShowcaseSection>

        <NotesList initialNotes={initialNotes} />
      </div>
    </>
  );
}