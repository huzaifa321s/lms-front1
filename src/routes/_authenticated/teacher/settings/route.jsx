import { createFileRoute ,redirect} from '@tanstack/react-router'
import Settings from './settings'

export const Route = createFileRoute('/_authenticated/teacher/settings')({
  component: Settings,
})
