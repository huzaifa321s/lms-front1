import { ArrowDown, ArrowRight, ArrowUp, Circle, CircleCheck, CircleX, FileQuestionIcon, FunctionSquare } from 'lucide-react'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'draft',
    label: 'Draft',
    icon: FileQuestionIcon,
  },
  {
    value: 'open',
    label: 'Open',
    icon: Circle,
  },
  {
    value: 'paid',
    label: 'Paid',
    icon: CircleCheck,
  },
  {
    value: 'void',
    label: 'Void',
    icon: CircleX,
  },
  {
    value: 'uncollectible',
    label: 'Uncollectible',
    icon: FunctionSquare,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: ArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: ArrowRight,
  },
  {
    label: 'High',
    value: 'high',
    icon: ArrowUp,
  },
]
