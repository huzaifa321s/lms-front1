import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { AuthenticatedLayout } from './layout/admin-authenticated-layout'
import { initializeAxios } from './-utils/InitializeAxios'

function AdminRouteComponent() {
  useEffect(() => {
    initializeAxios()
  }, [])

  return <AuthenticatedLayout />
}

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminRouteComponent,
})
