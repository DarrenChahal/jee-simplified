import { TemplatesContainer } from './templates-container';
import { QuestionsContainer } from './questions-container';
import { TestsContainer } from './tests-container';

export default function MockTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TemplatesContainer>
      <QuestionsContainer>
        <TestsContainer>
          {children}
        </TestsContainer>
      </QuestionsContainer>
    </TemplatesContainer>
  );
} 