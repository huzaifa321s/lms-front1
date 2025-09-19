import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/coming-soon'

export const Route = createFileRoute('/student/failed-subscription')({
  component: ComingSoon,
})

