import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { TeachersSchema } from '../data/schema'


export function CourseTeachersDataTableRowActions({ row }) {
  
  const teacher = TeachersSchema.parse(row.original)
  const navigate = useNavigate()
  
  

  return (
    <>
     
      <Button size="xs" variant="outline"  onClick={() => navigate({to:`/student/course-teachers/${teacher._id}`})}>View Details</Button>
    </>
  )
}
