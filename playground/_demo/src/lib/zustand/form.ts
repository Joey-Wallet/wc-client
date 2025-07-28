'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

// Define a generic type for form data
interface FormDataObject {
  [key: string]: any; // Flexible key-value pairs for form fields
}

// Extend the Navigation interface to include form data
export interface Navigation {
  step: number;
  setStep: (step: number) => void;
  next: () => void;
  back: () => void;
  data: FormDataObject;
  setData: (data: FormDataObject) => void;
  getFormData: () => FormData;
  clearForm: () => void;
}

// Extend the NavigationStore to include form data
export interface NavigationStore {
  forms: { [formName: string]: { step: number; data: FormDataObject } };
  setStep: (formName: string, step: number) => void;
  setData: (formName: string, data: FormDataObject) => void;
  clearForm: (formName: string) => void;
}

export const useNavigation = create<NavigationStore>()(
  persist(
    (set, get) => ({
      forms: {},
      setStep: (formName: string, step: number) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [formName]: {
              ...state.forms[formName],
              step,
              data: state.forms[formName]?.data || {}, // Preserve existing data
            },
          },
        })),
      setData: (formName: string, data: FormDataObject) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [formName]: {
              ...state.forms[formName],
              step: state.forms[formName]?.step || 1, // Preserve existing step
              data: { ...state.forms[formName]?.data, ...data }, // Merge new data
            },
          },
        })),
      clearForm: (formName: string) =>
        set((state) => {
          return {
            forms: {
              ...state.forms,
              [formName]: { step: 1, data: {} },
            },
          };
        }),
    }),
    {
      name: 'form-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

// Hook to access navigation state for a specific form
export const useFormNavigation = (formName: string): Navigation => {
  const { step: currentStep = 1, data = {} } = useNavigation(
    useShallow((state) => state.forms[formName] || {})
  );
  const { setData, setStep, clearForm } = useNavigation((state) => state);

  // Convert the form data object to FormData for submission
  const getFormData = () => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle arrays (e.g., multiple file uploads or multi-select)
        value.forEach((item) => formData.append(`${key}[]`, item));
      } else if (value instanceof File) {
        // Handle File objects
        formData.append(key, value);
      } else {
        // Handle strings, numbers, etc.
        formData.append(key, String(value));
      }
    });
    return formData;
  };

  return {
    step: currentStep,
    setStep: (step: number) => setStep(formName, step),
    next: () => setStep(formName, currentStep + 1),
    back: () => setStep(formName, Math.max(1, currentStep - 1)),
    data,
    setData: (data: FormDataObject) => setData(formName, data),
    getFormData,
    clearForm: () => clearForm(formName),
  };
};
