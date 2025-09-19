import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from './-layout/data/components/teacher-authenticated-layout'
import { initializeAxios } from './-utils/InitializeAxios'


export const Route = createFileRoute('/_authenticated/teacher')({
  beforeLoad:() =>{
  initializeAxios()
  },
  component: AuthenticatedLayout
})
