import TextbookItem from "./TextbookItem";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { TextbookData } from "@/types/types";

interface TextbookListProps {
  initialTextbooks: TextbookData[];
}

export default function TextbookList({ initialTextbooks }: TextbookListProps) {
  return (
    <ShowcaseSection title="All Textbooks" className="!p-6.5">
      <div className="space-y-4">
        {initialTextbooks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No textbooks uploaded yet
          </div>
        ) : (
          initialTextbooks.map((textbook) => (
            <TextbookItem 
              key={textbook.id} 
              textbook={textbook} 
            />
          ))
        )}
      </div>
    </ShowcaseSection>
  );
}