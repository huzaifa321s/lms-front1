import { createFileRoute } from '@tanstack/react-router'
import { initializeAxios } from './-utils/InitializeAxios'
import { AuthenticatedLayout } from './layout/admin-authenticated-layout'

function AdminRouteComponent() {
  return <AuthenticatedLayout />
}

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: () => {
    initializeAxios()
  },
  component: AdminRouteComponent,
})
