// import { getStudySessions } from "@/app/actions/studySessionsActions";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import StudySessionForm from "@/components/studySessionForm";
// import StudySessionsList from "@/components/StudySessionsList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Sessions",
  description: "Create and manage study sessions"
};

export default async function StudySessionsPage() {
//   const initialSessions = await getStudySessions();

  return (
    <>
      <Breadcrumb pageName="Study Sessions" />
      
      <div className="w-full space-y-6">
        {/* Create Form - Client Component */}
        <ShowcaseSection title="Create Study Session" className="space-y-5.5 !p-6.5">
          <StudySessionForm />
        </ShowcaseSection>

        {/* Sessions List - Client Component */}
        {/* <StudySessionsList initialSessions={initialSessions} /> */}
      </div>
    </>
  );
}