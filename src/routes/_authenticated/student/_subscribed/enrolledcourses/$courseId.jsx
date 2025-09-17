import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { useAppUtils } from '../../../../../hooks/useAppUtils'
import { addTitle } from '../../../../../shared/config/reducers/animateBgSlice'

const queryClient = new QueryClient()
const courseQueryOptions = (params) =>
  queryOptions({
    queryKey: ['course', params.courseId],
    queryFn: async () => {
      try {
        let response = await axios.get(
          `/student/course/get-enrolled-course/${params.courseId}`,
          {}
        )
        response = response.data
        return { details: response.data }
      } catch (error) {
        const errorMessage = error.response.data.message
        console.error(errorMessage)
        return { details: null }
      }
    },
  })

export const Route = createFileRoute(
  '/_authenticated/student/_subscribed/enrolledcourses/$courseId'
)({
  loader: ({ params }) =>
    queryClient.ensureQueryData(courseQueryOptions(params)),
  component: RouteComponent,
})

function RouteComponent() {
  const { dispatch } = useAppUtils()

  const { courseId } = useParams({
    from: '/_authenticated/student/_subscribed/enrolledcourses/$courseId',
  })
  const { data } = useSuspenseQuery(courseQueryOptions({ courseId }))
  const { details } = data

  const TEMPLATE_COURSE_DETAILS = {
    coverImage: null,
    name: '',
    description: '',
    category: '',
    instructor: {},
    material: [{ title: '', description: '', media: '' }],
  }

  const [courseObj, setCourseObj] = useState(details || TEMPLATE_COURSE_DETAILS)
  const defaultCover = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/defaults/course-cover.png`
  const [cover, setCover] = useState(
    data && data.coverImage
      ? `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/courses/cover-images/${data.coverImage}`
      : defaultCover
  )
  const baseMaterial = `${process.env.REACT_APP_STORAGE_BASE_URL}/courses/material`

  useEffect(() => {
    dispatch(addTitle({ title: 'Course Details' }))
  }, [dispatch])
console.log('courseObj ====>',courseObj)
  return (
   <div className='min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]'>
      {/* Enhanced Header */}
      <Header>
        <h1 className='bg-gradient-to-r w-full from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent drop-shadow-lg md:text-3xl'>
          Course Details
        </h1>
        <div className='my-2 flex w-full items-center justify-between'>
          <Button
            size='sm'
            onClick={() => window.history.back()}
            variant='outline'
            className='ml-auto flex items-center gap-2 border border-[#e2e8f0] bg-[#f1f5f9] font-medium text-[#475569] shadow-lg transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#e2e8f0] hover:shadow-xl rounded-lg'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-4 w-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3'
              />
            </svg>
            Back
          </Button>
        </div>
      </Header>

      {/* Enhanced Course Card */}
      <div className='mx-4 mt-4'>
        <div className='group hover:shadow-lg relative overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300'>
          {/* Glow effect */}
          <div className='pointer-events-none absolute -inset-1 rounded-[12px] bg-gradient-to-r from-[#2563eb]/10 via-[#10b981]/10 to-[#f59e0b]/10 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100' />

          {/* Course Cover Image */}
          <div className='relative'>
            <div className='absolute inset-0 z-10 rounded-t-[12px] bg-gradient-to-t from-black/20 via-transparent to-transparent'></div>
            <img
              src={cover || defaultCover}
              alt='Course Cover'
              className='h-80 w-full rounded-t-[12px] object-cover object-center sm:h-96'
            />
            {/* Enhanced Category Badge */}
            <div className='absolute right-4 bottom-4 z-20'>
              <Badge className='rounded-full border-0 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-3 py-1.5 font-semibold text-white shadow-lg'>
                {courseObj?.category?.name || '--'}
              </Badge>
            </div>
          </div>

          {/* Course Content */}
          <div className='relative p-6 sm:p-8'>
            {/* Course Header */}
            <div className='mb-8'>
              <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                <div className='flex-1'>
                  <h1 className='mb-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl leading-tight font-bold text-transparent lg:text-4xl'>
                    {courseObj?.name}
                  </h1>
                </div>

                {/* Instructor Info */}
                <div className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-4 shadow-sm'>
                  <div className='flex items-center gap-3'>
                    <div className='rounded-full bg-[#10b981] p-2'>
                      <svg
                        className='h-5 w-5 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        />
                      </svg>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-[#64748b]'>
                        Instructor
                      </p>
                      <p className='font-semibold text-[#1e293b]'>
                        {courseObj?.instructor?.firstName}{' '}
                        {courseObj?.instructor?.lastName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Description */}
              <div className='mt-6 rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-6'>
                <p className='text-lg leading-relaxed text-[#64748b]'>
                  {courseObj?.description}
                </p>
              </div>
            </div>

            {/* Decorative Separator */}
            <div className='my-8 flex items-center justify-center'>
              <div className='h-px flex-1 bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent'></div>
              <div className='px-4'>
                <div className='h-3 w-3 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]'></div>
              </div>
              <div className='h-px flex-1 bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent'></div>
            </div>

            {/* Course Materials Section */}
            <div className='space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-[#10b981] p-2 shadow-sm'>
                  <svg
                    className='h-6 w-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                    />
                  </svg>
                </div>
                <h2 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                  Course Materials
                </h2>
              </div>

              <div className='space-y-4'>
                {courseObj.material.map((m, k) => (
                  <div key={k} className='group/item'>
                    <Accordion
                      type='single'
                      collapsible
                      className='overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-200 hover:shadow-lg'
                    >
                      <AccordionItem value='item-1' className='border-none'>
                        <AccordionTrigger className='px-6 py-4 text-left font-semibold text-[#1e293b] transition-all duration-200 hover:bg-[rgba(255,255,255,0.15)] hover:text-[#2563eb]'>
                          <div className='flex items-center gap-3'>
                            <div className='h-2 w-2 rounded-full bg-[#10b981] transition-transform duration-200 group-hover/item:scale-125'></div>
                            {m.title}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className='space-y-4 px-6 pb-6'>
                          <div className='rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-4'>
                            <div className='space-y-3'>
                              <div>
                                <span className='text-sm font-semibold tracking-wide text-[#2563eb] uppercase'>
                                  Description:
                                </span>
                                <p className='mt-1 leading-relaxed text-[#64748b]'>
                                  {m.description}
                                </p>
                              </div>
                              {m.media && (
                                <div>
                                  <span className='text-sm font-semibold tracking-wide text-[#2563eb] uppercase'>
                                    Material:
                                  </span>
                                  <div className='mt-2'>
                                    <a
                                      href={`${baseMaterial}/${m.media}`}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='inline-flex transform items-center gap-2 rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl'
                                    >
                                      <svg
                                        className='h-4 w-4'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                      >
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                        />
                                      </svg>
                                      {m.media}
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {(!courseObj.material || courseObj.material.length === 0) && (
                <div className='py-12 text-center'>
                  <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#10b981]'>
                    <svg
                      className='h-8 w-8 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                      />
                    </svg>
                  </div>
                  <p className='text-lg text-[#64748b]'>
                    No course materials available yet.
                  </p>
                  <p className='mt-1 text-sm text-[#94a3b8]'>
                    Check back later for updates!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
