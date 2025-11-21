import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TestDetails } from "@/app/mock-test/hooks/useTestTemplate";

interface SaveTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string;
  setTemplateName: (name: string) => void;
  templateDescription: string;
  setTemplateDescription: (description: string) => void;
  testDetails: TestDetails;
  onSave: () => void;
  isSaving?: boolean;
}

export function SaveTemplateDialog({
  open,
  onOpenChange,
  templateName,
  setTemplateName,
  templateDescription,
  setTemplateDescription,
  testDetails,
  onSave,
  isSaving = false
}: SaveTemplateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
          <DialogDescription>
            Save this test configuration as a template for future use
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input 
              id="template-name" 
              placeholder="e.g. JEE Advanced Physics Template" 
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              disabled={isSaving}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-description">Template Description</Label>
            <Input 
              id="template-description" 
              placeholder="Brief description of this template" 
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              disabled={isSaving}
            />
          </div>
          
          <div className="bg-muted/30 p-3 rounded text-sm">
            <p className="font-medium mb-2">Template will include:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Subject: {testDetails.subject}</li>
              <li>• Questions: {testDetails.questions}</li>
              <li>• Duration: {testDetails.duration} minutes</li>
              <li>• Difficulty: {testDetails.difficulty}</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="mr-2">Saving...</span>
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full"></div>
              </>
            ) : (
              'Save Template'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 