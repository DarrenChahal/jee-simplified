// Shared types for mock-test question forms

export type QuestionType = 'single_choice' | 'multi_choice' | 'integer'

export interface QuestionOption {
  id: string
  text: string
}

export interface CurrentQuestion {
  _id?: string
  text: string
  type: QuestionType
  options: QuestionOption[]
  images: string[] // Saved backend URLs
  newFiles: { file: File; preview: string }[] // Local files not yet uploaded
  correctAnswer: string | string[] // string for single/integer, string[] for multi
  numericalAnswer: string // For integer type
  for_class: string[]
  subjects: string[]
  topics: string[]
  tags: string[]
  isEditMode: boolean
  editIndex: number
}

export const DEFAULT_OPTIONS: QuestionOption[] = [
  { id: 'a', text: '' },
  { id: 'b', text: '' },
  { id: 'c', text: '' },
  { id: 'd', text: '' },
]

export const DEFAULT_QUESTION: CurrentQuestion = {
  _id: undefined,
  text: '',
  type: 'single_choice',
  options: DEFAULT_OPTIONS.map(o => ({ ...o })),
  images: [],
  newFiles: [],
  correctAnswer: 'a',
  numericalAnswer: '',
  for_class: ['11'],
  subjects: ['Physics'],
  topics: [],
  tags: [],
  isEditMode: false,
  editIndex: -1,
}
