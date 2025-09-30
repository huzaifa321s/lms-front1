import { createLazyFileRoute, Link, useParams } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query"
import axios from "axios"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

// 🔹 Query Options
export const blogQueryOptions = (deps) =>
  queryOptions({
    queryKey: ["getBlog", deps.blogID],
    queryFn: async () => {
      try {
        const response = await axios.get(`/web/blog/getBlog/${deps.blogID}`)
        if (response.data.success) {
          return response.data.data
        } else {
          throw new Error("API returned success: false")
        }
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Failed to fetch blog")
      }
    },
  })

// 🔹 Route Setup
export const Route = createLazyFileRoute(
  "/student/blogs/blog-details/$blogID"
)({
  component: () => (
    <Suspense fallback={<Skeleton className="h-screen w-full" />}>
  <BlogDetailsPage />
</Suspense>
  )
})

// 🔹 Blog Details Page
export default function BlogDetailsPage() {
  const params = useParams({ from: "/student/blogs/blog-details/$blogID" })

  // useSuspenseQuery will suspend until data is ready
  const { data: blog } = useSuspenseQuery(
    blogQueryOptions({ blogID: params.blogID })
  )

  if (!blog) {
    return (
      <div className="min-h-screen p-8 space-y-6">
        <Skeleton className="h-80 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero */}
      <div className="relative h-80">
        <img
          src={blog?.coverImage || "/course/1.jpg"}
          alt="Blog Hero"
          className="w-full h-full object-cover rounded-b-[20px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-[20px]" />

        <div className="absolute inset-0 flex flex-col justify-end items-center pb-10 px-6 text-center text-white">
          <Link to="/student/blogs">
            <Button size="icon" className="absolute top-6 left-6 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 shadow">
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
              {blog?.category?.name || "General"}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold drop-shadow-lg max-w-3xl">
            {blog?.title}
          </h1>
          <p className="text-sm text-gray-200 mt-2">
            Published {blog?.publishedAt} • By {blog?.author?.name}
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto p-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="rounded-xl shadow-lg border-0">
            <CardContent className="prose prose-slate prose-lg max-w-none py-8">
              <div dangerouslySetInnerHTML={{ __html: blog?.content }} />
            </CardContent>
          </Card>

          {/* Tags */}
          <div className="flex gap-3 flex-wrap">
            {blog?.tags?.map((tag) => (
              <Badge
                key={tag}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-20 h-fit">
          <Card className="rounded-xl shadow-lg border-0">
            <CardHeader>
              <CardTitle>Author</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-blue-500 ring-offset-2">
                <AvatarImage src={blog?.author?.avatar || "/user.png"} />
                <AvatarFallback>
                  {blog?.author?.name?.slice(0, 2).toUpperCase() || "AU"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-slate-800">
                  {blog?.author?.name}
                </p>
                <p className="text-sm text-slate-500">
                  {blog?.author?.role || "Contributor"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-lg border-0">
            <CardHeader>
              <CardTitle>Recent Blogs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {blog?.recentBlogs?.map((recent) => (
                <Link
                  key={recent._id}
                  className="block px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 hover:text-blue-700 transition"
                  to={`/student/blogs/blog-details/${recent._id}`}
                >
                  {recent.title}
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
