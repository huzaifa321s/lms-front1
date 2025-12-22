// src/components/landing/BlogGrid.tsx
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import axios from "axios"
import { memo } from "react"

export const landingBlogsQuery = queryOptions({
  queryKey: ["landingBlogs"],
  queryFn: async () => {
    const res = await axios.get("/web/blogs/landing")
    console.log('res blogs', res)
    if (res.data?.success) {
      return res.data.data.blogs
    }
    return []
  },
  staleTime: 1000 * 60 * 5,
})

import { getFileUrl } from "@/utils/globalFunctions"

const BlogGrid = memo(({ grid }) => {
  const { data: blogs } = useSuspenseQuery(landingBlogsQuery)

  return (
    <div className={grid}>
      {blogs?.map((item, index) => (
        <div key={index} className="blog-card group">
          {/* Image Section */}
          <div className="blog-card-img-wrap">
            <div className="blog-card-image">
              <img
                src={getFileUrl(item.image, 'public/blog-images')}
                className="blog-img"
                alt={item.title}
              />
              <div className="absolute start-4 top-4 flex gap-2">
                <span className="blog-badge">Blog</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="blog-info">
              <span className="blog-info-item">
                <i className="mdi mdi-folder-outline text-blue-600 mr-1 text-base" />
                {item.category?.name}
              </span>
            </div>

            <Link
              to="/student/blogs/blog-details/$blogID"
              params={{ blogID: item._id }}
              preload="intent"
              className="blog-title"
            >
              {item.title}
            </Link>

            <p className="blog-desc">
              {item.content.replace(/<[^>]+>/g, "").substring(0, 80) + "..."}
            </p>

            <div className="blog-footer">
              <span className="font-semibold text-slate-700">{item.title}</span>
              <Link
                to="/student/blogs/blog-details/$blogID"
                params={{ blogID: item._id }}
                preload="intent"
                className="blog-btn"
              >
                Read More →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>

  )
})

export default BlogGrid
