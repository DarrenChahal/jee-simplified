'use server';

import { cache } from 'react';

// Define Template interface so it can be shared
export interface Template {
  _id: string;
  name: string;
  description: string;
  subject: string[] | string;
  questions: number;
  duration: number;
  difficulty: string;
  createdAt?: number;
  updatedAt?: number;
}

// Cache the template fetch for better performance
export const getTemplates = cache(async (): Promise<Template[]> => {
  try {
    // Use relative URL for server-side fetch
    const response = await fetch('https://jee-simplified-api-1075829581.us-central1.run.app/api/templates');
    
    if (!response.ok) {
      console.error(`Error fetching templates: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    if (data.success && Array.isArray(data.templates)) {
      return data.templates;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
}); 