import { memo, useEffect } from 'react'
import { format } from 'date-fns'
import { useSearch } from '@tanstack/react-router'
import {
  Eye,
  Edit as EditIcon,
  Trash2,
  ArrowRight,
  MoreVertical,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { useAppUtils } from '@/hooks/useAppUtils'
import { openModalTeacher } from '../../../../../shared/config/reducers/teacher/teacherDialogSlice'
import { getFileUrl } from '@/utils/globalFunctions'

export const CardDemo = memo(
  ({
    courseId,
    name,
    desc,
    query,
    page,
    index,
    studentsEnrolled,
    fetchStatus,
    isFetching,
    dateUpdated,
    image,
  }) => {
    const { navigate, dispatch } = useAppUtils()
    const searchParams = useSearch({ from: '/_authenticated/teacher/courses/' })
    console.log('courseImg ===>', courseImg)
    return (
      <div className='group relative mx-auto w-full max-w-sm'>
        <Card
          className={`relative flex h-[460px] w-full flex-col justify-between overflow-hidden rounded-[8px] border-0 bg-white/95 shadow-[0_4px_6px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] ${(fetchStatus === 'fetching' || isFetching) &&
            'animate-pulse bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]'
            }`}
        >


          {/* Course Image */}
          <div className='relative overflow-hidden rounded-t-[8px]'>
            <img
              src={getFileUrl(image, 'public/courses/cover-images')}
              alt={name}
              className='h-40 w-full object-cover sm:h-48'
              fetchpriority={index === 0 ? 'high' : 'auto'}
              loading={index === 0 ? 'eager' : 'lazy'}
            />

            {(fetchStatus === 'fetching' || isFetching) && (
              <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10'></div>
            )}

            {/* Popover Button (⋮ icon) */}
            <div className='absolute top-2 right-2 z-10'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='rounded-full hover:bg-gray-100'
                  >
                    <MoreVertical className='h-4 w-4 text-gray-600' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-40 rounded-[8px] border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur-md'>
                  <div className='flex flex-col space-y-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='cursor-pointer text-emerald-600 focus:bg-emerald-100 focus:text-emerald-800'
                      onClick={() =>
                        navigate({
                          to: `/teacher/courses/course_details/${courseId}`,
                          state: { page },
                        })
                      }
                    >
                      <Eye className='mr-2 h-4 w-4' /> View Details
                    </Button>

                    <Button
                      variant='ghost'
                      size='sm'
                      className='cursor-pointer text-blue-600 focus:bg-blue-100 focus:text-blue-800'
                      onClick={() =>
                        navigate({
                          to: `/teacher/courses/edit_course/${courseId}`,
                        })
                      }
                    >
                      <EditIcon className='mr-2 h-4 w-4' /> Edit Course
                    </Button>

                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() =>
                        dispatch?.(
                          openModalTeacher({
                            type: 'delete-course-modal',
                            props: {
                              searchParams,
                              courseId,
                              courseDetails: { name, desc },
                              query,
                              page,
                              index,
                            },
                          })
                        )
                      }
                    >
                      <Trash2 className='mr-2 h-4 w-4' /> Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Card Body */}
          <div className='flex flex-1 flex-col justify-between px-5 py-4'>
            <CardHeader className='mb-2 p-0'>
              <CardTitle className='line-clamp-2 text-lg font-bold text-[#1e293b] sm:text-xl'>
                {name}
              </CardTitle>
            </CardHeader>

            {/* Description */}
            <CardContent className='mb-3 p-0'>
              <div className='relative h-[60px] overflow-hidden text-sm leading-relaxed text-[#64748b] sm:h-[70px]'>
                <p className='line-clamp-3'>
                  {desc || 'No description available.'}
                </p>
                <div className='absolute right-0 bottom-0 left-0 h-6 bg-gradient-to-t from-white to-transparent'></div>
              </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className='mt-auto flex flex-col gap-3 p-0'>
              {/* Students Enrolled */}
              <Tooltip>
                <div
                  onClick={() =>
                    navigate({
                      to: `/teacher/courses/course_students/${courseId}`,
                      search: { q: '' },
                    })
                  }
                >
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex w-full justify-between'
                    >
                      <span className='flex items-center gap-1'>
                        Students Enrolled <ArrowRight size={14} />
                      </span>
                      <Badge
                        variant='default'
                        className='ml-auto bg-[#2563eb]/20 text-[#2563eb] hover:bg-[#2563eb]/30'
                      >
                        {studentsEnrolled}
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className='rounded-[8px] border-[#e2e8f0] bg-white/95 text-[#1e293b] shadow-[0_4px_6px_rgba(0,0,0,0.05)] backdrop-blur-sm'>
                    <p>View Enrolled Students</p>
                  </TooltipContent>
                </div>
              </Tooltip>

              {/* Last Updated */}
              <div className='w-full border-t border-[#e2e8f0] pt-2'>
                <p className='flex items-center gap-1 text-xs font-medium text-[#64748b]'>
                  <span className='inline-block h-2 w-2 rounded-full bg-[#2563eb]'></span>
                  Updated: {format(dateUpdated, 'PPP')}
                </p>
              </div>
            </CardFooter>
          </div>
        </Card>
      </div>
    )
  }
)
