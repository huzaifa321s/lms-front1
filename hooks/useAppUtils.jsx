// hooks/useCustomRouter.jsx
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'

export const useAppUtils = () => {
  const router = useRouter()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const queryClientHook = useQueryClient()

  return { router, navigate, dispatch }
}