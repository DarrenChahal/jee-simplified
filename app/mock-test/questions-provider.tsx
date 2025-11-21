'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { Question } from './hooks/getQuestions';

type QuestionsContextType = {
  questions: Question[];
  isLoading: boolean;
  refreshQuestions: () => Promise<void>;
  addQuestion: (questionData: Omit<Question, '_id'>) => Promise<boolean>;
  updateQuestion: (id: string, questionData: Partial<Question>) => Promise<boolean>;
  deleteQuestion: (id: string) => Promise<boolean>;
};

// Create context with default values
const QuestionsContext = createContext<QuestionsContextType>({
  questions: [],
  isLoading: true,
  refreshQuestions: async () => {},
  addQuestion: async () => false,
  updateQuestion: async () => false,
  deleteQuestion: async () => false,
});

// Hook to use questions
export const useQuestions = () => useContext(QuestionsContext);

interface QuestionsProviderProps {
  initialQuestions: Question[];
  children: ReactNode;
}

export function QuestionsProvider({ initialQuestions, children }: QuestionsProviderProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [isLoading, setIsLoading] = useState(false);
  
  const refreshQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/mock-test/api/questions');
      const data = await response.json();
      
      if (data.success && data.questions) {
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error('Error refreshing questions:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addQuestion = async (questionData: Omit<Question, '_id'>): Promise<boolean> => {
    try {
      const response = await fetch('/mock-test/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });
      
      const data = await response.json();
      
      if (data.success && data.question) {
        setQuestions([...questions, data.question]);
        return true;
      } else {
        console.error('Failed to add question:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error adding question:', error);
      return false;
    }
  };
  
  const updateQuestion = async (id: string, questionData: Partial<Question>): Promise<boolean> => {
    try {
      const response = await fetch('/mock-test/api/questions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id, ...questionData }),
      });
      
      const data = await response.json();
      
      if (data.success && data.question) {
        setQuestions(questions.map(q => q._id === id ? { ...q, ...data.question } : q));
        return true;
      } else {
        console.error('Failed to update question:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error updating question:', error);
      return false;
    }
  };
  
  const deleteQuestion = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/mock-test/api/questions?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setQuestions(questions.filter(question => question._id !== id));
        return true;
      } else {
        console.error('Failed to delete question:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      return false;
    }
  };
  
  // Value to provide through context
  const contextValue = {
    questions,
    isLoading,
    refreshQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
  
  return (
    <QuestionsContext.Provider value={contextValue}>
      {children}
    </QuestionsContext.Provider>
  );
} 