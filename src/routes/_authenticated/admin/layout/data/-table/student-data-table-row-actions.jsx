import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StudentSchema } from '../-schemas/coursesSchema'
import { useAppUtils } from '../../../../../../hooks/useAppUtils'
import { openModalAdmin } from '../../../../../../shared/config/reducers/admin/DialogSlice'

export function StudentDataTableRowActions({ row }) {
  const student = StudentSchema.parse(row.original)
  const { dispatch } = useAppUtils()

  return (
    <>
      <Button
        size='xs'
        variant='outline'
        onClick={() =>
          dispatch(
            openModalAdmin({
              type: 'view-student-details',
              props: { studentID: student._id, courseIDs: student.courseIds },
            })
          )
        }
      >
        <Eye /> View Details
      </Button>
    </>
  )
}
