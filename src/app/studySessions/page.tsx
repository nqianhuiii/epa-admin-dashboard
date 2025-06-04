import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { getStudySessions } from "../actions/studySessionActions";
import StudySessionsList from "@/components/studySessionsList";
import Link from "next/link";
export const metadata: Metadata = {

  title: "Study Sessions",
  description: "Create and manage study sessions"
};

export default async function StudySessionsPage() {
  const initialSessions = await getStudySessions();

  return (
    <>
      <Breadcrumb pageName="Study Sessions" />
        <div className="mb-6 flex justify-end">
            <Link 
                href="/studySessions/create"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
                + Create Study Session
            </Link>
        </div>
        <div className="w-full space-y-6">
            {/* Sessions List - Client Component */}
            <StudySessionsList initialSessions={initialSessions} />
        </div>
    </>
  );
}