"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Settings2, CheckCircle2, ListChecks, Type } from "lucide-react"

export type MarkingScheme = {
  single_choice: { correct: number; incorrect: number }
  multi_choice: { correct: number; incorrect: number }
  input: { correct: number; incorrect: number }
}

interface MarkingSchemeInputsProps {
  value: MarkingScheme
  onChange: (value: MarkingScheme) => void
}

export function MarkingSchemeInputs({ value, onChange }: MarkingSchemeInputsProps) {
  const [open, setOpen] = useState(false)
  
  // Local buffer to handle string inputs (allows "", "-", etc. while typing)
  const [buffer, setBuffer] = useState(valueToBuffer(value))

  // Sync buffer from value when dialog opens
  useEffect(() => {
    if (open) {
      setBuffer(valueToBuffer(value))
    }
  }, [open, value])

  const handleBufferChange = (
    type: keyof MarkingScheme,
    field: "correct" | "incorrect",
    val: string
  ) => {
    setBuffer(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: val
      }
    }))
  }

  const handleSave = () => {
    const finalValue = bufferToValue(buffer)
    onChange(finalValue)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button 
                variant="outline" 
                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 h-9 gap-2"
            >
                <Settings2 className="w-4 h-4" />
                Configure Marking Scheme
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Marking Scheme</DialogTitle>
                <DialogDescription>
                    Set marks for correct and incorrect answers.
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
                <div className="space-y-4">
                    <SchemeRow 
                        icon={<CheckCircle2 className="w-4 h-4 text-blue-500" />}
                        title="Single Choice"
                        values={buffer.single_choice}
                        onChange={(f, v) => handleBufferChange("single_choice", f, v)}
                    />
                    <div className="h-px bg-border" />
                    <SchemeRow 
                        icon={<ListChecks className="w-4 h-4 text-purple-500" />}
                        title="Multiple Choice"
                        values={buffer.multi_choice}
                        onChange={(f, v) => handleBufferChange("multi_choice", f, v)}
                    />
                        <div className="h-px bg-border" />
                    <SchemeRow 
                        icon={<Type className="w-4 h-4 text-orange-500" />}
                        title="Integer / Input"
                        values={buffer.input}
                        onChange={(f, v) => handleBufferChange("input", f, v)}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Done</Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

function SchemeRow({
    icon,
    title,
    values,
    onChange
}: {
    icon: React.ReactNode
    title: string
    values: { correct: string; incorrect: string }
    onChange: (field: "correct" | "incorrect", value: string) => void
}) {
    return (
        <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-5 flex items-center gap-2">
                 <div className="p-1.5 bg-muted rounded-md">{icon}</div>
                 <span className="text-sm font-medium">{title}</span>
            </div>
            
            <div className="col-span-7 flex items-center gap-3">
                <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-green-600 text-xs font-bold">+</span>
                    <Input 
                        type="number"
                        className="pl-6 h-9 text-xs"
                        value={values.correct}
                        onChange={(e) => onChange("correct", e.target.value)}
                    />
                     <span className="absolute -bottom-3 left-1 text-[9px] text-muted-foreground">Correct</span>
                </div>
                <div className="relative flex-1">
                    <Input 
                        type="number"
                        className="h-9 text-xs text-red-600"
                        value={values.incorrect}
                        onChange={(e) => onChange("incorrect", e.target.value)}
                    />
                    <span className="absolute -bottom-3 left-1 text-[9px] text-muted-foreground">Incorrect</span>
                </div>
            </div>
        </div>
    )
}

// Helpers for converting between number-based and string-based structures
const valueToBuffer = (v: MarkingScheme) => ({
  single_choice: { correct: v.single_choice.correct.toString(), incorrect: v.single_choice.incorrect.toString() },
  multi_choice: { correct: v.multi_choice.correct.toString(), incorrect: v.multi_choice.incorrect.toString() },
  input: { correct: v.input.correct.toString(), incorrect: v.input.incorrect.toString() },
})

const bufferToValue = (b: ReturnType<typeof valueToBuffer>): MarkingScheme => ({
  single_choice: { correct: parseFloat(b.single_choice.correct) || 0, incorrect: parseFloat(b.single_choice.incorrect) || 0 },
  multi_choice: { correct: parseFloat(b.multi_choice.correct) || 0, incorrect: parseFloat(b.multi_choice.incorrect) || 0 },
  input: { correct: parseFloat(b.input.correct) || 0, incorrect: parseFloat(b.input.incorrect) || 0 },
})
