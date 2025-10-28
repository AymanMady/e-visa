import { useCallback, useEffect, useRef } from 'react';

interface UseFormPersistenceProps {
  formData: any;
  setFormData: (data: any) => void;
  completedSteps: Set<number>;
  setCompletedSteps: (steps: Set<number>) => void;
  debounceMs?: number;
}

export const useFormPersistence = ({
  formData,
  setFormData,
  completedSteps,
  setCompletedSteps,
  debounceMs = 1000
}: UseFormPersistenceProps) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Debounced save function
  const saveToLocalStorage = useCallback((data: any, steps: Set<number>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('visa-form-data', JSON.stringify(data));
        localStorage.setItem('visa-completed-steps', JSON.stringify([...steps]));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }, debounceMs);
  }, [debounceMs]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedFormData = localStorage.getItem('visa-form-data');
      if (savedFormData) {
        const parsed = JSON.parse(savedFormData);
        setFormData(prev => ({ ...prev, ...parsed }));
      }
      
      const savedCompletedSteps = localStorage.getItem('visa-completed-steps');
      if (savedCompletedSteps) {
        const parsed = JSON.parse(savedCompletedSteps);
        setCompletedSteps(new Set(parsed));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, [setFormData, setCompletedSteps]);

  // Save when form data changes
  useEffect(() => {
    saveToLocalStorage(formData, completedSteps);
  }, [formData, completedSteps, saveToLocalStorage]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem('visa-form-data');
    localStorage.removeItem('visa-completed-steps');
    localStorage.removeItem('current-application-id');
  }, []);

  return { clearSavedData };
};
