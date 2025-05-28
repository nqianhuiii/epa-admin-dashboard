import NotesItem from "./NotesItem";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { NotesData } from "@/types/types";

interface NotesListProps {
  initialNotes: NotesData[];
}

export default function NotesList({ initialNotes }: NotesListProps) {
  return (
    <ShowcaseSection title="All Notes" className="!p-6.5">
      <div className="space-y-4">
        {initialNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No notes uploaded yet
          </div>
        ) : (
          initialNotes.map((notes) => (
            <NotesItem 
              key={notes.id} 
              notes={notes} 
            />
          ))
        )}
      </div>
    </ShowcaseSection>
  );
}