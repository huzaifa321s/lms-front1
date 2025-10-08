import { useEffect } from 'react'
import axios from 'axios'
import {
  createFileRoute,
  Outlet,
  useNavigate,
} from '@tanstack/react-router'
import { getCookie } from '../../../shared/utils/helperFunction'
import { AuthenticatedLayout } from './-components/authenticated-layout'

const RouteComponent = () => {
  const navigate = useNavigate()

  function InitializeAxios() {
    const TOKEN = getCookie('studentToken')
    const credentials = getCookie('studentCredentials')

    if (TOKEN && credentials) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`
      return <Outlet />
    } else {
      navigate({ to: '/student/login', search: { redirect: '/student' } })
    }
  }

  useEffect(() => {
    InitializeAxios()
  }, [])
  return (
    <>
      <AuthenticatedLayout />
    </>
  )
}

export const Route = createFileRoute('/_authenticated/student')({
  component: RouteComponent,
})
