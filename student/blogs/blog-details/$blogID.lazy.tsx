import { Suspense } from 'react'
import { createLazyFileRoute, Link, useParams } from '@tanstack/react-router'
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

type BlogDeps = { blogID: string }
type BlogAuthor = { name?: string; role?: string; avatar?: string }
type RecentBlog = { _id: string; title: string }
type BlogData = {
  title?: string
  content?: string
  coverImage?: string
  category?: { name?: string }
  tags?: string[]
  author?: BlogAuthor
  publishedAt?: string
  recentBlogs?: RecentBlog[]
}

export const blogQueryOptions = (deps: BlogDeps) =>
  queryOptions({
    queryKey: ['getBlog', deps.blogID],
    queryFn: async (): Promise<BlogData> => {
      const response = await axios.get(`/web/blog/getBlog/${deps.blogID}`)
      if (response.data.success) {
        return response.data.data as BlogData
      }
      throw new Error(response.data.message || 'Failed to fetch blog')
    },
  })

export const Route = createLazyFileRoute('/student/blogs/blog-details/$blogID')({
  component: () => (
    <Suspense fallback={<Skeleton className='h-screen w-full' />}>
      <BlogDetailsPage />
    </Suspense>
  ),
})

export default function BlogDetailsPage() {
  const params = useParams({ from: '/student/blogs/blog-details/$blogID' })
  const { data: blog } = useSuspenseQuery(blogQueryOptions({ blogID: params.blogID }))

  if (!blog) {
    return (
      <div className='min-h-screen p-8 space-y-6'>
        <Skeleton className='h-80 w-full rounded-xl' />
        <div className='grid grid-cols-1 gap-10 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
            <Skeleton className='h-64 w-full rounded-lg' />
          </div>
          <div className='space-y-6'>
            <Skeleton className='h-32 w-full rounded-lg' />
            <Skeleton className='h-32 w-full rounded-lg' />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100'>
      <div className='relative h-80'>
        <img
          src={blog.coverImage || '/course/1.jpg'}
          alt='Blog Hero'
          className='h-full w-full rounded-b-[20px] object-cover'
        />
        <div className='absolute inset-0 rounded-b-[20px] bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
        <div className='absolute inset-0 flex flex-col items-center justify-end px-6 pb-10 text-center text-white'>
          <Link to='/student/blogs'>
            <Button size='icon' className='absolute left-6 top-6 rounded-full'>
              <ArrowLeft className='h-5 w-5' />
            </Button>
          </Link>
          <div className='mb-4 rounded-full bg-white/10 px-4 py-2 shadow backdrop-blur-md'>
            <Badge className='bg-gradient-to-r from-blue-500 to-blue-700 text-white'>
              {blog.category?.name || 'General'}
            </Badge>
          </div>
          <h1 className='max-w-3xl text-4xl font-bold drop-shadow-lg'>{blog.title}</h1>
          <p className='mt-2 text-sm text-gray-200'>
            Published {blog.publishedAt} • By {blog.author?.name}
          </p>
        </div>
      </div>
      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-10 p-8 lg:grid-cols-3'>
        <div className='space-y-10 lg:col-span-2'>
          <Card className='rounded-xl border-0 shadow-lg'>
            <CardContent className='prose prose-slate prose-lg max-w-none py-8'>
              <div dangerouslySetInnerHTML={{ __html: blog.content || '' }} />
            </CardContent>
          </Card>
          <div className='flex flex-wrap gap-3'>
            {(blog.tags || []).map((tag) => (
              <Badge key={tag} className='bg-gradient-to-r from-blue-500 to-blue-700 text-white'>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className='h-fit space-y-6 lg:sticky lg:top-20'>
          <Card className='rounded-xl border-0 shadow-lg'>
            <CardHeader>
              <CardTitle>Author</CardTitle>
            </CardHeader>
            <CardContent className='flex items-center gap-4'>
              <Avatar className='h-14 w-14 ring-2 ring-blue-500 ring-offset-2'>
                <AvatarImage src={blog.author?.avatar || '/user.png'} />
                <AvatarFallback>{blog.author?.name?.slice(0, 2)?.toUpperCase() || 'AU'}</AvatarFallback>
              </Avatar>
              <div>
                <p className='font-semibold text-slate-800'>{blog.author?.name}</p>
                <p className='text-sm text-slate-500'>{blog.author?.role || 'Contributor'}</p>
              </div>
            </CardContent>
          </Card>
          <Card className='rounded-xl border-0 shadow-lg'>
            <CardHeader>
              <CardTitle>Recent Blogs</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {(blog.recentBlogs || []).map((recent) => (
                <Link
                  key={recent._id}
                  className='block rounded-lg bg-slate-50 px-3 py-2 transition hover:bg-slate-100 hover:text-blue-700'
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
