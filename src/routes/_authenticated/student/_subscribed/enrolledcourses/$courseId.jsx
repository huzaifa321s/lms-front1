import { memo, useMemo } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
} from '@tanstack/react-query'
import {
  useParams,
  createFileRoute,
  useLoaderData,
} from '@tanstack/react-router'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { ArrowLeft, BookOpen, User } from 'lucide-react'

// Initialize QueryClient
const queryClient = new QueryClient()

// Course query options
const courseQueryOptions = (params) =>
  queryOptions({
    queryKey: ['course', params.courseId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/student/course/get-enrolled-course/${params.courseId}`
        )
        console.log('res',response.data)
        if (response.data.success) {
          return response.data.data
        }
        return {}
      } catch (error) {
        console.error(
          'Error fetching course:',
          error.response?.data?.message || error.message
        )
        return {}
      }
    },
  })

// Route definition
export const Route = createFileRoute(
  '/_authenticated/student/_subscribed/enrolledcourses/$courseId'
)({
  loader:async ({ params }) =>{
  return await queryClient.ensureQueryData(courseQueryOptions(params))},
  component: memo(RouteComponent),
})

// Memoized styles to avoid recreation on renders
const gradientTextStyle = {
  background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

function RouteComponent() {
  const data = useLoaderData({
    from: '/_authenticated/student/_subscribed/enrolledcourses/$courseId',
  })
  const details = data;
  console.log('data',data)
  // const { data, error } = useSuspenseQuery(courseQueryOptions({ courseId }));

  // Default course image
  const DEFAULT_COURSE_IMAGE =
    'https://images.unsplash.com/photo-1516321310762-90b0e7f8b4b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&h=160&q=80'

  // Compute cover image using useMemo for performance
  const coverImage = useMemo(() => {
    const baseUrl = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}public`
    return details?.coverImage
      ? `${baseUrl}/courses/cover-images/${details.coverImage}`
      : DEFAULT_COURSE_IMAGE
  }, [details?.coverImage])

  // Base material URL
  const baseMaterialUrl = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}public/courses/material/`

  

  return (
    <>
    
      {/* Header */}
      <Header>
        <h1
          className='w-full text-2xl font-extrabold tracking-tight md:text-3xl'
          style={gradientTextStyle}
        >
          Course Details
        </h1>
          <Button
            size='sm'
            onClick={() => window.history.back()}
            variant='outline'
            className="ml-auto text-black"
          >
      <ArrowLeft/>
            Back
          </Button>

      </Header>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      {/* Course Card */}
      <div className='mx-4 mt-4'>
        <div className='group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg'>
          {/* Glow effect */}
          <div className='pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-amber-500/10 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100' />

          {/* Course Cover Image */}
          <div className='relative'>
            <div className='absolute inset-0 z-10 rounded-t-xl bg-gradient-to-t from-black/20 via-transparent to-transparent' />
            <img
              src={coverImage}
              alt={`${details.name} cover`}
              className='h-80 w-full rounded-t-xl object-cover object-center sm:h-96'
              loading='lazy'
            />
            <Badge className='absolute right-4 bottom-4 z-20 rounded-full border-0 bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1.5 font-semibold text-white shadow-lg'>
              {details.category?.name || 'Uncategorized'}
            </Badge>
          </div>

          {/* Course Content */}
          <div className='relative p-6 sm:p-8'>
            {/* Course Header */}
            <div className='mb-8'>
              <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                <div className='flex-1'>
                  <h1
                    className='mb-4 text-3xl leading-tight font-bold lg:text-4xl'
                    style={gradientTextStyle}
                  >
                    {details.name || 'Unnamed Course'}
                  </h1>
                </div>
                <div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
                  <div className='flex items-center gap-3'>
                    <div className='rounded-full bg-emerald-500 p-2'>
                    
<User  className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-slate-600'>
                        Instructor
                      </p>
                      <p className='font-semibold text-slate-900'>
                        {details.instructor?.firstName || ''}{' '}
                        {details.instructor?.lastName || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-6 rounded-xl border border-slate-200 bg-white p-6'>
                <p className='text-lg leading-relaxed text-slate-600'>
                  {details.description || 'No description available.'}
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className='my-8 flex items-center justify-center'>
              <div className='h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent' />
              <div className='px-4'>
                <div className='h-3 w-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700' />
              </div>
              <div className='h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent' />
            </div>

            {/* Course Materials */}
            <div className='space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-emerald-500 p-2 shadow-sm'>
                <BookOpen className="h-6 w-6 text-white" />

                </div>
                <h2 className='text-2xl font-bold' style={gradientTextStyle}>
                  Course Materials
                </h2>
              </div>

              <div className='space-y-4'>
                {details.material && details.material.length > 0 ? (
                  details.material.map((material, index) => (
                    <div
                      key={material._id || `material-${index}`}
                      className='group/item'
                    >
                      <Accordion
                        type='single'
                        collapsible
                        className='rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg'
                      >
                        <AccordionItem
                          value={`item-${index}`}
                          className='border-none'
                        >
                          <AccordionTrigger
                            className='px-6 py-4 text-left font-semibold text-slate-900 hover:bg-slate-50 hover:text-blue-600'
                            aria-label={`Toggle ${material.title} details`}
                          >
                            <div className='flex items-center gap-3'>
                              <div className='h-2 w-2 rounded-full bg-emerald-500 transition-transform duration-200 group-hover/item:scale-125' />
                              {material.title || 'Untitled Material'}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className='space-y-4 px-6 pb-6'>
                            <div className='rounded-xl border border-slate-200 bg-white p-4'>
                              <div className='space-y-3'>
                                <div>
                                  <span className='text-sm font-semibold tracking-wide text-blue-600 uppercase'>
                                    Description:
                                  </span>
                                  <p className='mt-1 leading-relaxed text-slate-600'>
                                    {material.description ||
                                      'No description provided.'}
                                  </p>
                                </div>

                                {material.media.endsWith('.pdf') && (
                                  <iframe
                                    src={`${baseMaterialUrl}${material.media}`}
                                    className='h-[70vh] w-full rounded-lg border bg-slate-50'
                                  />
                                )}

                                {material.media.match(
                                  /\.(png|jpg|jpeg|gif)$/
                                ) && (
                                  <div className='flex h-[70vh] items-center justify-center rounded-lg border bg-slate-100'>
                                    <img
                                      src={`${baseMaterialUrl}${material.media}`}
                                      alt='Preview'
                                      className='max-h-full max-w-full object-contain'
                                    />
                                  </div>
                                )}

                                {material.media.match(/\.(mp4|webm)$/) && (
                                  <video
                                    controls
                                    src={`${baseMaterialUrl}${material.media}`}
                                    className='h-[70vh] w-full rounded-lg border bg-black'
                                  />
                                )}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  ))
                ) : (
                  <div className='py-12 text-center'>
                    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500'>
              <BookOpen className="h-8 w-8 text-white" />

                    </div>
                    <p className='text-lg text-slate-600'>
                      No course materials available yet.
                    </p>
                    <p className='mt-1 text-sm text-slate-400'>
                      Check back later for updates!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

RouteComponent.displayName = 'CourseDetails'
