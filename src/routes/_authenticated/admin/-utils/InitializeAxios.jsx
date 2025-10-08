import axios from 'axios'
import { Outlet, redirect } from '@tanstack/react-router'
import { getCookie } from '../../../../shared/utils/helperFunction'

export function initializeAxios() {
  const TOKEN = getCookie('adminToken')
  const credentials = getCookie('adminCredentials')

  if (TOKEN && credentials) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`
    return <Outlet />
  } else {
    throw redirect({ to: '/admin/login' })
  }
}
