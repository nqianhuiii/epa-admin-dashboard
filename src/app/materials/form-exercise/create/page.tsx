import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import ExerciseUploadForm from "@/components/ExerciseUploadForm";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Exercise",
  description: "Create a new exercise"
};

export default function CreateExercisePage() {
  return (
    <>
      <Breadcrumb pageName="Create Exercise" />
      
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/materials/form-exercise"
          className="inline-flex items-center text-primary hover:underline"
        >
          ← Back to List of Exercise
        </Link>
      </div>

      {/* Create Form */}
      <ShowcaseSection title="Create Exercise" className="space-y-5.5 !p-6.5">
        <ExerciseUploadForm />
      </ShowcaseSection>
    </>
  );
}