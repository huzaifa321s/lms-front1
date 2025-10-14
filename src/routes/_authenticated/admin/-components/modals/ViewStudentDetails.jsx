// LazyViewStudentDialog.jsx
import React from 'react'
import { format } from 'date-fns'
import { User, BookOpen, CreditCard, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'


export default function ViewStudentDialog({
  dialogType,
  studentData,
  studentFetchStatus,
  dispatch,
  closeModalAdmin,
}) {
  if (dialogType !== 'view-student-details') return null

  return (
    <Dialog open onOpenChange={() => dispatch(closeModalAdmin())} modal >
      <DialogContent className='max-w-4xl rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-lg '>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-between text-lg font-semibold text-[#1e293b]'>
            <div className='flex items-center gap-2'>
              <User className='h-5 w-5 text-[#2563eb]' />
              {studentFetchStatus === 'fetching' ? (
                <Skeleton className='h-6 w-48 rounded-md bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
              ) : (
                `Student: ${studentData?.firstName} ${studentData?.lastName}`
              )}
            </div>

         
         
          </DialogTitle>
        </DialogHeader>

        {studentFetchStatus === 'fetching' ? (
          <div className='space-y-6'>
            <Skeleton className='h-4 w-64 rounded-md bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
            <Skeleton className='h-4 w-52 rounded-md bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
            <Skeleton className='h-4 w-72 rounded-md bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
            <Skeleton className='my-4 h-24 w-full rounded-md bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0]' />
          </div>
        ) : (
          <>
            <Tabs defaultValue='info' className='mt-2 w-full'>
              <TabsList className='mb-4 grid w-full grid-cols-3 rounded-xl bg-[#f8fafc] p-1'>
                <TabsTrigger value='info'>Info</TabsTrigger>
                <TabsTrigger value='courses'>Courses</TabsTrigger>
                <TabsTrigger value='subscription'>Subscription</TabsTrigger>
              </TabsList>

              {/* -------- Student Info -------- */}
              <TabsContent value='info'>
                <Card className='rounded-xl border border-[#e2e8f0] shadow-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-[#1e293b]'>
                      <User className='h-4 w-4 text-[#2563eb]' /> Student
                      Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2 text-sm text-[#1e293b]'>
                    <p>
                      <strong>Email:</strong> {studentData?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {studentData?.phone}
                    </p>
                    <p>
                      <strong>Bio:</strong> {studentData?.bio}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* -------- Enrolled Courses -------- */}
              <TabsContent value='courses'>
                <Card className='rounded-xl border border-[#e2e8f0] shadow-sm'>
                  <CardHeader className='flex flex-row items-center justify-between'>
                    <CardTitle className='flex items-center gap-2 text-[#1e293b]'>
                      <BookOpen className='h-4 w-4 text-[#2563eb]' /> Enrolled
                      Courses ({studentData?.enrolledCourses?.length ?? 0})
                    </CardTitle>
                    <Badge variant='outline' className='text-[#2563eb]'>
                      Total: {studentData?.totalEnrolled ?? 0}
                    </Badge>
                  </CardHeader>

                  <Separator />

                  <CardContent className='p-0'>
                    <ScrollArea className='h-64 rounded-md border border-[#e2e8f0]'>
                      <div className='min-w-full overflow-x-auto'>
                        <table className='w-full border-collapse text-left text-sm'>
                          <thead>
                            <tr className='border-b border-[#e2e8f0] bg-[#f8fafc] font-medium text-[#1e293b]'>
                              <th className='p-2'>Course Name</th>
                              <th className='p-2'>Enrolled At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentData.enrolledCourses.map((course, idx) => (
                              <tr
                                key={idx}
                                className='border-b border-[#e2e8f0] hover:bg-[#f1f5f9]'
                              >
                                <td className='p-2'>{course.name}</td>
                                <td className='p-2 text-[#64748b]'>
                                  {format(course.updatedAt, 'PPP')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* -------- Subscription Info -------- */}
              <TabsContent value='subscription'>
                <Card className='rounded-xl border border-[#e2e8f0] shadow-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-[#1e293b]'>
                      <CreditCard className='h-4 w-4 text-[#2563eb]' />{' '}
                      Subscription Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2 text-sm text-[#1e293b]'>
                    <p>
                      <strong>Subscription PriceID:</strong>{' '}
                      {studentData?.subscriptionPriceId || '—'}
                    </p>
                    <p className='flex items-center gap-2'>
                      <strong>Status:</strong>{' '}
                      <Badge
                        variant={
                          studentData?.subscriptionStatus === 'active'
                            ? 'success'
                            : 'destructive'
                        }
                      >
                        {studentData?.subscriptionStatus || 'unknown'}
                      </Badge>
                    </p>
                    <p className='flex items-center gap-2'>
                      <strong>Plan Active:</strong>{' '}
                      <Badge
                        variant={
                          studentData?.planActive ? 'success' : 'secondary'
                        }
                      >
                        {studentData?.planActive ? 'Yes' : 'No'}
                      </Badge>
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
