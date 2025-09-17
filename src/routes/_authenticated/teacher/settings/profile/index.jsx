import { createFileRoute } from '@tanstack/react-router'
import ProfileForm from './profile-form'
import ContentSection from '../../../student/settings/-components/content-section'

export const Route = createFileRoute('/_authenticated/teacher/settings/profile/')({
  component: SettingsProfile
})

export function SettingsProfile (){
  return <ContentSection title="Settings">
   <ProfileForm/>
  </ContentSection>
}
