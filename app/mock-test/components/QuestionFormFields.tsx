"use client"

import { useRef } from "react"
import { Eye, EyeOff, Upload, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { BlockMath } from "react-katex"
import { toast } from "@/components/ui/use-toast"
import { CurrentQuestion, QuestionType } from "@/app/mock-test/types"
import 'katex/dist/katex.min.css'
import katex from 'katex'

// ─────────────────────────────────────────────────────────────────────────────
// Prop types
// ─────────────────────────────────────────────────────────────────────────────

export interface QuestionFormFieldsProps {
  /** Full current question state */
  currentQuestion: CurrentQuestion
  /** Setter for current question state */
  onChange: (q: CurrentQuestion) => void
  /** Step within the add-question sub-flow */
  addQuestionStep: 'type-selection' | 'details'
  /** Callback to change the sub-step */
  onStepChange: (step: 'type-selection' | 'details') => void
  /** Whether the LaTeX preview panel is visible */
  showPreview: boolean
  /** Toggle the preview panel */
  onTogglePreview: () => void
  /** LaTeX render errors keyed by option index (-1 = question text) */
  latexErrors: Record<number, string | null>
  /** Validate a latex string and update latexErrors */
  onValidateLatex: (text: string, index: number) => void
  /** Called when the user clicks Add/Update Question */
  onSubmit: () => void
  /** Called when the user wants to cancel / clear the form */
  onCancel: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper – type label
// ─────────────────────────────────────────────────────────────────────────────

function typeLabel(type: QuestionType): string {
  return type === 'single_choice' ? 'Single Correct'
    : type === 'multi_choice' ? 'Multiple Correct'
    : 'Integer Type'
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function QuestionFormFields({
  currentQuestion,
  onChange,
  addQuestionStep,
  onStepChange,
  showPreview,
  onTogglePreview,
  latexErrors,
  onValidateLatex,
  onSubmit,
  onCancel,
}: QuestionFormFieldsProps) {

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── helpers ────────────────────────────────────────────────────────────────

  const set = (partial: Partial<CurrentQuestion>) =>
    onChange({ ...currentQuestion, ...partial })

  const toggleChip = (field: 'for_class' | 'subjects', value: string) => {
    const arr = currentQuestion[field] as string[]
    set({ [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] })
  }

  const removeChip = (field: 'topics' | 'tags', index: number) => {
    const arr = [...(currentQuestion[field] as string[])]
    arr.splice(index, 1)
    set({ [field]: arr })
  }

  const addChipOnEnter = (field: 'topics' | 'tags', e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const val = e.currentTarget.value.trim()
    const arr = currentQuestion[field] as string[]
    if (val && !arr.includes(val)) {
      set({ [field]: [...arr, val] })
      e.currentTarget.value = ''
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const filesArray = Array.from(e.target.files)
    const currentTotal = currentQuestion.images.length + currentQuestion.newFiles.length
    const maxImages = 3
    const remaining = maxImages - currentTotal

    if (remaining <= 0) {
      toast({ title: "Image limit reached", description: "Maximum 3 images per question.", variant: "destructive" })
      e.target.value = ''
      return
    }

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    const valid: File[] = []
    const invalid: string[] = []
    filesArray.forEach(f => (allowed.includes(f.type) ? valid.push(f) : invalid.push(f.name)))

    if (invalid.length > 0) {
      toast({ title: "Invalid file type", description: `Skipped: ${invalid.join(', ')}`, variant: "destructive" })
    }

    const toAdd = valid.slice(0, remaining)
    if (valid.length > remaining) {
      toast({ title: "Some images skipped", description: `Only ${remaining} image(s) can still be added.`, variant: "destructive" })
    }

    if (toAdd.length > 0) {
      const newFileObjects = toAdd.map(file => ({ file, preview: URL.createObjectURL(file) }))
      set({ newFiles: [...currentQuestion.newFiles, ...newFileObjects] })
    }

    e.target.value = ''
  }

  const removeExistingImage = (idx: number) => {
    set({ images: currentQuestion.images.filter((_, i) => i !== idx) })
  }

  const removeNewFile = (idx: number) => {
    URL.revokeObjectURL(currentQuestion.newFiles[idx].preview)
    set({ newFiles: currentQuestion.newFiles.filter((_, i) => i !== idx) })
  }

  const isMultiAnswerSelected = (id: string) =>
    Array.isArray(currentQuestion.correctAnswer) && (currentQuestion.correctAnswer as string[]).includes(id)

  const toggleMultiAnswer = (id: string) => {
    const current = (currentQuestion.correctAnswer as string[]) ?? []
    set({ correctAnswer: current.includes(id) ? current.filter(x => x !== id) : [...current, id] })
  }

  // ── type-selection ─────────────────────────────────────────────────────────

  const typeCards: { type: QuestionType; title: string; description: string }[] = [
    { type: 'single_choice', title: 'Single Correct', description: 'Traditional multiple choice with one correct answer' },
    { type: 'multi_choice', title: 'Multiple Correct', description: 'Multiple choice where more than one option can be correct' },
    { type: 'integer', title: 'Integer Type', description: 'Questions with a numerical valid answer input' },
  ]

  if (addQuestionStep === 'type-selection' && !currentQuestion.isEditMode) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {typeCards.map(({ type, title, description }) => (
          <Card
            key={type}
            className="p-6 cursor-pointer hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all flex flex-col items-center justify-center text-center gap-3 group"
            onClick={() => {
              onChange({
                ...currentQuestion,
                type,
                correctAnswer: type === 'multi_choice' ? [] : type === 'integer' ? '' : 'a',
              })
              onStepChange('details')
            }}
          >
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground group-hover:text-blue-100">{description}</p>
          </Card>
        ))}
      </div>
    )
  }

  // ── details form ───────────────────────────────────────────────────────────

  const totalImages = currentQuestion.images.length + currentQuestion.newFiles.length

  return (
    <div className="space-y-6">

      {/* ── Type badge + change button ──────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Type:</span>
          <Badge variant="outline">{typeLabel(currentQuestion.type)}</Badge>
        </div>
        {!currentQuestion.isEditMode && (
          <Button variant="ghost" size="sm" onClick={() => onStepChange('type-selection')}>
            Change Type
          </Button>
        )}
      </div>

      {/* ── Class + Subject ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Class</Label>
          <div className="flex flex-wrap gap-2">
            {['11', '12', 'dropper'].map(cls => {
              const isSelected = currentQuestion.for_class?.includes(cls)
              return (
                <div
                  key={cls}
                  onClick={() => toggleChip('for_class', cls)}
                  className={`cursor-pointer px-4 py-2 rounded-full border transition-all text-sm font-medium capitalize
                    ${isSelected ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20' : 'bg-background border-muted hover:border-gray-400 text-muted-foreground'}`}
                >
                  {cls}
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Subject</Label>
          <div className="flex flex-wrap gap-2">
            {['Physics', 'Chemistry', 'Mathematics'].map(sub => {
              const isSelected = currentQuestion.subjects?.includes(sub)
              return (
                <div
                  key={sub}
                  onClick={() => toggleChip('subjects', sub)}
                  className={`cursor-pointer px-4 py-2 rounded-full border transition-all text-sm font-medium
                    ${isSelected ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20' : 'bg-background border-muted hover:border-gray-400 text-muted-foreground'}`}
                >
                  {sub}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Topics + Tags ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['topics', 'tags'] as const).map(field => (
          <div key={field} className="space-y-2">
            <Label htmlFor={`question-${field}`}>{field.charAt(0).toUpperCase() + field.slice(1)} (Press Enter to add)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(currentQuestion[field] as string[]).map((item, i) => (
                <Badge key={i} variant="secondary" className="flex items-center gap-1">
                  {item}
                  <button onClick={() => removeChip(field, i)} className="ml-1 hover:text-destructive">×</button>
                </Badge>
              ))}
            </div>
            <Input
              id={`question-${field}`}
              placeholder={`Add a ${field.slice(0, -1)}…`}
              onKeyDown={e => addChipOnEnter(field, e)}
            />
          </div>
        ))}
      </div>

      {/* ── Question Text + Preview toggle ──────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Label htmlFor="question-text">Question Text (LaTeX supported)</Label>
          <button
            type="button"
            onClick={onTogglePreview}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ml-2
              ${showPreview ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        <textarea
          id="question-text"
          placeholder="Enter the question text"
          value={currentQuestion.text}
          onChange={e => {
            set({ text: e.target.value })
            onValidateLatex(e.target.value, -1)
          }}
          className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
        {latexErrors[-1] && <p className="text-red-600 text-sm">{latexErrors[-1]}</p>}

        {showPreview && !latexErrors[-1] && (
          <div className="border rounded p-4 bg-gray-50 dark:bg-gray-900/30 mt-2 break-words">
            <div className="overflow-x-auto">
              <BlockMath math={currentQuestion.text || '\\text{(empty)}'} />
            </div>

            {/* Images in preview */}
            {totalImages > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Attached Images:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentQuestion.images.map((url, idx) => (
                    <div key={`prev-exist-${idx}`} className="relative">
                      <img src={url} alt={`Attachment ${idx + 1}`}
                        className="rounded border border-gray-200 dark:border-gray-700 max-h-40 w-full object-contain bg-white dark:bg-gray-800" />
                      <span className="absolute top-1 left-1 bg-gray-800/70 text-white text-[10px] px-1.5 py-0.5 rounded">Saved</span>
                    </div>
                  ))}
                  {currentQuestion.newFiles.map((item, idx) => (
                    <div key={`prev-new-${idx}`} className="relative">
                      <img src={item.preview} alt={`New Attachment ${idx + 1}`}
                        className="rounded border border-blue-300 dark:border-blue-700 max-h-40 w-full object-contain bg-white dark:bg-gray-800" />
                      <span className="absolute top-1 left-1 bg-blue-600/90 text-white text-[10px] px-1.5 py-0.5 rounded">New</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Image Attachments ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Image Attachments</Label>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full
            ${totalImages >= 3
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
            {totalImages}/3 images
          </span>
        </div>

        <div>
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-blue-50/30 hover:bg-blue-50 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800 transition-all duration-200 group"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-3 group-hover:scale-110 transition-transform duration-200">
                <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, GIF, or WEBP (max 3 images)</p>
            </div>
            <input
              id="dropzone-file"
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              onChange={handleFileChange}
            />
          </label>

          {totalImages > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {currentQuestion.images.map((url, idx) => (
                <div key={`img-exist-${idx}`} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                  <img src={url} alt={`Attachment ${idx + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity" title="Remove">
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-0.5">Saved</div>
                </div>
              ))}
              {currentQuestion.newFiles.map((item, idx) => (
                <div key={`img-new-${idx}`} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-blue-200">
                  <img src={item.preview} alt={`New Attachment ${idx + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNewFile(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity" title="Remove">
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500/50 text-white text-[10px] px-2 py-0.5">New</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Answer Options (hidden for integer) ─────────────────────────── */}
      {currentQuestion.type !== 'integer' && (
        <div className="space-y-4">
          <Label>Answer Options</Label>
          {currentQuestion.options.map((option, index) => (
            <div key={option.id} className="flex flex-col gap-2">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-md font-medium flex-shrink-0 mt-1">
                  {option.id.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <textarea
                    placeholder={`Option ${option.id.toUpperCase()}`}
                    value={option.text}
                    onChange={e => {
                      const newOptions = currentQuestion.options.map((o, i) =>
                        i === index ? { ...o, text: e.target.value } : o
                      )
                      set({ options: newOptions })
                      onValidateLatex(e.target.value, index)
                    }}
                    className="w-full min-h-[60px] p-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                  />
                  {latexErrors[index] && <p className="text-red-600 text-sm mt-1">{latexErrors[index]}</p>}
                </div>
              </div>
              {showPreview && !latexErrors[index] && option.text && (
                <div className="ml-12">
                  <div className="border rounded p-3 bg-gray-50 break-words">
                    <div className="overflow-x-auto">
                      <BlockMath math={option.text} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Correct Answer ──────────────────────────────────────────────── */}
      <div className="space-y-2">
        <Label htmlFor="correct-answer">Correct Answer</Label>

        {/* Single choice */}
        {currentQuestion.type === 'single_choice' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['a', 'b', 'c', 'd'].map(optId => {
              const isSelected = currentQuestion.correctAnswer === optId
              return (
                <div
                  key={optId}
                  onClick={() => set({ correctAnswer: optId })}
                  className={`cursor-pointer flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200
                    ${isSelected ? 'border-primary bg-primary text-primary-foreground shadow-md' : 'border-muted hover:border-primary/50 hover:bg-muted/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors
                      ${isSelected ? 'bg-white border-white' : 'border-gray-400'}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="font-semibold text-base">Option {optId.toUpperCase()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Multi choice */}
        {currentQuestion.type === 'multi_choice' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['a', 'b', 'c', 'd'].map(optId => {
              const isSelected = isMultiAnswerSelected(optId)
              return (
                <div
                  key={optId}
                  onClick={() => toggleMultiAnswer(optId)}
                  className={`cursor-pointer flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200
                    ${isSelected ? 'border-primary bg-primary text-primary-foreground shadow-md' : 'border-muted hover:border-primary/50 hover:bg-muted/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors
                      ${isSelected ? 'bg-white text-primary border-white' : 'border-gray-400'}`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="font-semibold text-base">Option {optId.toUpperCase()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Integer type */}
        {currentQuestion.type === 'integer' && (
          <Input
            type="text"
            placeholder="Enter numerical answer (e.g. 5, 2.5, -10)"
            value={currentQuestion.numericalAnswer || ''}
            onChange={e => set({ numericalAnswer: e.target.value })}
          />
        )}
      </div>

      {/* ── Action Buttons ──────────────────────────────────────────────── */}
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={onCancel}>
          {currentQuestion.isEditMode ? 'Cancel Edit' : 'Clear Form'}
        </Button>
        <Button className="takeuforward-button" onClick={onSubmit}>
          {currentQuestion.isEditMode ? 'Update Question' : 'Add Question'}
        </Button>
      </div>
    </div>
  )
}
