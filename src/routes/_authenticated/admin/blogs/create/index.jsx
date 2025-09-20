import { useCallback, useState } from 'react'
import axios from 'axios'
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Editor } from '@tinymce/tinymce-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { Header } from '../../../../../components/layout/header'
import { useAppUtils } from '../../../../../hooks/useAppUtils'
import { queryClient } from '../../../../../utils/globalVars'

const categoryQueryOptions = () =>
  queryOptions({
    queryKey: ['blogCategory'],
    queryFn: async () => {
      try {
        const response = await axios.get('/admin/blog-category/getAll')
        console.log('Category response:', response)
        
        if (response.data?.success) {
          return { blogCategories: response.data.data }
        }
        
        throw new Error('Failed to fetch categories')
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
        return { blogCategories: [] }
      }
    },
  })

export const Route = createFileRoute('/_authenticated/admin/blogs/create/')({
  loader: () => queryClient.ensureQueryData(categoryQueryOptions()),
  component: RouteComponent,
})

const INITIAL_BLOG_STATE = {
  image: null,
  title: '',
  content: '',
  category: '',
}

const defaultCover = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/defaults/blog-image.png`

function RouteComponent() {
  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery(categoryQueryOptions())
  const { blogCategories = [] } = data || {}
  const { router } = useAppUtils()
  
  const [isLoading, setIsLoading] = useState(false)
  const [cover, setCover] = useState(null)
  const [blogObj, setBlogObj] = useState(INITIAL_BLOG_STATE)
  const [validationErrors, setValidationErrors] = useState({})

  // Form validation
  const validateForm = () => {
    const errors = {}
    
    if (!blogObj.title.trim()) {
      errors.title = 'Title is required'
    } else if (blogObj.title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters long'
    }
    
    if (!blogObj.content.trim()) {
      errors.content = 'Content is required'
    } else if (blogObj.content.trim().length < 50) {
      errors.content = 'Content must be at least 50 characters long'
    }
    
    if (!blogObj.category) {
      errors.category = 'Category selection is required'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setBlogObj(prev => ({ ...prev, [name]: value }))
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [validationErrors])

  // Handle category selection
  const handleCategoryChange = useCallback((value) => {
    setBlogObj(prev => ({ ...prev, category: value }))
    
    // Clear validation error
    if (validationErrors.category) {
      setValidationErrors(prev => ({ ...prev, category: '' }))
    }
  }, [validationErrors])

  // Handle image upload
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)')
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB')
      return
    }

    // Set display picture
    const reader = new FileReader()
    reader.onload = (e) => setCover(e.target.result)
    reader.readAsDataURL(file)
    
    // Set the image file in blog object
    setBlogObj(prev => ({ ...prev, image: file }))
  }, [])

  // Handle editor content change
  const handleEditorChange = useCallback((content) => {
    setBlogObj(prev => ({ ...prev, content }))
    
    // Clear validation error
    if (validationErrors.content) {
      setValidationErrors(prev => ({ ...prev, content: '' }))
    }
  }, [validationErrors])

  // API call to create blog
  const createBlog = useCallback(async (formData) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/admin/blog/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data?.success) {
        toast.success('Blog created successfully!')
        
        // Invalidate queries and navigate
        await queryClient.invalidateQueries({ queryKey: ['blogs'] })
        router.navigate({ to: '/admin/blogs', search: { q: '' } })
      } else {
        throw new Error(response.data?.message || 'Failed to create blog')
      }
    } catch (error) {
      console.error('Blog creation error:', error)
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create blog. Please try again.'
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [queryClient, router])

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors')
      return
    }

    const formData = new FormData()
    
    // Append all blog data to FormData
    Object.entries(blogObj).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value)
      }
    })

    await createBlog(formData)
  }, [blogObj, validateForm, createBlog])

  // Reset form
  const handleReset = useCallback(() => {
    setBlogObj(INITIAL_BLOG_STATE)
    setCover(null)
    setValidationErrors({})
  }, [])

  return (
       <div className="min-h-screen bg-[#f8fafc]">
      <Header className="bg-white border-b border-[#e2e8f0] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        <div className="my-2 flex w-full items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
            Create New Blog
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="rounded-[8px] bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => window.history.back()}
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
              Back
            </Button>
          </div>
        </div>
      </Header>

      <div className="max-w-5xl mx-auto p-6">
        {/* Main Card */}
        <div className="bg-white rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-8 transition-all duration-300 hover:shadow-lg hover:shadow-[#cbd5e1]/20">
          {/* Decorative Header */}
          <div className="mb-8 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 rounded-[12px] -z-10"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent mb-2">
              ✨ Create Your Blog Post
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full mx-auto"></div>
          </div>

          {/* Title and Category Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3 group">
              <Label htmlFor="title" className="text-sm font-semibold text-[#1e293b] flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full mr-2"></span>
                Blog Title *
              </Label>
              <div className="relative">
                <Input
                  id="title"
                  type="text"
                  name="title"
                  value={blogObj.title}
                  onChange={handleChange}
                  placeholder="Enter an engaging title..."
                  className={`bg-white rounded-[8px] border-[#e2e8f0] text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300 h-12 ${
                    validationErrors.title 
                      ? 'border-[#ef4444] focus:border-[#dc2626] shadow-[#fef2f2]' 
                      : 'hover:border-[#cbd5e1] shadow-sm hover:shadow-md'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 rounded-[8px] -z-10 group-hover:from-[#2563eb]/10 group-hover:to-[#1d4ed8]/10 transition-all duration-300"></div>
              </div>
              {validationErrors.title && (
                <p className="text-[#ef4444] text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.title}
                </p>
              )}
            </div>

            <div className="space-y-3 group">
              <Label className="text-sm font-semibold text-[#1e293b] flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full mr-2"></span>
                Category *
              </Label>
              <div className="relative">
                <Select
                  value={blogObj.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className={`bg-white rounded-[8px] border-[#e2e8f0] text-[#1e293b] h-12 focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300 ${
                    validationErrors.category 
                      ? 'border-[#ef4444] focus:border-[#dc2626]' 
                      : 'hover:border-[#cbd5e1] shadow-sm hover:shadow-md'
                  }`}>
                    <SelectValue placeholder="🏷️ Choose a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#e2e8f0] shadow-sm rounded-[8px]">
                    <SelectGroup>
                      {blogCategories?.length > 0 ? (
                        blogCategories.map((category) => (
                          <SelectItem
                            value={category._id}
                            key={category._id}
                            className="text-[#1e293b] hover:bg-[#f8fafc] rounded-lg"
                          >
                            📂 {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="no-categories" className="text-[#94a3b8]">
                          ❌ No categories available
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 rounded-[8px] -z-10 group-hover:from-[#2563eb]/10 group-hover:to-[#1d4ed8]/10 transition-all duration-300"></div>
              </div>
              {validationErrors.category && (
                <p className="text-[#ef4444] text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.category}
                </p>
              )}
            </div>
          </div>

          {/* Decorative Separator */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent"></div>
            <div className="px-4 text-[#2563eb] font-semibold">✍️ Content</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent"></div>
          </div>

          {/* Content Editor Section */}
          <div className="space-y-3 mb-8 group">
            <Label className="text-sm font-semibold text-[#1e293b] flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full mr-2"></span>
              Blog Content *
            </Label>
            <div className={`relative rounded-[8px] overflow-hidden border-[#e2e8f0] transition-all duration-300 group-hover:shadow-md ${
              validationErrors.content 
                ? 'border-[#ef4444]' 
                : 'hover:border-[#cbd5e1] shadow-sm'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#1d4ed8]/5 -z-10 group-hover:from-[#2563eb]/10 group-hover:to-[#1d4ed8]/10 transition-all duration-300"></div>
              <Editor
                apiKey="93ruijg05gmbhogd98n12gie0bj6jkfkx3v5mcyw50kfpoob"
                value={blogObj.content}
                init={{
                  height: 450,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                    'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist | outdent indent | removeformat | fullscreen | help',
                  content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:15px; line-height:1.6; color: #1e293b; }',
                  placeholder: '🚀 Start writing your amazing blog content...',
                  skin: 'borderless',
                }}
                onEditorChange={handleEditorChange}
              />
            </div>
            {validationErrors.content && (
              <p className="text-[#ef4444] text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.content}
              </p>
            )}
          </div>

          {/* Decorative Separator */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent"></div>
            <div className="px-4 text-[#2563eb] font-semibold">🖼️ Featured Image</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent"></div>
          </div>

          {/* Image Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-[12px] border border-[#e2e8f0] shadow-sm">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[#1e293b] mb-2">Featured Image</h3>
                  <p className="text-sm text-[#94a3b8] mb-4">
                    Upload a captivating image for your blog post
                    <br />
                    <span className="text-xs">Max 5MB • JPEG, PNG, WebP</span>
                  </p>
                </div>

                <Label
                  htmlFor="imageInput"
                  className="group cursor-pointer"
                >
                  <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white px-6 py-3 rounded-[8px] font-medium text-center transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {cover ? '🔄 Change Image' : '📸 Upload Image'}
                  </div>
                </Label>

                <Input
                  id="imageInput"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-[12px] blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white p-4 rounded-[12px] border border-[#e2e8f0] shadow-sm">
                  <img
                    src={cover || defaultCover}
                    alt="Blog featured image preview"
                    className="w-full h-80 object-cover rounded-[8px] border border-[#e2e8f0] shadow-sm transition-all duration-300 group-hover:shadow-md"
                    loading="lazy"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-4 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-[8px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-6">
                    <div className="text-white">
                      <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        📷 Featured Image
                      </div>
                    </div>

                    {cover && (
                      <button
                        onClick={() => {
                          setCover(null)
                          setBlogObj(prev => ({ ...prev, image: null }))
                        }}
                        className="bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-full p-2 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent mb-8"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
              className="rounded-[8px] bg-white border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
            >
              🔄 Reset Form
            </Button>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isLoading}
                className="rounded-[8px] bg-white border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
              >
                ❌ Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                laoding={isLoading}
                className="rounded-[8px] bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 min-w-[150px] font-semibold"
              >
                {isLoading ? (
                  <>
                
                    ✨ Creating...
                  </>
                ) : (
                  '🚀 Create Blog'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}