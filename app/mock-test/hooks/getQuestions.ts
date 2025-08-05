'use server';

import { cache } from 'react';

// Define Question interface
export interface Question {
  _id: string;
  subjects: string[];
  for_class: string[];
  topics: string[];
  difficulty: string;
  question_text: string;
  answer: {
    type: string;
    options: string[];
    correct_answer: string;
  };
  tags: string[];
  status: string;
  created_by: string;
  createdAt?: string;
  updatedAt?: string;
}

// Cache the questions fetch for better performance
export const getQuestions = cache(async (): Promise<Question[]> => {
  try {
    // Use relative URL for server-side fetch
    const response = await fetch('https://jee-simplified-api-1075829581.us-central1.run.app/api/questions');
    
    if (!response.ok) {
      console.error(`Error fetching questions: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    if (data.success && Array.isArray(data.questions)) {
      return data.questions;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}); 