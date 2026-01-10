import { memo, useEffect } from 'react'
import { format } from 'date-fns'
import { useSearch } from '@tanstack/react-router'
import {
  Eye,
  Edit as EditIcon,
  Trash2,
  ArrowRight,
  MoreVertical,
  Check,
  Users,
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

    return (
      <div className='group relative mx-auto w-full max-w-sm'>
        <Card
          className={`relative flex h-[480px] w-full flex-col overflow-hidden rounded-[2.5rem] border-0 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] ${(fetchStatus === 'fetching' || isFetching) && 'animate-pulse bg-slate-50 opacity-70'}`}
        >
          {/* Course Image Section */}
          <div className='relative h-52 overflow-hidden'>
            <img
              src={getFileUrl(image, 'public/courses/cover-images')}
              alt={name}
              className='h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110'
              fetchpriority={index === 0 ? 'high' : 'auto'}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

            {/* Premium Action Popover (⋮ icon) */}
            <div className='absolute top-4 right-4 z-10'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size='icon'
                    variant='secondary'
                    className='h-10 w-10 rounded-2xl bg-white/20 text-white shadow-lg backdrop-blur-xl transition-all hover:bg-white hover:text-slate-900'
                  >
                    <MoreVertical className='h-5 w-5' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side='bottom'
                  align='end'
                  className='w-48 overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/80 p-1.5 shadow-2xl backdrop-blur-2xl'
                >
                  <div className='flex flex-col space-y-1'>
                    <Button
                      variant='ghost'
                      className='justify-start rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600'
                      onClick={() =>
                        navigate({
                          to: `/teacher/courses/course_details/${courseId}`,
                          state: { page },
                        })
                      }
                    >
                      <Eye className='mr-3 h-4 w-4' /> View Course
                    </Button>

                    <Button
                      variant='ghost'
                      className='justify-start rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600'
                      onClick={() =>
                        navigate({
                          to: `/teacher/courses/edit_course/${courseId}`,
                        })
                      }
                    >
                      <EditIcon className='mr-3 h-4 w-4' /> Edit Setup
                    </Button>

                    <div className='my-1 h-px bg-slate-100/50' />

                    <Button
                      variant='ghost'
                      className='justify-start rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 hover:text-red-700'
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
                      <Trash2 className='mr-3 h-4 w-4' /> Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Overlay Date Badge */}
            <div className='absolute bottom-4 left-4 rounded-xl bg-white/10 px-3 py-1 text-[10px] font-bold text-white shadow-lg backdrop-blur-md border border-white/20'>
              {format(dateUpdated, 'MMM yyyy')}
            </div>
          </div>

          {/* Card Body & Content */}
          <div className='flex flex-1 flex-col p-6'>
            <CardHeader className='mb-3 p-0'>
              <div className='mb-2 flex items-center gap-2'>
                <div className='flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                  <ArrowRight size={12} className='rotate-[-45deg]' />
                </div>
                <span className='text-[10px] font-black uppercase tracking-widest text-slate-400'>Teaching Unit</span>
              </div>
              <CardTitle className='line-clamp-2 text-xl font-extrabold leading-tight text-slate-800 transition-colors duration-300 group-hover:text-blue-600'>
                {name}
              </CardTitle>
            </CardHeader>

            <CardContent className='mb-6 p-0'>
              <p className='line-clamp-3 text-sm font-medium leading-relaxed text-slate-500'>
                {desc || 'No pedagogical description available for this course module yet.'}
              </p>
            </CardContent>

            {/* Footer with Specialized Actions */}
            <CardFooter className='mt-auto flex flex-col gap-4 p-0'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='secondary'
                    className='group/btn flex h-14 w-full items-center justify-between rounded-2xl bg-slate-50 px-5 text-sm font-black transition-all hover:bg-blue-600 hover:text-white'
                    onClick={() =>
                      navigate({
                        to: `/teacher/courses/course_students/${courseId}`,
                        search: { q: '' },
                      })
                    }
                  >
                    <div className='flex items-center gap-3'>
                      <Users className='h-5 w-5 text-slate-400 group-hover/btn:text-white' />
                      <span className='uppercase tracking-widest'>Enrollment</span>
                    </div>
                    <div className='flex h-8 min-w-[32px] items-center justify-center rounded-xl bg-white px-2 font-mono text-xs font-black text-blue-600 shadow-sm group-hover/btn:bg-white/20 group-hover/btn:text-white'>
                      {studentsEnrolled}
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='rounded-xl border-slate-100 bg-white p-3 text-xs font-bold text-slate-700 shadow-xl'>
                  Click to see whoose enrolled in this course
                </TooltipContent>
              </Tooltip>

              <div className='flex items-center justify-between border-t border-slate-50 pt-4'>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' />
                  <span className='text-[10px] font-black uppercase tracking-tight text-slate-400'>Active Content</span>
                </div>
                <p className='text-[10px] font-bold text-slate-500'>
                  Modified {format(dateUpdated, 'PPP')}
                </p>
              </div>
            </CardFooter>
          </div>
        </Card>
      </div>
    )
  }
)
