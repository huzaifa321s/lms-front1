import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { TeachersSchema } from '../data/schema'
import { Eye } from 'lucide-react'

export function TeachersDataTableRowActions({ row }) {
  const teacher = TeachersSchema.parse(row.original)
  const navigate = useNavigate()

  return (
    <>
      <Button
        size='xs'
        onClick={() => navigate({ to: `/admin/teachers/${teacher._id}` })}
        variant='outline'
      >
      <Eye/>  View Details
      </Button>
    </>
  )
}
