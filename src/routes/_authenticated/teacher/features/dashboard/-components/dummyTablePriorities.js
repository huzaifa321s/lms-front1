import { CircleCheck, CircleX, FileQuestion, Heading, Watch } from "lucide-react";

export const statuses = [
  {
    value: 'April 9, 2024 at 03:05 AM',
    label: 'Created',
    icon: FileQuestion,
  },
  {
    value: 'April 9, 2024 at 03:05 AM',
    label: 'title',
    icon: Heading,
  },
  {
    value: 'April 9, 2024 at 03:05 AM',
    label: 'In Progress',
    icon: Watch,
  },
  {
    value: 'April 9, 2024 at 03:05 AM',
    label: 'Done',
    icon: CircleCheck,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: CircleX,
  },
]

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
