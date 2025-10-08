// src/components/landing/CourseGrid.tsx
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { queryOptions } from "@tanstack/react-query"
import axios from "axios"
import { memo } from "react"

export const landingCoursesQuery = queryOptions({
  queryKey: ["landingCourses"],
  queryFn: async () => {
    const res = await axios.get("/web/courses/landing")
    console.log('res courses',res)
    if(res.data?.success){
 return res.data.data.courses
    }
  },
  staleTime: 1000 * 60 * 5,
})

  const defaultCover = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}public/courses/cover-images/`
  
  const CourseGrid = memo(({ grid }) => {
    const { data: courses } = useSuspenseQuery(landingCoursesQuery)
    return (
    <div className={grid}>
      {courses?.map((item, index) => (
        <div key={index} className="course-card">
          <div className="p-3 pb-0 relative">
            <div className="course-card-image">
              <img
                src={`${defaultCover}${item.coverImage}`}
                alt={item.name}
                className="course-card-img"
              />
              <div className="absolute start-4 top-4 flex gap-2">
                <span className="course-badge badge-new">New</span>
                <span className="course-badge badge-popular">Popular</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="course-info">
              <span className="course-info-item">
                <i className="mdi mdi-book-open-outline text-blue-600 mr-1 text-base" />
                {item.meterial?.length || 0} Materials
              </span>
              <span className="course-info-item">
                <i className="mdi mdi-account-group text-blue-600 mr-1 text-base" />
                {0} Students
              </span>
            </div>

            <Link
              to="/student/courses/$courseID"
              params={{ courseID: item._id }}
              preload="intent"
              className="course-title"
            >
              {item.name}
            </Link>

            <p className="course-desc">
              {item.description.substring(0, 60) + "..."}
            </p>

            <div className="course-footer">
              <span className="font-semibold text-slate-700">{item.name}</span>
              <Link
                to="/student/courses/$courseID"
                params={{ courseID: item._id }}
                preload="intent"
                className="course-btn"
              >
                Explore →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})

export default CourseGrid
