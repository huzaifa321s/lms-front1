import { memo } from 'react'
import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import {
  Eye,
  BookOpen,
  Info,
  Tag,
  FileText,
  User,
  CalendarDays,
  Share2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const DEFAULT_COURSE_IMAGE =
  'https://images.unsplash.com/photo-1516321310762-90b0e7f8b4b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&h=160&q=80'

export const CardDemo = memo(
  ({
    image,
    title,
    desc,
    category,
    material,
    instructor,
    enrollmentDate,
    courseId,
    materials,
  }) => {
    const navigate = useNavigate()

    return (
      <Card className='group relative flex h-[26rem] w-full flex-col overflow-hidden rounded-3xl border-0 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] md:w-72'>
        {/* Image Section with Overlay */}
        <div className='relative h-48 overflow-hidden'>
          <img
            src={image || DEFAULT_COURSE_IMAGE}
            alt={title}
            className='h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110'
            loading='lazy'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

          {/* Quick Stats on Hover */}
          <div className='absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-all duration-500 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100'>
            <div className='flex flex-col items-center bg-white/20 backdrop-blur-md rounded-2xl p-3 text-white border border-white/30'>
              <FileText className='h-5 w-5 mb-1' />
              <span className='text-xs font-bold'>{material || 0}</span>
            </div>
            <div className='flex flex-col items-center bg-white/20 backdrop-blur-md rounded-2xl p-3 text-white border border-white/30'>
              <CalendarDays className='h-5 w-5 mb-1' />
              <span className='text-xs font-bold'>{format(enrollmentDate, 'MMM yy')}</span>
            </div>
          </div>

          {/* Category Badge */}
          {category && (
            <Badge className='absolute top-4 left-4 flex items-center gap-1.5 rounded-xl border-white/20 bg-blue-600/90 py-1 px-3 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md'>
              <Tag className='h-3 w-3' />
              {category}
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className='flex flex-1 flex-col p-5'>
          <div className='mb-3 flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white'>
              <BookOpen className='h-4 w-4' />
            </div>
            <span className='text-[10px] font-bold uppercase tracking-widest text-slate-400'>Course</span>
          </div>

          <h2 className='mb-2 line-clamp-2 min-h-[3rem] font-sans text-lg font-extrabold leading-tight text-slate-800 transition-colors duration-300 group-hover:text-blue-600'>
            {title}
          </h2>

          <div className='mt-auto flex items-center gap-3 border-t border-slate-50 pt-4'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white'>
              <User className='h-4 w-4 text-slate-500' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[11px] font-semibold text-slate-400'>Instructor</span>
              <span className='text-xs font-bold text-slate-700 truncate max-w-[120px]'>
                {instructor?.firstName ? `${instructor.firstName} ${instructor.lastName || ''}` : 'Independent'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <CardFooter className='grid grid-cols-2 gap-3 bg-slate-50/50 p-4 backdrop-blur-sm'>
          <Button
            size='sm'
            onClick={() => navigate({ to: `/student/enrolledcourses/${courseId}` })}
            className='h-10 rounded-2xl bg-slate-900 font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-600 hover:shadow-blue-200 active:scale-95'
          >
            <Eye className='mr-2 h-4 w-4' />
            Learn
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                size='sm'
                variant='outline'
                className='h-10 rounded-2xl border-2 border-slate-200 bg-white font-bold text-slate-700 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 active:scale-95'
              >
                <Info className='mr-2 h-4 w-4' />
                Details
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side='top'
              align='center'
              className='z-50 w-80 overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 p-0 shadow-2xl backdrop-blur-2xl transition-all'
            >
              <Tabs defaultValue='overview' className='flex flex-col'>
                <TabsList className='grid h-14 w-full grid-cols-3 bg-slate-100/50 p-1'>
                  <TabsTrigger value='overview' className='rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-sm'>Overview</TabsTrigger>
                  <TabsTrigger value='materials' className='rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-sm'>Curriculum</TabsTrigger>
                  <TabsTrigger value='instructor' className='rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-sm'>Expert</TabsTrigger>
                </TabsList>

                <div className='p-6'>
                  <TabsContent value='overview' className='mt-0 space-y-4'>
                    <div className='space-y-1'>
                      <h4 className='text-xs font-bold uppercase tracking-widest text-blue-600'>About this course</h4>
                      <p className='line-clamp-4 text-sm leading-relaxed text-slate-600'>
                        {desc || 'Embark on a journey to master this subject with structured lessons and practical materials.'}
                      </p>
                    </div>
                    <div className='grid grid-cols-2 gap-3 rounded-2xl bg-blue-50/50 p-3'>
                      <div className='flex items-center gap-2'>
                        <FileText className='h-4 w-4 text-blue-500' />
                        <span className='text-xs font-bold text-slate-700'>{material || 0} Files</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <CalendarDays className='h-4 w-4 text-blue-500' />
                        <span className='text-xs font-bold text-slate-700'>{format(enrollmentDate, 'PPP')}</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value='materials' className='mt-0'>
                    <div className='mb-3'>
                      <h4 className='text-xs font-bold uppercase tracking-widest text-blue-600'>Resources included</h4>
                    </div>
                    {materials?.length ? (
                      <div className='scrollbar-thin scrollbar-thumb-blue-200 max-h-48 space-y-2 overflow-y-auto pr-2'>
                        {materials.map((mat) => (
                          <div
                            key={mat._id}
                            className='flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 transition-colors hover:border-blue-100 hover:bg-blue-50/50'
                          >
                            <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 font-mono text-[10px] font-bold text-blue-600'>
                              {mat.title.charAt(0).toUpperCase()}
                            </div>
                            <span className='text-xs font-semibold text-slate-700'>{mat.title}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='flex flex-col items-center py-6 text-center'>
                        <BookOpen className='h-8 w-8 text-slate-200 mb-2' />
                        <p className='text-xs font-medium text-slate-400'>No digital materials available yet.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value='instructor' className='mt-0'>
                    <div className='flex flex-col items-center py-4 text-center'>
                      <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-200'>
                        <User className='h-10 w-10 text-white' />
                      </div>
                      <h3 className='text-lg font-bold text-slate-800 focus:outline-none'>
                        {instructor?.firstName ? `${instructor.firstName} ${instructor.lastName || ''}` : 'Authorized Instructor'}
                      </h3>
                      <p className='mt-2 text-xs font-medium leading-relaxed text-slate-500'>
                        {instructor?.bio || 'An expert dedicated to providing quality education and mentorship in this domain.'}
                      </p>
                    </div>
                  </TabsContent>
                </div>

                <div className='border-t border-slate-50 p-4'>
                  <Button
                    className='h-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 font-bold text-white shadow-lg shadow-blue-100 transition-all hover:scale-[1.02] active:scale-95'
                    onClick={() => navigate({ to: `/student/enrolledcourses/${courseId}` })}
                  >
                    View
                  </Button>
                </div>
              </Tabs>
            </PopoverContent>
          </Popover>
        </CardFooter>
      </Card>
    )
  }
)
