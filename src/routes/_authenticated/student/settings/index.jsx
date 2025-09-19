import { createFileRoute } from '@tanstack/react-router'
import SettingsProfile from './profile/index'

export const Route = createFileRoute('/_authenticated/student/settings/')({
  component: SettingsProfile,

})
