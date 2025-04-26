import { ReactNode } from 'react';
import { TestsProvider } from './tests-provider';
import { getTests } from './hooks/getTests';

export async function TestsContainer({ children }: { children: ReactNode }) {
  // This runs on the server
  const initialTests = await getTests();
  
  return (
    <TestsProvider initialTests={initialTests}>
      {children}
    </TestsProvider>
  );
} 