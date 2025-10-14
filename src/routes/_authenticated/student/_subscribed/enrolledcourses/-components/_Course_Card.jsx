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
      <Card className='group relative flex h-[24rem] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl md:w-72'>
        {/* Image Section */}
        <div className='relative h-44 overflow-hidden'>
          <img
            src={image}
            alt={title}
            width={320}
            height={160}
            className='h-full w-full rounded-t-2xl object-cover transition-transform duration-700 group-hover:scale-110'
            loading='lazy'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />

          {/* Category Badge */}
          {category && (
            <Badge className='absolute top-2 left-2 flex items-center gap-1 rounded-full border-0 bg-gradient-to-r from-blue-600 to-blue-700 px-2.5 py-0.5 text-[11px] font-medium text-white shadow-md'>
              <Tag className='h-3 w-3' />
              {category}
            </Badge>
          )}
        </div>

        {/* Title */}
        <CardHeader className='p-4 pb-1'>
          <h2 className='line-clamp-2 flex items-center gap-2 font-sans text-base font-bold text-slate-800 transition-colors duration-300 group-hover:text-blue-700'>
            <BookOpen className='h-4 w-4 text-blue-600' />
            {title}
          </h2>
        </CardHeader>

        {/* Footer with Actions */}
        <CardFooter className='mt-auto flex items-center justify-between p-4'>
          <Button
            size='sm'
            onClick={() =>
              navigate({ to: `/student/enrolledcourses/${courseId}` })
            }
            aria-label={`View details for ${title} course`}
            className='relative w-[48%] overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transition-all duration-500 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg'
          >
            <Eye className='mr-1 h-4 w-4' />
            View
          </Button>

          {/* Popover for Details */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size='sm'
                variant='outline'
                className='w-[48%] border-blue-600 text-blue-600 hover:bg-blue-50'
              >
                <Info className='mr-1 h-4 w-4' />
                Details
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side='top'
              align='center'
              className='w-80 space-y-4 rounded-2xl border border-slate-200/50 bg-white/95 p-4 text-sm shadow-xl backdrop-blur-md'
            >
              {/* Tabs for structured content */}
              <Tabs defaultValue='overview' className='space-y-3'>
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='overview'>Overview</TabsTrigger>
                  <TabsTrigger value='materials'>Materials</TabsTrigger>
                  <TabsTrigger value='instructor'>Instructor</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent
                  value='overview'
                  className='scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent max-h-36 space-y-2 overflow-y-auto'
                >
                  <p className='text-slate-700'>
                    {desc || 'No description available.'}
                  </p>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-slate-700'>
                      <FileText className='h-4 w-4 text-blue-500' />
                      <span>
                        <strong>{material || 0}</strong> materials
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-slate-700'>
                      <CalendarDays className='h-4 w-4 text-blue-500' />
                      <span>Enrolled on {format(enrollmentDate, 'PPP')}</span>
                    </div>
                  </div>
                </TabsContent>

                {/* Materials Tab */}
                <TabsContent
                  value='materials'
                  className='scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent max-h-36 space-y-2 overflow-y-auto'
                >
                  {materials?.length ? (
                    <Collapsible>
                      <CollapsibleTrigger className='w-full rounded-lg bg-blue-50 px-3 py-2 text-left font-medium transition hover:bg-blue-100'>
                        Show Materials
                      </CollapsibleTrigger>
                      <CollapsibleContent className='scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent max-h-32 space-y-1 overflow-y-auto px-2 py-2'>
                        {materials.map((mat) => (
                          <p
                            key={mat._id}
                            className='rounded bg-[whitesmoke] px-2 py-1 text-sm text-slate-700'
                          >
                            {mat.title}
                          </p>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <p className='text-slate-500'>No materials available.</p>
                  )}
                </TabsContent>

                {/* Instructor Tab */}
                <TabsContent
                  value='instructor'
                  className='scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent max-h-36 space-y-2 overflow-y-auto'
                >
                  <div className='flex items-center gap-2 text-slate-700'>
                    <User className='h-4 w-4 text-blue-500' />
                    <span>
                      {instructor?.firstName
                        ? `${instructor.firstName} ${instructor.lastName || ''}`
                        : 'Unknown Instructor'}
                    </span>
                  </div>
                  {instructor?.bio && (
                    <p className='text-sm text-slate-600'>{instructor.bio}</p>
                  )}
                </TabsContent>
              </Tabs>

              <Separator className='my-2' />

              {/* Quick Actions */}
              <div className='flex justify-between gap-2'>
                <Button
                  size='sm'
                  className='flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                  onClick={() =>
                    navigate({ to: `/student/enrolledcourses/${courseId}` })
                  }
                >
                  <Eye className='mr-1 h-4 w-4' />
                  View Course
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </CardFooter>
      </Card>
    )
  }
)
