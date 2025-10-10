// LazyViewStudentDialog.jsx
import React from 'react'
import { User, BookOpen, CreditCard, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

export default function ViewStudentDialog({
  dialogType,
  studentData,
  studentFetchStatus,
  dispatch,
  closeModalAdmin,
}) {
  if (dialogType !== 'view-student-details') return null

  return (
    <Dialog open onOpenChange={() => dispatch(closeModalAdmin())}>
      <DialogContent className='max-w-3xl rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-lg font-semibold text-[#1e293b]'>
            <User className='h-5 w-5 text-[#2563eb]' />
            {studentFetchStatus === 'fetching' ? (
              <Skeleton className='h-6 w-full rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
            ) : (
              `Student Details: ${studentData?.firstName} ${studentData?.lastName}`
            )}
          </DialogTitle>
        </DialogHeader>

        {studentFetchStatus === 'fetching' ? (
          <div className='space-y-6'>
            {/* Student Info Skeleton */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-64 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
              <Skeleton className='h-4 w-52 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
              <Skeleton className='h-4 w-72 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
              <Skeleton className='h-4 w-72 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
              <Skeleton className='my-4 h-24 w-full rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
              <Skeleton className='my-4 h-24 w-full rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
            </div>
          </div>
        ) : (
          <>
            {/* Student Info */}
            <div className='mb-4 space-y-2'>
              <h3 className='flex items-center gap-2 text-base font-semibold text-[#1e293b]'>
                <User className='h-4 w-4 text-[#2563eb]' /> Student Information
              </h3>
              <p className='text-sm text-[#1e293b]'>
                <strong>Email:</strong> {studentData?.email}
              </p>
              <p className='text-sm text-[#1e293b]'>
                <strong>Phone:</strong> {studentData?.phone}
              </p>
              <p className='text-sm text-[#1e293b]'>
                <strong>Bio:</strong> {studentData?.bio}
              </p>
            </div>

            {/* Enrolled Courses Table */}
            <div className='mb-4 max-h-64 overflow-y-auto'>
              <div className='flex items-center justify-between'>
                <h3 className='flex items-center gap-2 font-semibold text-[#1e293b]'>
                  <BookOpen className='h-4 w-4 text-[#2563eb]' /> Enrolled
                  Courses ({studentData?.enrolledCourses?.length ?? 0})
                </h3>
                <h3 className='text-[#1e293b]'>
                  Total Enrolled: {studentData?.totalEnrolled ?? 0}
                </h3>
              </div>
              {studentData?.enrolledCourses?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className='border-[#e2e8f0]'>
                      <TableHead className='font-semibold text-[#1e293b]'>
                        Course Name
                      </TableHead>
                      <TableHead className='font-semibold text-[#1e293b]'>
                        Enrolled At
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentData?.enrolledCourses.map((course, idx) => (
                      <TableRow
                        key={idx}
                        className='border-[#e2e8f0] hover:bg-[#f1f5f9]'
                      >
                        <TableCell className='text-[#1e293b]'>
                          {course.name}
                        </TableCell>
                        <TableCell className='text-[#64748b]'>
                          {course.updatedAt}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className='flex items-center gap-2 text-sm text-[#64748b]'>
                  <BookOpen className='h-4 w-4 text-[#94a3b8]' /> No existing
                  courses enrolled yet
                </p>
              )}
            </div>

            {/* Subscription Info */}
            <div className='mb-4 space-y-2'>
              <h3 className='flex items-center gap-2 font-semibold text-[#1e293b]'>
                <CreditCard className='h-4 w-4 text-[#2563eb]' /> Subscription
                Information
              </h3>
              <p className='text-sm text-[#1e293b]'>
                <strong>Subscription PriceID:</strong>{' '}
                {studentData?.subscriptionPriceId}
              </p>
              <p className='text-sm text-[#1e293b]'>
                <strong>Status:</strong> {studentData?.subscriptionStatus}
              </p>
              <p className='text-sm text-[#1e293b]'>
                <strong>Plan Active:</strong>{' '}
                {studentData?.planActive ? 'Yes' : 'No'}
              </p>
            </div>
          </>
        )}

        <DialogFooter className='mt-6 flex justify-end'>
          <DialogClose asChild>
            <Button
              size='sm'
              variant='outline'
              onClick={() => dispatch(closeModalAdmin())}
            >
              <XCircle className='h-4 w-4 text-[#64748b]' />
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
