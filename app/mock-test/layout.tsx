import { TemplatesContainer } from './templates-container';

export default function MockTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TemplatesContainer>
      {children}
    </TemplatesContainer>
  );
} 