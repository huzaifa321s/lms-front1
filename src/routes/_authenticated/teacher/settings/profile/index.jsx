import { useLoaderData } from '@tanstack/react-router'
import ProfileForm from './profile-form'
import ContentSection from '../../../student/settings/-components/content-section'


export function SettingsProfile (){
  const data = useLoaderData({from:"/_authenticated/teacher/settings/"})
  return <ContentSection title="Settings">
   <ProfileForm teacherCreds={data}/>
  </ContentSection>
}
