import { ReactNode } from 'react';
import { TemplatesProvider } from './templates-provider';
import { getTemplates } from './hooks/getTemplates';

export async function TemplatesContainer({ children }: { children: ReactNode }) {
  // This runs on the server
  const initialTemplates = await getTemplates();
  
  return (
    <TemplatesProvider initialTemplates={initialTemplates}>
      {children}
    </TemplatesProvider>
  );
} 