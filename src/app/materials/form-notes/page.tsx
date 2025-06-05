import { getNotes } from "@/app/actions/notesActions";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NotesList from "@/components/NotesList";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notes Upload",
  description: "Upload and manage notes"
};

export default async function NotesPage() {
  const initialNotes = await getNotes();

  return (
    <>
      <Breadcrumb pageName="Notes" />
      <div className="mb-6 flex justify-end">
        <Link 
          href="/materials/form-notes/create"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          + Create Notes
        </Link>
      </div>
      <div className="w-full space-y-6">
        <NotesList initialNotes={initialNotes} />
      </div>
    </>
  );
}