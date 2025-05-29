import TextbookItem from "./TextbookItem";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { PastYearData } from "@/types/types";
import PastYearItem from "./pastYearItem";

interface PastYearListProps {
  initialPastYears: PastYearData[];
}

export default function PastYearList({ initialPastYears }: PastYearListProps) {
  return (
    <ShowcaseSection title="All Past Years" className="!p-6.5">
      <div className="space-y-4">
        {initialPastYears.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No past year uploaded yet
          </div>
        ) : (
          initialPastYears.map((pastYear) => (
            <PastYearItem
              key={pastYear.id} 
              pastYear={pastYear} 
            />
          ))
        )}
      </div>
    </ShowcaseSection>
  );
}