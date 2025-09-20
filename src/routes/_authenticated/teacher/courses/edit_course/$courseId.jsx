import React, { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { objectToFormData } from '../../../../../shared/utils/helperFunction'

// Recreating components from shadcn/ui and icons from lucide-react with Tailwind CSS and inline SVGs.

// Mock data to replace external API calls

const queryClient = new QueryClient()

const editCourseQueryOptions = (params) =>
  queryOptions({
    queryKey: ['course-category', params.courseId],

    queryFn: async () => {
      try {
        let courseDetails = await axios.get(
          `/teacher/course/getCourse/${params.courseId}`,

          {}
        )

        courseDetails = courseDetails.data

        let courseCategories = await axios.get(
          '/teacher/course-category/getAll'
        )

        console.log('courseCategories ===>', courseCategories)

        courseCategories = courseCategories.data

        const resultObj = {}

        if (courseDetails.success) {
          resultObj.data = courseDetails.data
        }

        console.log('resultObj after update ===>', resultObj)

        if (courseCategories.success) {
          resultObj.courseCategories = courseCategories.data
        }

        return resultObj
      } catch (error) {
        console.log('error', error)

        return { data: null, courseCategories: null }
      }
    },
  })

export const Route = createFileRoute(
  '/_authenticated/teacher/courses/edit_course/$courseId'
)({
  component: App,

  loader: ({ params }) =>
    queryClient.ensureQueryData(editCourseQueryOptions(params)),
})

const mockCourseDetails = {
  _id: '123',
  name: 'Advanced React Development',
  description:
    'Master modern React development with hooks, context, and advanced patterns. Learn to build scalable applications with best practices.',
  category: '1',
  coverImage:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
  material: [
    {
      _id: 'mat1',
      title: 'Introduction to React Hooks',
      description:
        'Learn the fundamentals of React Hooks including useState, useEffect, and custom hooks.',
      media: { name: 'react-hooks-guide.pdf' },
    },
    {
      _id: 'mat2',
      title: 'State Management with Context',
      description:
        'Deep dive into React Context API and state management patterns.',
      media: { name: 'context-api-tutorial.pdf' },
    },
    {
      _id: 'mat3',
      title: 'Advanced Component Patterns',
      description:
        'Explore render props, higher-order components, and compound components.',
      media: { name: 'advanced-patterns.pdf' },
    },
  ],
}

const defaultCover =
  'https://placehold.co/800x600/E5E7EB/9CA3AF?text=Course+Cover'

// This is the main component that replaces the `RouteComponent`
function App() {
  const params = useParams({
    from: '/_authenticated/teacher/courses/edit_course/$courseId',
  })
  const { data } = useSuspenseQuery(editCourseQueryOptions(params))
  const { courseCategories } = data

  console.log('data ==>', data)
  // State to manage the course object, initialized with mock data
  const [courseObj, setCourseObj] = useState(data.data || mockCourseDetails)
  // State for the cover image preview URL
  const [cover, setCover] = useState(
    data.data.coverImage || mockCourseDetails.coverImage
  )
  // State to track if the data is being saved
  const [isSaving, setIsSaving] = useState(false)
  // State to track materials that are removed
  const [removedMaterial, setRemovedMaterial] = useState([])

  // Simulating a navigation back function
  const router = {
    history: {
      back: () => console.log("Simulating 'back' navigation..."),
    },
  }

  // Handle Changes for top-level course object
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setCourseObj((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleCategoryChange = useCallback((value) => {
    setCourseObj((prev) => ({ ...prev, category: value }))
  }, [])

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setCover(e.target.result)
      reader.readAsDataURL(file)
      setCourseObj((prev) => ({ ...prev, coverImage: file }))
    }
  }, [])

  // Materials
  const addMaterial = useCallback(() => {
    setCourseObj((prev) => ({
      ...prev,
      material: [
        ...prev.material,
        {
          title: '',
          description: '',
          media: '',
        },
      ],
    }))
  }, [])

  const removeMaterial = useCallback(
    (i) => {
      const updatedMaterials = [...courseObj.material]
      if (params.courseId && updatedMaterials[i]._id) {
        const removed = updatedMaterials[i]
        setRemovedMaterial((prev) => [...prev, removed])
      }
      updatedMaterials.splice(i, 1)
      setCourseObj((prev) => ({ ...prev, material: updatedMaterials }))
    },
    [courseObj.material, params.courseId]
  )

  const handleMaterialChange = useCallback(
    (i, e) => {
      const { name, value } = e.target
      const updatedMaterials = [...courseObj.material]
      updatedMaterials[i][name] = value
      console.log('value ===>', value)
      setCourseObj((prev) => ({ ...prev, material: updatedMaterials }))
    },
    [courseObj.material]
  )

  const handleMaterialFileUpload = useCallback(
    (i, e) => {
      const file = e.target.files[0]
      const updatedMaterials = [...courseObj.material]
      updatedMaterials[i].media = file
      setCourseObj((prev) => ({ ...prev, material: updatedMaterials }))
    },
    [courseObj.material]
  )

  // Simulating the mutation process
  const updateCourseMutation = useCallback(async () => {
    setIsSaving(true)
    courseObj['material_length'] = courseObj.material?.length
    courseObj['removed_material'] = removedMaterial
    courseObj['removed_material_length'] = removedMaterial.length
    // Simulating a successful API call with a delay
    try {
      var formdata = objectToFormData(courseObj)
      console.log('coursObj ===>', courseObj)
      let response = await axios.put(
        `/teacher/course/edit/${params.courseId}`,
        formdata
      )
      response = response.data
      if (response.success) {
        await queryClient.invalidateQueries(editCourseQueryOptions(params))
        toast.success(response.message)
      }
    } catch (error) {
      console.log('error', error)
      const errorResponse = error.response.data
      toast.error(errorResponse.message)
    } finally {
      setIsSaving(false)
    }
  }, [
    courseObj,
    removedMaterial,
    axios,
    toast,
    params,
    router,
    queryClient,
    editCourseQueryOptions,
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    updateCourseMutation()
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] font-sans'>
      {/* Background decorative effects */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-3xl'></div>
        <div className='absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-3xl'></div>
      </div>

      {/* Header */}
      <Card className='relative z-10 rounded-none border-b border-[#e2e8f0] bg-white/95 shadow-[0_4px_6px_rgba(0,0,0,0.05)] backdrop-blur-sm'>
        <CardContent className='mx-auto max-w-1/2 px-4 py-4 sm:px-6'>
          <div className='flex w-full items-center justify-between gap-2'>
            <div className='flex items-center gap-6'>
              <div className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                Edit Course
              </div>
              <div className='hidden h-8 w-px bg-gradient-to-b from-[#2563eb]/20 to-[#1d4ed8]/20 sm:block'></div>
              <div className='hidden items-center gap-2 text-[#2563eb] sm:flex'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' />
                  <path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' />
                </svg>
                <span className='text-sm font-medium'>
                  Modify Course Details
                </span>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Button
                variant='outline'
                className='rounded-[8px] border-[#e2e8f0] px-4 py-2 font-medium text-[#2563eb] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]'
                onClick={() => window.history.back()}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='mr-2'
                >
                  <path d='m12 19-7-7 7-7' />
                  <path d='M19 12H5' />
                </svg>
                Back
              </Button>
              <Button
                className='rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-4 py-2 font-medium text-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='mr-2'
                    >
                      <path d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z' />
                      <polyline points='17 21 17 13 7 13 7 21' />
                      <polyline points='7 3 7 8 15 8' />
                    </svg>
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className='relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6'>
        {/* Course Details Card */}
        <Card className='relative overflow-hidden rounded-[8px] border border-[#e2e8f0] bg-white/95 shadow-[0_4px_6px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='28'
                height='28'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#2563eb'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' />
                <path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' />
              </svg>
              <h2 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                Course Details
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Cover Image and Form Fields */}
              <div className='grid gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='coverImage'
                    className='text-sm font-medium text-[#64748b]'
                  >
                    Course Cover Image
                  </Label>
                  <div className='group/image relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-[8px] border border-dashed border-[#e2e8f0] transition-all duration-300 hover:border-[#2563eb]'>
                    <img
                      src={cover || defaultCover}
                      alt='Course Cover'
                      className='h-full w-full object-cover transition-transform duration-300 group-hover/image:scale-105'
                      loading="lazy"
                    />
                    <div className='absolute inset-0 flex items-center justify-center bg-[#2563eb]/40 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='32'
                        height='32'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <rect
                          width='18'
                          height='18'
                          x='3'
                          y='3'
                          rx='2'
                          ry='2'
                        />
                        <circle cx='9' cy='9' r='2' />
                        <path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' />
                      </svg>
                    </div>
                    <input
                      id='coverImage'
                      type='file'
                      accept='image/*'
                      onChange={handleImageUpload}
                      className='absolute inset-0 cursor-pointer opacity-0'
                    />
                  </div>
                  <p className='text-xs text-[#64748b]'>
                    Upload a high-quality image. JPG, PNG, or GIF.
                  </p>
                </div>

                {/* Name, Description, Category */}
                <div className='space-y-4'>
                  <div>
                    <Label
                      htmlFor='name'
                      className='text-sm font-medium text-[#64748b]'
                    >
                      Course Name
                    </Label>
                    <Input
                      id='name'
                      name='name'
                      value={courseObj.name}
                      onChange={handleChange}
                      placeholder='e.g., Advanced React Patterns'
                      className='mt-1 h-10 w-full max-w-md rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor='description'
                      className='text-sm font-medium text-[#64748b]'
                    >
                      Course Description
                    </Label>
                    <Textarea
                      id='description'
                      name='description'
                      value={courseObj.description}
                      onChange={handleChange}
                      placeholder='e.g., Master modern React development with...'
                      className='mt-1 min-h-[120px] w-full max-w-md resize-y rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor='category'
                      className='text-sm font-medium text-[#64748b]'
                    >
                      Category
                    </Label>
                    <Select
                      name='category'
                      value={courseObj.category}
                      onValueChange={handleCategoryChange}
                    >
                      {console.log('courseObj ==>', courseObj)}
                      <SelectTrigger className='mt-1 h-10 w-full max-w-md rounded-[8px] border-[#e2e8f0] text-[#1e293b] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'>
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                      <SelectContent>
                        {courseCategories?.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Materials Card */}
        <Card className='relative overflow-hidden rounded-[8px] border border-[#e2e8f0] bg-white/95 shadow-[0_4px_6px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='28'
                  height='28'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#2563eb'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20' />
                </svg>
                <h2 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                  Course Materials ({courseObj.material.length})
                </h2>
              </div>
              <Button
                variant='outline'
                className='rounded-[8px] border-[#e2e8f0] px-4 py-2 font-medium text-[#2563eb] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]'
                onClick={addMaterial}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='mr-2'
                >
                  <path d='M5 12h14' />
                  <path d='M12 5v14' />
                </svg>
                Add Material
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {courseObj.material.length === 0 && (
                <div className='py-8 text-center text-[#64748b]'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='48'
                    height='48'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#64748b'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='mx-auto mb-3 h-12 w-12'
                  >
                    <path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' />
                    <path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' />
                  </svg>
                  <p>
                    No materials added yet. Click "Add Material" to get started.
                  </p>
                </div>
              )}
              {courseObj.material.map((mat, i) => (
                <Card
                  key={i}
                  className='group relative rounded-[8px] border border-[#e2e8f0] bg-[#f8fafc] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:bg-[#2563eb]/5'
                >
                  {i != 0 && <Button
                    variant='ghost'
                    className='absolute top-2 right-2 rounded-full p-1 text-[#64748b] transition-colors duration-200 hover:bg-transparent hover:text-[#ef4444]'
                    onClick={() => removeMaterial(i)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M3 6h18' />
                      <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
                      <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
                    </svg>
                  </Button>}
                  <CardContent className='space-y-4 p-0'>
                    <div>
                      <Label
                        htmlFor={`material-title-${i}`}
                        className='text-sm font-medium text-[#64748b]'
                      >
                        Material Title
                      </Label>
                      <Input
                        id={`material-title-${i}`}
                        name='title'
                        value={mat.title}
                        onChange={(e) => handleMaterialChange(i, e)}
                        placeholder='e.g., Intro to Hooks'
                        className='mt-1 h-10 w-full  rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`material-description-${i}`}
                        className='text-sm font-medium text-[#64748b]'
                      >
                        Description
                      </Label>
                      <Textarea
                        id={`material-description-${i}`}
                        name='description'
                        value={mat.description}
                        onChange={(e) => handleMaterialChange(i, e)}
                        placeholder='A brief description of the material...'
                        className='mt-1 min-h-[80px] w-full  resize-y rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`material-media-${i}`}
                        className='text-sm font-medium text-[#64748b]'
                      >
                        File Upload
                      </Label>
                      <div className='mt-1 flex items-center space-x-2'>
                        <Input
                          id={`material-media-${i}`}
                          name='media'
                          type='file'
                          onChange={(e) => handleMaterialFileUpload(i, e)}
                          className='max-w-md flex-1 rounded-[8px] border-[#e2e8f0] text-[#1e293b] file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-[#2563eb]'
                        />
                        {mat.media && (
                          <span className='inline-flex items-center rounded-full border border-[#2563eb]/20 bg-[#2563eb]/10 px-2.5 py-0.5 text-xs font-semibold text-[#2563eb]'>
                            {mat.media.name || mat.media.split('/').pop()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
