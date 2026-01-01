'use server';

import { cache } from 'react';
import { apiUrls } from '@/environments/prod';

// Define Test interface
export interface Test {
  _id: string;
  title: string;
  description: string;
  subject: string;
  questions: number;
  duration: number;
  difficulty: string;
  date: string;
  time: string;
  status: string;
  question_ids?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Cache the tests fetch for better performance
export const getTests = cache(async (): Promise<Test[]> => {
  try {
    // Use relative URL for server-side fetch
    const response = await fetch(apiUrls.tests.getAll);

    if (!response.ok) {
      console.error(`Error fetching tests: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.tests)) {
      return data.tests;
    }

    return [];
  } catch (error) {
    console.error('Error fetching tests:', error);
    return [];
  }
}); 