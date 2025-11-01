"use client";

import { useState, useEffect, FormEvent } from "react";

import { ListItemFormProps, FormData } from "@/types";

import Modal from "./Modal";


const ListItemForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: ListItemFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    subtitle: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || { title: "", subtitle: "" });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = "Subtitle is required";
    } else if (formData.subtitle.trim().length < 5) {
      newErrors.subtitle = "Subtitle must be at least 5 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      onSubmit({
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
      });
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
      preventCloseOnBackdrop={isSubmitting}
    >
      <form onSubmit={handleSubmit} className="p-3 xs:p-4 sm:p-6">
        <div className="space-y-3 xs:space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2"
            >
              Title *
            </label>
            <input
              autoFocus
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-3 xs:px-4 py-2 xs:py-3 text-sm sm:text-base bg-gray-200 rounded-xl xs:rounded-2xl shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] focus:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.15),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] focus:outline-none transition-all duration-200 ${
                errors.title
                  ? "shadow-[inset_2px_2px_6px_rgba(220,38,38,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]"
                  : ""
              }`}
              placeholder="Enter item title"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-1 xs:mt-2 text-xs sm:text-sm text-red-600 px-1 xs:px-2">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="subtitle"
              className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2"
            >
              Subtitle *
            </label>
            <textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              rows={3}
              className={`w-full px-3 xs:px-4 py-2 xs:py-3 text-sm sm:text-base bg-gray-200 rounded-xl xs:rounded-2xl shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] focus:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.15),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] focus:outline-none transition-all duration-200 resize-none ${
                errors.subtitle
                  ? "shadow-[inset_2px_2px_6px_rgba(220,38,38,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]"
                  : ""
              }`}
              placeholder="Enter item subtitle or description"
              disabled={isSubmitting}
            />
            {errors.subtitle && (
              <p className="mt-1 xs:mt-2 text-xs sm:text-sm text-red-600 px-1 xs:px-2">
                {errors.subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 xs:gap-3 sm:gap-4 mt-4 xs:mt-6 sm:mt-8">
            <p className="text-xs text-gray-500 text-center sm:text-left mb-2 sm:mb-0 sm:flex-1">
            <span className="hidden md:inline">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd>{" "}
              or{" "}
            </span>
            <span className="md:hidden">Tap outside or use Cancel to close</span>
            <span className="hidden md:inline">click outside to close</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-2 xs:gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 xs:px-4 sm:px-6 py-2 xs:py-3 text-xs xs:text-sm sm:text-base font-medium text-gray-700 bg-gray-200 rounded-xl xs:rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.7)] transition-all duration-200 transform active:scale-98 order-2 sm:order-1 cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 xs:px-4 sm:px-6 py-2 xs:py-3 text-xs xs:text-sm sm:text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl xs:rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(59,130,246,0.1)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.25),-6px_-6px_12px_rgba(59,130,246,0.15)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(59,130,246,0.1)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-98 order-1 sm:order-2 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ListItemForm;

/*
USAGE GUIDE - ListItemForm Component

This component provides a modal form for creating and editing list items with validation.

Basic Usage:
```tsx
import { useState } from 'react';
import ListItemForm from '@/components/ListItemForm';
import { FormData } from '@/types';

function MyComponent() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    setIsFormOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsFormOpen(true)}>Add Item</button>
      
      <ListItemForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        title="Create New Item"
      />
    </>
  );
}
```

Props:
- isOpen (boolean): Controls form visibility
- onClose (function): Callback when form should close
- onSubmit (function): Callback when form is submitted with valid data
- initialData? (FormData): Pre-populate form fields for editing
- title? (string): Form modal title

FormData Interface:
```tsx
interface FormData {
  title: string;
  subtitle: string;
}
```

Features:
- Real-time validation
- Error display
- Loading state during submission
- Auto-focus on first field
- Form reset on open/close
- Responsive design
- Neomorphism styling

Examples:

1. Create New Item:
```tsx
<ListItemForm
  isOpen={isCreating}
  onClose={() => setIsCreating(false)}
  onSubmit={handleCreate}
  title="Create New Item"
/>
```

2. Edit Existing Item:
```tsx
<ListItemForm
  isOpen={isEditing}
  onClose={() => setIsEditing(false)}
  onSubmit={handleUpdate}
  initialData={{ title: item.title, subtitle: item.subtitle }}
  title="Edit Item"
/>
```

Validation Rules:
- Title: Required, 2-100 characters
- Subtitle: Optional, max 200 characters

The form automatically validates on submit and shows field-specific error messages.
*/
