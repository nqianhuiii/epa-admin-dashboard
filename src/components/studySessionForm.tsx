"use client";

import { useState, useEffect } from "react";
import { createStudySession } from "@/app/actions/studySessionActions";
import InputGroup from "./FormElements/InputGroup";
import { TextAreaGroup } from "./FormElements/InputGroup/text-area";
import { StudySession, CreateStudySessionInput } from "@/types/types";
import DatePickerOne from "./FormElements/DatePicker/DatePickerOne";

interface StudySessionFormProps {
  session?: StudySession;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function StudySessionForm({ session, onSuccess, onCancel }: StudySessionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState<CreateStudySessionInput>({
    title: session?.title || "",
    description: session?.description || "",
    date: session?.date || "",
    meetingLink: session?.meetingLink || "",
    teacherName: session?.teacherName || ""
  });

//   useEffect(() => {
//     // Initialize flatpickr
//     const picker = flatpickr(".form-datepicker", {
//       mode: "single",
//       static: true,
//       monthSelectorType: "static",
//       dateFormat: "Y-m-d",
//       defaultDate: session?.date || undefined,
//       minDate: "today",
//       onChange: (selectedDates) => {
//         if (selectedDates.length > 0) {
//           const date = selectedDates[0];
//           const formattedDate = date.toISOString().split('T')[0];
//           setFormData(prev => ({ ...prev, date: formattedDate }));
//         }
//       }
//     });

//     return () => {
//       picker.forEach(p => p.destroy());
//     };
//   }, [session?.date]);

//   const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear message when user starts typing
//     if (message) {
//       setMessage(null);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear message when user starts typing
//     if (message) {
//       setMessage(null);
//     }
//   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear message when starts typing
    if (message) {
      setMessage(null);
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (message) setMessage(null);
  };


const handleDateChange = (dateStr: string) => {
  setFormData((prev) => ({ ...prev, date: dateStr }));
};



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      let result;
      
      if (session) {
        // Update existing session
        // result = await updateStudySession({
        //   id: session.id,
        //   ...formData
        // });
      } else {
        // Create new session
        result = await createStudySession(formData);
      }

      if (result && result.success) {
        setMessage({ type: 'success', text: result.message });
        
        if (!session) {
          // Reset form for new session creation
          setFormData({
            title: "",
            description: "",
            date: "",
            meetingLink: "",
            teacherName: ""
          });
          
          // Reset date picker
          const picker = document.querySelector('.form-datepicker') as any;
          if (picker && picker._flatpickr) {
            picker._flatpickr.clear();
          }
        }
        
        // Call success callback
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else if (result) {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5.5">
      {/* Message Display */}
      {message && (
        <div className={`rounded-[7px] p-4 ${
          message.type === 'success' 
            ? 'bg-green-light-6 text-green dark:bg-green-light-2' 
            : 'bg-red-light-6 text-red dark:bg-red-light-2'
        }`}>
          {message.text}
        </div>
      )}

      <InputGroup
        label="Session Title"
        placeholder="Enter session title"
        name="title"
        value={formData.title}
        handleChange={handleInputChange}
        type="text"
        required
      />

        <TextAreaGroup
           label="Description"
           placeholder="Enter session description"
           name="description"
           value={formData.description}
           onChange={handleTextAreaChange}
           required
        />

        <DatePickerOne
            name="date"
            label="Session Date"
            value={formData.date}
            onChange={handleDateChange}
        />

      {/* Meeting Link Field */}
      <InputGroup
        label="Meeting Link"
        placeholder="https://zoom.us/j/... or https://meet.google.com/..."
        type="url"
        name="meetingLink"
        value={formData.meetingLink}
        handleChange={handleInputChange}
        required
      />

      {/* Teacher Name Field */}
      <InputGroup
        label="Teacher Name"
        placeholder="Enter teacher's name"
        type="text"
        name="teacherName"
        value={formData.teacherName}
        handleChange={handleInputChange}
        required
      />

      {/* Form Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-[7px] bg-primary px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {session ? 'Updating...' : 'Creating...'}
            </div>
          ) : (
            session ? 'Update Session' : 'Create Session'
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-[7px] border border-stroke px-6 py-3 text-center font-medium text-dark hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-white dark:hover:border-primary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}