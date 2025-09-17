import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { CoursesSchema } from '../../../../admin/layout/data/-schemas/coursesSchema'


export function CoursesDataTableRowActionsStudent({ row }) {
  
  const course = CoursesSchema.parse(row.original)
  const navigate = useNavigate()

  return (
    <>
<Button onClick={() => navigate({to:`/student/enrolledcourses/${course._id}`})} size="xs" variant="outline">View Details</Button>
    </>
  )
}
