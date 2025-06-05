import { getExercise } from "@/app/actions/exerciseAction";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ExerciseList from "@/components/exerciseList";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Exercise Upload",
  description: "Upload and manage exercise"
};

export default async function ExercisePage() {
  const initialExercise = await getExercise();

  return (
    <>
      <Breadcrumb pageName="Exercise" />
      <div className="mb-6 flex justify-end">
        <Link 
          href="/materials/form-exercise/create"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          + Create Exercise
        </Link>
        </div>
        <div className="w-full space-y-6">
          <ExerciseList initialExercise={initialExercise} />
        </div>
    </>
  );
}