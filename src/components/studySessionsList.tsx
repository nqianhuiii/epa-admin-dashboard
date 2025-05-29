"use client";

import { useState } from "react";
import { StudySession } from "@/types/types";
import { deleteStudySession } from "@/app/actions/studySessionActions";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import StudySessionForm from "./studySessionForm";
import { DeleteStudySessionForm } from "./DeleteStudySessionForm";

interface StudySessionsListProps {
  initialSessions: StudySession[];
}

export default function StudySessionsList({ initialSessions }: StudySessionsListProps) {
  const [sessions, setSessions] = useState<StudySession[]>(initialSessions);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this study session?')) {
      return;
    }

    setDeletingId(id);
    
    try {
      const result = await deleteStudySession(id);
      
      if (result.success) {
        setSessions(prev => prev.filter(session => session.id !== id));
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to delete study session. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSuccess = () => {
    setEditingSession(null);
    // Refresh the page to get updated data
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (dateString: string) => {
    const sessionDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessionDate >= today;
  };

  const getStatusBadge = (dateString: string) => {
    const upcoming = isUpcoming(dateString);
    return (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        upcoming 
          ? 'bg-green-light-5 text-green dark:bg-green-light-2'
          : 'bg-gray-light-5 text-gray-dark dark:bg-gray-light-2'
      }`}>
        {upcoming ? 'Upcoming' : 'Past'}
      </span>
    );
  };

  if (editingSession) {
    return (
      <ShowcaseSection title="Edit Study Session" className="space-y-5.5 !p-6.5">
        <StudySessionForm
          session={editingSession}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingSession(null)}
        />
      </ShowcaseSection>
    );
  }

  return (
    <ShowcaseSection title="Study Sessions" className="space-y-5.5 !p-6.5">
      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-body text-dark-4 dark:text-dark-6 mb-2">
            No study sessions found
          </div>
          <p className="text-body-sm text-dark-5 dark:text-dark-6">
            Create your first study session to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-body-lg font-semibold text-dark dark:text-white">
                      {session.title}
                    </h3>
                    {getStatusBadge(session.date)}
                  </div>
                  <p className="text-body text-dark-4 dark:text-dark-6 mb-3">
                    {session.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-body-sm font-medium text-dark-5 dark:text-dark-6">
                    Date:
                  </span>
                  <p className="text-body text-dark dark:text-white">
                    {formatDate(session.date)}
                  </p>
                </div>
                <div>
                  <span className="text-body-sm font-medium text-dark-5 dark:text-dark-6">
                    Teacher:
                  </span>
                  <p className="text-body text-dark dark:text-white">
                    {session.teacherName}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-body-sm font-medium text-dark-5 dark:text-dark-6">
                  Meeting Link:
                </span>
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-primary hover:text-primary-dark underline block mt-1"
                >
                  {session.meetingLink}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-body-sm text-dark-5 dark:text-dark-6">
                  Created: {formatDateTime(session.createdAt)}
                  {session.updatedAt !== session.createdAt && (
                    <span className="ml-2">
                      • Updated: {formatDateTime(session.updatedAt)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingSession(session)}
                    className="inline-flex items-center justify-center rounded-[7px] border border-primary px-4 py-2 text-center font-medium text-primary hover:bg-primary hover:text-white"
                  >
                    Edit
                  </button>
                  
                    <DeleteStudySessionForm
                        sessionId={session.id}
                        sessionTitle={session.title}
                        onSuccess={() => setSessions((prev) => prev.filter((s) => s.id !== session.id))}
                    />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ShowcaseSection>
  );
}