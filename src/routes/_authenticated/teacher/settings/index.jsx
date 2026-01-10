import { createFileRoute } from '@tanstack/react-router'
import { SettingsProfile } from './profile'
import { QueryClient, queryOptions } from '@tanstack/react-query'
import { getTeacherCreds } from '../-utils/helperFunctions'


const profileQueryOptions = () =>
  queryOptions({
    queryKey: ["teacher-profile"],
    queryFn: getTeacherCreds
  })

export const Route = createFileRoute('/_authenticated/teacher/settings/')({
  component: SettingsProfile,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(profileQueryOptions())
})