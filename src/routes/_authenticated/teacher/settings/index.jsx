import { createFileRoute } from '@tanstack/react-router'
import { SettingsProfile } from './profile'

export const Route = createFileRoute('/_authenticated/teacher/settings/')({
  component: SettingsProfile,
})