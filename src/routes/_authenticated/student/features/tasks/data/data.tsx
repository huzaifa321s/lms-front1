import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconCircle,
  IconCircleCheck,
  IconCircleX,
  IconExclamationCircle,
  IconFunctionOff,
  IconStopwatch,
} from '@tabler/icons-react'

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
    icon: IconExclamationCircle,
  },
  {
    value: 'open',
    label: 'Open',
    icon: IconCircle,
  },
  {
    value: 'paid',
    label: 'Paid',
    icon: IconCircleCheck,
  },
  {
    value: 'void',
    label: 'Void',
    icon: IconCircleX,
  },
  {
    value: 'uncollectible',
    label: 'Uncollectible',
    icon: IconFunctionOff,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: IconArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: IconArrowRight,
  },
  {
    label: 'High',
    value: 'high',
    icon: IconArrowUp,
  },
]
