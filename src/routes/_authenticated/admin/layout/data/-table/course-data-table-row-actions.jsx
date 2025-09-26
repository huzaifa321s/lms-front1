import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { CoursesSchema } from '../-schemas/coursesSchema'

export function CoursesDataTableRowActions({ row }) {  
  const course = CoursesSchema.parse(row.original)
  const navigate = useNavigate()
  
  
  return (
    <>
      
       <>
          <Button
            size='xs'
            variant='outline'
             onClick={()=> navigate({to:`/admin/courses/${course._id}`})}         
          >
            View Details
          </Button>
        </>
    </>
  )
}
