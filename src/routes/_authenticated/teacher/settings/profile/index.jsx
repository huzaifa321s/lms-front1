import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import ProfileForm from './profile-form'
import ContentSection from '../../../student/settings/-components/content-section'
import { QueryClient, queryOptions } from '@tanstack/react-query';
import axios from 'axios';


export function SettingsProfile (){
  const data = useLoaderData({from:"/_authenticated/teacher/settings/"})
  return <ContentSection title="Settings">
   <ProfileForm teacherCreds={data}/>
  </ContentSection>
}
