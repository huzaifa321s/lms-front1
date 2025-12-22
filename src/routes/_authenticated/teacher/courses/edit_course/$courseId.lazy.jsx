import React, { useState, useCallback } from 'react'
import axios from 'axios'
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useParams, createLazyFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
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
import { objectToFormData } from '@/shared/utils/helperFunction'
import { Header } from '@/components/layout/header';
import { ArrowLeft, BookCopy, BookMarked, BookOpen, Delete, Notebook, PlusCircle, Save } from 'lucide-react'
import { getFileUrl } from '@/utils/globalFunctions'

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
        console.log('courseDetails', courseDetails)
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

export const Route = createLazyFileRoute(
  '/_authenticated/teacher/courses/edit_course/$courseId'
)({
  component: App,

  loader: ({ params }) =>
    queryClient.ensureQueryData(editCourseQueryOptions(params)),
})



const defaultCover =
  'https://placehold.co/800x600/E5E7EB/9CA3AF?text=Course+Cover'

// This is the main component that replaces the `RouteComponent`
function App() {
  const params = useParams({
    from: '/_authenticated/teacher/courses/edit_course/$courseId',
  })
  const { data } = useSuspenseQuery({ ...editCourseQueryOptions(params), retry: 1, refetchOnWindowFocus: false })
  const { courseCategories } = data

  console.log('data ==>', data)
  // State to manage the course object, initialized with mock data
  const [courseObj, setCourseObj] = useState(data.data)
  const [cover, setCover] = useState(
    getFileUrl(data.data?.coverImage, 'public/courses/cover-images')
  )
  console.log('cover', cover)
  // State to track if the data is being saved
  const [isSaving, setIsSaving] = useState(false)
  // State to track materials that are removed
  const [removedMaterial, setRemovedMaterial] = useState([])

  // Simulating a navigation back function


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
    [courseObj?.material, params.courseId]
  )

  const handleMaterialChange = useCallback(
    (i, e) => {
      const { name, value } = e.target
      const updatedMaterials = [...courseObj.material]
      updatedMaterials[i][name] = value
      console.log('value ===>', value)
      setCourseObj((prev) => ({ ...prev, material: updatedMaterials }))
    },
    [courseObj?.material]
  )

  const handleMaterialFileUpload = useCallback(
    (i, e) => {
      const file = e.target.files[0]
      const updatedMaterials = [...courseObj.material]
      updatedMaterials[i].media = file
      setCourseObj((prev) => ({ ...prev, material: updatedMaterials }))
    },
    [courseObj?.material]
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
    queryClient,
    editCourseQueryOptions,
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    updateCourseMutation()
  }

  return (
    <>
      <Header >

        <div className='flex w-full items-center justify-between gap-2'>
          <div className='flex items-center gap-6'>
            <div className=' bg-clip-text text-2xl font-bold'>
              Edit Course
            </div>
            <div className='hidden h-8 w-px bg-gradient-to-b from-[#2563eb]/20 to-[#1d4ed8]/20 sm:block'></div>
            <div className='hidden items-center gap-2 sm:flex'>
              <Notebook />
              <span className='text-sm font-medium'>
                Modify Course Details
              </span>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              className="text-black"
              onClick={() => window.history.back()}
            >
              <ArrowLeft />
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
                  <Save />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </Header>
      <div className='h-fit   bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] font-sans'>
        {/* Background decorative effects */}
        <div className='pointer-events-none absolute inset-0 overflow-hidden'>
          <div className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-3xl'></div>
          <div className='absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 opacity-20 blur-3xl'></div>
        </div>

        {/* Header */}


        {/* Main Content */}
        <div className='relative z-10 space-y-8 px-4 py-8 sm:px-6'>
          {/* Course Details Card */}
          <Card className='relative overflow-hidden rounded-[8px] border border-[#e2e8f0] bg-white/95 shadow-[0_4px_6px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <BookOpen className="h-7 w-7 text-[#2563eb]" />
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
                        <BookOpen className="h-7 w-7 text-[#2563eb]" />
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
                        className='mt-1 h-10 w-full  rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
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
                        className='mt-1 min-h-[120px] w-full  resize-y rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'
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
                  <BookMarked className="h-7 w-7 text-[#2563eb]" />
                  <h2 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent'>
                    Course Materials ({courseObj.material.length})
                  </h2>
                </div>
                <Button
                  variant='outline'
                  onClick={addMaterial}
                >
                  <PlusCircle />
                  Add Material
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {courseObj.material.length === 0 && (
                  <div className='py-8 text-center text-[#64748b]'>
                    <BookCopy className="mx-auto mb-3 h-12 w-12 text-[#64748b]" />
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
                      className="ml-auto w-fit"
                      onClick={() => removeMaterial(i)}
                    >
                      <Delete />
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
    </>
  )
}
