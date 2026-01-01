'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { Test } from './hooks/getTests';

type TestsContextType = {
  tests: Test[];
  isLoading: boolean;
  refreshTests: () => Promise<void>;
  addTest: (testData: Omit<Test, '_id'>) => Promise<boolean>;
  updateTest: (id: string, testData: Partial<Test>) => Promise<boolean>;
  deleteTest: (id: string) => Promise<boolean>;
};

// Create context with default values
const TestsContext = createContext<TestsContextType>({
  tests: [],
  isLoading: true,
  refreshTests: async () => {},
  addTest: async () => false,
  updateTest: async () => false,
  deleteTest: async () => false,
});

// Hook to use tests
export const useTests = () => useContext(TestsContext);

interface TestsProviderProps {
  initialTests: Test[];
  children: ReactNode;
}

export function TestsProvider({ initialTests, children }: TestsProviderProps) {
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [isLoading, setIsLoading] = useState(false);
  
  const refreshTests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/mock-test/api/tests');
      const data = await response.json();
      
      if (data.success && data.tests) {
        setTests(data.tests);
      }
    } catch (error) {
      console.error('Error refreshing tests:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addTest = async (testData: Omit<Test, '_id'>): Promise<boolean> => {
    try {
      const response = await fetch('/mock-test/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      
      const data = await response.json();
      
      if (data.success && data.test) {
        setTests([...tests, data.test]);
        return true;
      } else {
        console.error('Failed to add test:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error adding test:', error);
      return false;
    }
  };
  
  const updateTest = async (id: string, testData: Partial<Test>): Promise<boolean> => {
    try {
      const response = await fetch('/mock-test/api/tests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id, ...testData }),
      });
      
      const data = await response.json();
      
      if (data.success && data.test) {
        setTests(tests.map(t => t._id === id ? { ...t, ...data.test } : t));
        return true;
      } else {
        console.error('Failed to update test:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error updating test:', error);
      return false;
    }
  };
  
  const deleteTest = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/mock-test/api/tests?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTests(tests.filter(test => test._id !== id));
        return true;
      } else {
        console.error('Failed to delete test:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting test:', error);
      return false;
    }
  };
  
  // Value to provide through context
  const contextValue = {
    tests,
    isLoading,
    refreshTests,
    addTest,
    updateTest,
    deleteTest,
  };
  
  return (
    <TestsContext.Provider value={contextValue}>
      {children}
    </TestsContext.Provider>
  );
} 