// src/components/landing/CourseGrid.tsx
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { queryOptions } from "@tanstack/react-query"
import axios from "axios"

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
  
  const CourseGrid = ({ grid }) => {
    const { data: courses } = useSuspenseQuery(landingCoursesQuery)
    return (
      <div className={grid}>
      {courses?.map((item, index) => (
        <div
        key={index}
        className="group bg-white/80 backdrop-blur-lg border border-slate-200 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-200 transition duration-500"
        >
          {console.log(`${defaultCover}${item.coverImage}`)}
          {/* Cover Image */}
          <div className="p-3 pb-0 relative">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={`${defaultCover}${item.coverImage}`}
                className="group-hover:scale-105 duration-500 w-full rounded-lg"
                alt={item.name}
              />
              <div className="absolute start-4 top-4 flex gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2.5 py-1 rounded-md shadow-md">
                  New
                </span>
                <span className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs px-2.5 py-1 rounded-md shadow-md">
                  Popular
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex mb-3 text-sm text-slate-500 gap-4">
              <span className="flex items-center">
                <i className="mdi mdi-book-open-outline text-blue-600 mr-1 text-base" />
                {item.meterial?.length} Materials
              </span>
              <span className="flex items-center">
                <i className="mdi mdi-account-group text-blue-600 mr-1 text-base" />
                {0} Students
              </span>
            </div>

            <Link
              to="/student/courses/$courseID"
              params={{ courseID: item._id }}
              preload="intent"
              className="text-lg font-semibold text-slate-800 hover:text-blue-600 transition"
            >
              {item.name}
            </Link>

            <p className="text-slate-600 mt-2 text-sm leading-relaxed">
              {item.description.substring(0, 60) + "..."}
            </p>

            <div className="flex justify-between items-center mt-4">
              <span className="font-semibold text-slate-700">
                {item.name}
              </span>
              <Link
                to="/student/courses/$courseID"
                params={{ courseID: item._id }}
                preload="intent"
                className="px-3 py-1.5 text-xs rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-lg transition"
              >
                Explore →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CourseGrid
