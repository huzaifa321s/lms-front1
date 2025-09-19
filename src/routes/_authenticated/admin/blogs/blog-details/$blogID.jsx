import { useState } from "react"
import axios from "axios"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { useParams, createFileRoute, useSearch, useNavigate } from "@tanstack/react-router"
import { ChevronLeft, Layers, Calendar, Edit3, Trash2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QueryClient } from "@tanstack/react-query"
import { openModal } from "../../../../../shared/config/reducers/admin/DialogSlice"
import { useAppUtils } from "../../../../../hooks/useAppUtils"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Define the query options for TanStack Query
const blogQueryOption = (params) =>
  queryOptions({
    queryKey: ["getBlog", "getCategory", params.params.blogID],
    queryFn: async () => {
      try {
        console.log('params.deps.category ====>',params.deps.category)
        const [blogDetailsResponse, blogCategoryResponse] = await Promise.all([
          axios.get(`/admin/blog/getBlog/${params.params.blogID}`),
          axios.get(`/admin/blog-category/getCategory/${params.deps.category}`),
        ])
        return {
          blogDetails: blogDetailsResponse.data.success ? blogDetailsResponse.data.data : null,
          blogCategory: blogCategoryResponse.data.success ? blogCategoryResponse.data.data : null,
        }
      } catch (error) {
        console.error("Failed to fetch blog data:", error)
        return { blogDetails: null, blogCategory: null }
      }
    },
  })

// TanStack Router route setup
export const Route = createFileRoute("/_authenticated/admin/blogs/blog-details/$blogID")({
  validateSearch: (search) => ({ category: search.category }),
  loaderDeps: ({ search }) => ({ category: search.category }),
  loader: (params) => queryClient.ensureQueryData(blogQueryOption(params)),
  component: BlogDetailsPage,
})

function BlogDetailsPage() {
  const { blogID } = useParams({
    from: "/_authenticated/admin/blogs/blog-details/$blogID",
  })
  const { category } = useSearch({ from: "/_authenticated/admin/blogs/blog-details/$blogID" })
  const params = { params: { blogID }, deps: { category } }
  const { data } = useSuspenseQuery(blogQueryOption(params))
  const { blogDetails, blogCategory } = data
const {navigate,dispatch} = useAppUtils();
  const defaultCover = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/defaults/blog-image.png`
  const [cover, setCover] = useState(
    blogDetails?.image
      ? `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}/courses/cover-images/${blogDetails.image}`
      : defaultCover,
  )

  console.log('blogDetails ==>',blogDetails)

   return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4 text-[#2563eb]" />
              </Button>

              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">
                  Blog Details
                </h1>
                <p className="text-[#94a3b8]">Manage blog content</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => navigate({ to: `/admin/blogs/edit/${blogDetails?._id}` })}
              >
                <Edit3 className="h-4 w-4 mr-2 text-[#2563eb]" />
                Edit
              </Button>

              <Button
                variant="destructive"
                className="rounded-[8px] bg-[#ef4444] text-white hover:bg-[#dc2626] focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => dispatch(openModal({ type: 'delete-blog', props: { blogID: blogDetails?._id, redirect: '/admin/blogs' } }))}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <main className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#e2e8f0] overflow-hidden hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
            <div className="relative h-64 md:h-80">
              <img
                src={cover || "/placeholder.svg"}
                alt={blogDetails?.title || "Blog Cover Image"}
                className="w-full h-full object-cover"
                onError={() => setCover(defaultCover)}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-white drop-shadow-lg" />
                  <span className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white px-4 py-2 text-sm rounded-full shadow-sm font-medium">
                    {blogCategory?.name || "Category"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent leading-tight">
                  {blogDetails?.title || "Loading Title..."}
                </h2>

                {blogDetails?.subtitle && (
                  <p className="text-xl text-[#64748b] leading-relaxed">{blogDetails.subtitle}</p>
                )}

                <div className="flex items-center gap-3 text-[#94a3b8]">
                  <div className="p-2 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full">
                    <Calendar className="h-4 w-4 text-[#2563eb]" />
                  </div>
                  <span className="text-sm font-medium">
                    Created{" "}
                    {new Date(blogDetails?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent"></div>

              <div className="pt-2">
                <div className="prose max-w-none">
                  <p className="text-[#1e293b] text-lg leading-relaxed font-light">
                    {blogDetails?.content || "Loading content..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}