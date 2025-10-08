import axios from 'axios'
import { Outlet, redirect } from '@tanstack/react-router'
import { getCookie } from '../../../../shared/utils/helperFunction'

export function initializeAxios() {
  const TOKEN = getCookie('teacherToken')
  const credentials = getCookie('teacherCredentials')
  if (TOKEN && credentials) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`
    return <Outlet />
  } else {
    throw redirect({ to: '/teacher/login' })
  }
}
