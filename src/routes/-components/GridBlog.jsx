// src/components/landing/BlogGrid.tsx
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import axios from "axios"

export const landingBlogsQuery = queryOptions({
  queryKey: ["landingBlogs"],
  queryFn: async () => {
    const res = await axios.get("/web/blogs/landing")
    console.log('res blogs',res)
    if (res.data?.success) {
      return res.data.data.blogs
    }
    return []
  },
  staleTime: 1000 * 60 * 5,
})

const defaultCover = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}public/blog-images/`

const BlogGrid = ({ grid }) => {
  const { data: blogs } = useSuspenseQuery(landingBlogsQuery)

  return (
    <div className={grid}>
      {blogs?.map((item, index) => (
        <div
          key={index}
          className="group bg-white/80 backdrop-blur-lg border border-slate-200 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-200 transition duration-500"
        >
            {console.log('defaultCover',`${defaultCover}${item.image}`)}
          {/* Cover Image */}
          <div className="p-3 pb-0 relative">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={`${defaultCover}${item.image}`}
                className="group-hover:scale-105 duration-500 w-full rounded-lg"
                alt={item.title}
              />
              <div className="absolute start-4 top-4 flex gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2.5 py-1 rounded-md shadow-md">
                  Blog
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex mb-3 text-sm text-slate-500 gap-4">
              <span className="flex items-center">
                <i className="mdi mdi-folder-outline text-blue-600 mr-1 text-base" />
                {item.category?.name}
              </span>
            </div>

            <Link
           to="/student/blogs/blog-details/$blogID"
              params={{ blogID: item._id }}
              preload="intent"
              className="text-lg font-semibold text-slate-800 hover:text-blue-600 transition"
            >
              {item.title}
            </Link>

            <p className="text-slate-600 mt-2 text-sm leading-relaxed">
              {item.content.replace(/<[^>]+>/g, "").substring(0, 80) + "..."}
            </p>

            <div className="flex justify-between items-center mt-4">
              <span className="font-semibold text-slate-700">
                {item.title}
              </span>
              <Link
                to="/student/blogs/blog-details/$blogID"
                params={{ blogID: item._id }}
                preload="intent"
                className="px-3 py-1.5 text-xs rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-lg transition"
              >
                Read More →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BlogGrid
