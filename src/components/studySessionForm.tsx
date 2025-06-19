"use client";

import { useState } from "react";
import { createStudySession, updateStudySession } from "@/app/actions/studySessionActions";
import InputGroup from "./FormElements/InputGroup";
import { TextAreaGroup } from "./FormElements/InputGroup/text-area";
import { StudySession, CreateStudySessionInput } from "@/types/types";
import DatePickerOne from "./FormElements/DatePicker/DatePickerOne";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IonIcon } from '@ionic/react';
import { cloudUploadOutline, closeOutline } from 'ionicons/icons';

// interface ExtendedStudySessionInput extends CreateStudySessionInput {
//   time: string;
//   tutorImage?: File | null;
// }

interface StudySessionFormProps {
  session?: StudySession;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function StudySessionForm({
  session,
  onSuccess,
  onCancel,
}: StudySessionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<CreateStudySessionInput>({
    title: session?.title || "",
    description: session?.description || "",
    date: session?.date || "",
    time: session?.time || "",
    meetingLink: session?.meetingLink || "",
    teacherName: session?.teacherName || "",
    tutorImage: session?.tutorImage || "",
  });

  // Convert time string to Date object for initial picker value
  const getTimeValue = (timeString: string): Date | null => {
    if (!timeString) return null;
    const today = new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const date = new Date(today);
      date.setHours(hours, minutes, 0, 0);
      return date;
    }
    return null;
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (message) setMessage(null);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (message) setMessage(null);
  };

  const handleDateChange = (dateStr: string) => {
    setFormData((prev) => ({ ...prev, date: dateStr }));
  };

  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time);
    if (time) {
      const formattedTime = time.toTimeString().slice(0, 5); // HH:mm
      setFormData((prev) => ({ ...prev, time: formattedTime }));
    } else {
      setFormData((prev) => ({ ...prev, time: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: "error", text: "Please select a valid image file" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size should be less than 5MB" });
        return;
      }

      setFormData((prev) => ({ ...prev, tutorImage: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, tutorImage: null }));
    setImagePreview(null);
    const fileInput = document.getElementById('tutorImage') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      let result;

      if (session) {
        result = await updateStudySession({ id: session.id, ...formData });
      } else {
        result = await createStudySession(formData);
      }

      if (result && result.success) {
        setMessage({ type: "success", text: result.message });

        if (!session) {
          setFormData({
            title: "",
            description: "",
            date: "",
            time: "",
            meetingLink: "",
            teacherName: "",
            tutorImage: null,
          });
          setSelectedTime(null);
          setImagePreview(null);
        }
        
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }

        router.push('/studySessions');
        router.refresh();

      } else if (result) {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5.5">
      {message && (
        <div
          className={`rounded-[7px] p-4 ${
            message.type === "success"
              ? "bg-green-light-6 text-green dark:bg-green-light-2"
              : "bg-red-light-6 text-red dark:bg-red-light-2"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-5">
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
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Start Time
            </label>
            <DatePicker
              selected={selectedTime}
              onChange={handleTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="HH:mm"
              placeholderText="Select time"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <InputGroup
            label="Meeting Link"
            placeholder="https://zoom.us/j/... or https://meet.google.com/..."
            type="url"
            name="meetingLink"
            value={formData.meetingLink}
            handleChange={handleInputChange}
            required
          />

          <InputGroup
            label="Tutor Name"
            placeholder="Enter tutor's name"
            type="text"
            name="teacherName"
            value={formData.teacherName}
            handleChange={handleInputChange}
            required
          />

          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Tutor Picture
            </label>
            <div className="space-y-3">
              {!imagePreview ? (
                <label
                  htmlFor="tutorImage"
                  className="flex cursor-pointer items-center justify-center rounded-[7px] border-2 border-dashed border-stroke bg-gray-1 p-6 hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:hover:bg-dark-3"
                >
                  <div className="text-center">
                    <IonIcon icon={cloudUploadOutline} className="mx-auto mb-2 size-8 text-gray-5" />
                    <p className="text-sm text-gray-5">Click to upload tutor image</p>
                    <p className="text-xs text-gray-4 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </label>
              ) : (
                <div className="flex items-center justify-center p-4 border-2 border-dashed border-stroke bg-gray-1 rounded-[7px] dark:border-dark-3 dark:bg-dark-2">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Tutor preview"
                      className="h-24 w-24 rounded-lg object-cover border-2 border-white shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -right-2 -top-2 rounded-full bg-red p-1 text-white hover:bg-red-dark shadow-lg"
                    >
                      <IonIcon icon={closeOutline} className="size-4" />
                    </button>
                  </div>
                </div>
              )}
              <input
                id="tutorImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-[7px] bg-primary px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50 disabled:cursor-not-allowed mt-8 mb-9"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {session ? "Updating..." : "Creating..."}
            </div>
          ) : session ? "Update Session" : "Create Session"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-[7px] border border-stroke px-6 py-3 text-center font-medium text-dark hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-white dark:hover:border-primary mt-8 mb-9"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
