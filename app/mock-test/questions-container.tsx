import { ReactNode } from 'react';
import { QuestionsProvider } from './questions-provider';
import { getQuestions } from './hooks/getQuestions';

export async function QuestionsContainer({ children }: { children: ReactNode }) {
  // This runs on the server
  const initialQuestions = await getQuestions();
  
  return (
    <QuestionsProvider initialQuestions={initialQuestions}>
      {children}
    </QuestionsProvider>
  );
} 