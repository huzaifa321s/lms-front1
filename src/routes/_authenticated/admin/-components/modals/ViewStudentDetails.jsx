// LazyViewStudentDialog.jsx
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

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
          <DialogTitle className='text-lg font-semibold text-[#1e293b]'>
            {studentFetchStatus === 'fetching' ? (
              <Skeleton className='h-6 w-48 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
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
            </div>
            {/* Enrolled Courses Skeleton */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-40 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
              <div className='space-y-2'>
                <Skeleton className='h-6 w-full rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
                <Skeleton className='h-6 w-full rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
                <Skeleton className='h-6 w-full rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
              </div>
            </div>
            {/* Subscription Skeleton */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-60 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
              <Skeleton className='h-4 w-40 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
              <Skeleton className='h-4 w-52 rounded-[12px] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
            </div>
          </div>
        ) : (
          <>
            {/* Student Info */}
            <div className='mb-4 space-y-2'>
              <p className='text-sm text-[#1e293b]'><strong>Email:</strong> {studentData?.email}</p>
              <p className='text-sm text-[#1e293b]'><strong>Phone:</strong> {studentData?.phone}</p>
              <p className='text-sm text-[#1e293b]'><strong>Bio:</strong> {studentData?.bio}</p>
            </div>

            {/* Enrolled Courses Table */}
            <div className='mb-4 max-h-64 overflow-y-auto'>
              <div className='flex justify-between'>
                <h3 className='mb-2 font-semibold text-[#1e293b]'>Existing Enrolled Courses {studentData?.enrolledCourses?.length ?? 0}</h3>
                <h3 className='mb-2 text-[#1e293b]'>Total Enrolled Courses {studentData?.totalEnrolled ?? 0}</h3>
              </div>
              {studentData?.enrolledCourses?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className='border-[#e2e8f0]'>
                      <TableHead className='font-semibold text-[#1e293b]'>Course Name</TableHead>
                      <TableHead className='font-semibold text-[#1e293b]'>Enrolled At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentData?.enrolledCourses.map((course, idx) => (
                      <TableRow key={idx} className='border-[#e2e8f0] hover:bg-[#f1f5f9]'>
                        <TableCell className='text-[#1e293b]'>{course.name}</TableCell>
                        <TableCell className='text-[#64748b]'>{course.updatedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className='text-sm text-[#64748b]'>No existing courses enrolled yet</p>
              )}
            </div>

            {/* Subscription Info */}
            <div className='mb-4 space-y-2'>
              <p className='text-sm text-[#1e293b]'><strong>Subscription PriceID:</strong> {studentData?.subscriptionPriceId}</p>
              <p className='text-sm text-[#1e293b]'><strong>Status:</strong> {studentData?.subscriptionStatus}</p>
              <p className='text-sm text-[#1e293b]'><strong>Plan Active:</strong> {studentData?.planActive ? 'Yes' : 'No'}</p>
            </div>
          </>
        )}

        <DialogFooter className='mt-6 flex justify-end'>
          <DialogClose asChild>
            <Button
              size='sm'
              variant='outline'
              className='rounded-[8px] border border-[#e2e8f0] text-[#475569] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#e2e8f0] hover:shadow-[0_6px_8px_rgba(0,0,0,0.1)]'
              onClick={() => dispatch(closeModalAdmin())}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
