import { useState } from "react";

export type TestTemplate = {
  name: string;
  description: string;
  template: {
    title: string;
    description: string;
    subject: string[];
    questions: number;
    duration: number;
    difficulty: string;
  };
};

export type TestDetails = {
  title: string;
  description: string;
  subject: string[];
  questions: number;
  duration: number;
  difficulty: string;
  date: string;
  time: string;
};

export function useTestTemplate() {
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [isFromTemplate, setIsFromTemplate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load template from URL params
  const loadTemplateFromParams = (templateParam: string | null, setTestDetails: (details: TestDetails) => void, currentDetails: TestDetails) => {
    if (templateParam) {
      try {
        const template = JSON.parse(decodeURIComponent(templateParam));
        setTestDetails({
          ...currentDetails,
          subject: Array.isArray(template.subject) ? template.subject : [template.subject || "Physics"],
          questions: template.questions || 25,
          duration: template.duration || 90,
          difficulty: template.difficulty || "Medium",
          // Keep title and description blank for user to fill in if they are creating a new test
          // from a pre-existing template
          title: template.title || "",
          description: template.description || "",
        });
        setIsFromTemplate(true);
      } catch (e) {
        console.error("Error parsing template:", e);
      }
    }
  };

  // Save test configuration as a template
  const saveTemplate = async (testDetails: TestDetails) => {
    if (!templateName) {
      alert("Please provide a template name");
      return false;
    }
    
    setIsSaving(true);

    try {
      const templateData = {
        name: templateName,
        description: templateDescription,
        subject: testDetails.subject,
        questions: testDetails.questions,
        duration: testDetails.duration,
        difficulty: testDetails.difficulty
      };

      // Post to API through server route
      const response = await fetch('/mock-test/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Template "${templateName}" saved successfully!`);
        setShowSaveTemplateDialog(false);
        return true;
      } else {
        alert(`Error saving template: ${data.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    showSaveTemplateDialog,
    setShowSaveTemplateDialog,
    templateName,
    setTemplateName,
    templateDescription,
    setTemplateDescription,
    isFromTemplate,
    setIsFromTemplate,
    loadTemplateFromParams,
    saveTemplate,
    isSaving,
  };
} 