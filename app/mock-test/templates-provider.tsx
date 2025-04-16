'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Template } from './hooks/getTemplates';

type TemplatesContextType = {
  templates: Template[];
  isLoading: boolean;
  refreshTemplates: () => Promise<void>;
  deleteTemplate: (id: string) => Promise<boolean>;
};

// Create context with default values
const TemplatesContext = createContext<TemplatesContextType>({
  templates: [],
  isLoading: true,
  refreshTemplates: async () => {},
  deleteTemplate: async () => false,
});

// Hook to use templates
export const useTemplates = () => useContext(TemplatesContext);

type TemplatesProviderProps = {
  initialTemplates: Template[];
  children: ReactNode;
};

export function TemplatesProvider({ initialTemplates, children }: TemplatesProviderProps) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [isLoading, setIsLoading] = useState(false);
  
  const refreshTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/mock-test/api/templates');
      const data = await response.json();
      
      if (data.success && data.templates) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error refreshing templates:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteTemplate = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/mock-test/api/templates?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the local state by removing the deleted template
        setTemplates(templates.filter(template => template._id !== id));
        return true;
      } else {
        console.error('Failed to delete template:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  };
  
  // Value to provide through context
  const contextValue = {
    templates,
    isLoading,
    refreshTemplates,
    deleteTemplate,
  };
  
  return (
    <TemplatesContext.Provider value={contextValue}>
      {children}
    </TemplatesContext.Provider>
  );
} 