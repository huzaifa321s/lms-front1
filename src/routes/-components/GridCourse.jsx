// src/components/landing/CourseGrid.tsx
import { memo } from 'react'
import axios from 'axios'
import { useSuspenseQuery } from '@tanstack/react-query'
import { queryOptions } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export const landingCoursesQuery = queryOptions({
  queryKey: ['landingCourses'],
  queryFn: async () => {
    const res = await axios.get('/web/courses/landing')
    if (res.data?.success) {
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
        <div key={index} className='course-card'>
          <div className='relative p-3 pb-0'>
            <div className='course-card-image'>
              <img
                src={`${defaultCover}${item.coverImage}`}
                alt={item.name}
                className='course-card-img'
              />
              <div className='absolute start-4 top-4 flex gap-2'>
                <span className='course-badge badge-new'>New</span>
                <span className='course-badge badge-popular'>Popular</span>
              </div>
            </div>
          </div>

          <div className='p-6'>
            <div className='course-info'>
              <span className='course-info-item'>
                <i className='mdi mdi-book-open-outline mr-1 text-base text-blue-600' />
                {item.meterial?.length || 0} Materials
              </span>
              <span className='course-info-item'>
                <i className='mdi mdi-account-group mr-1 text-base text-blue-600' />
                {0} Students
              </span>
            </div>

            <Link
              to='/student/courses/$courseID'
              params={{ courseID: item._id }}
              preload='intent'
              className='course-title'
            >
              {item.name}
            </Link>

            <p className='course-desc'>
              {item.description.substring(0, 60) + '...'}
            </p>

            <div className='course-footer'>
              <span className='font-semibold text-slate-700'>{item.name}</span>
              <Link
                to='/student/courses/$courseID'
                params={{ courseID: item._id }}
                preload='intent'
                className='course-btn'
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
