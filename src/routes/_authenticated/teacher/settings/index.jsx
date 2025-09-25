import { createFileRoute } from '@tanstack/react-router'
import { SettingsProfile } from './profile'
import { QueryClient, queryOptions } from '@tanstack/react-query'
import { getTeacherCreds } from '../-utils/helperFunctions'


const profileQueryOptions = ( ) =>
queryOptions({
  queryKey:["teacher-profile"],
  queryFn:getTeacherCreds
})

const queryClient = new QueryClient()

export const Route = createFileRoute('/_authenticated/teacher/settings/')({
  component: SettingsProfile,
  loader: () => queryClient.ensureQueryData(profileQueryOptions())
})