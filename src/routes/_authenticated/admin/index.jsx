import React, { Suspense } from 'react'
import axios from 'axios'
import { queryOptions } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import Dashboard from './features/dashboard/index'

const fetchTopCards = async () => {
  try {
    // Simulating a fast API response for the cards
    const res = await axios.get('/admin/dashboard/cards')
    return res.data.success ? res.data.data : []
  } catch (error) {
    console.log('error', error)
  }
}

const fetchTopCourses = async () => {
  const res = await axios.get('/admin/dashboard/top-courses')
  return res.data.success ? res.data.data : []
}

const fetchTopTeachers = async () => {
  // Simulating a medium API response for the chart data
  const res = await axios.get('/admin/dashboard/top-teachers')
  return res.data.success ? res.data.data : []
}

const fetchEarnings = async () => {
  const res = await axios.get('/admin/dashboard/earnings')
  return res.data.success ? res.data.data : []
}

// Define query options for each data type
export const cardQueryOptions = () =>
  queryOptions({
    queryKey: ['cards'],
    queryFn: async () => {
      try {
        const response = await fetchTopCards()
        return response
      } catch (error) {
        console.error('Error fetching cards:', error)
        return null
      }
    },
    // The following options are crucial for Suspense
    staleTime: Infinity,
    gcTime: Infinity,
  })

export const topCoursesQueryOptions = () =>
  queryOptions({
    queryKey: ['top-courses'],
    queryFn: fetchTopCourses,
    enabled: true,
    suspense: false,
  })

export const topTeachersQueryOptions = () =>
  queryOptions({
    queryKey: ['top-teachers'],
    queryFn: async () => {
      try {
        const response = await fetchTopTeachers()
        return response
      } catch (error) {
        console.error('Error fetching top teachers:', error)
        return []
      }
    },
    staleTime: 5 * 60 * 200,
  })

export const EarningsQuery = () =>
  queryOptions({
    queryKey: ['get-earnings'],
    queryFn: async () => {
      try {
        const response = await fetchEarnings()
        return response
      } catch (error) {
        console.error('Error fetching top teachers:', error)
        return null
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

function DashboardSkeleton() {
  return (
    <>
      {/* ===== Top Header ===== */}
      <div className='animate-pulse'>
        <div className='flex h-16 w-full items-center justify-between bg-gray-200 px-4'>
          <div className='h-6 w-48 rounded bg-gray-300'></div>
          <div className='flex items-center space-x-4'>
            <div className='h-8 w-8 rounded-full bg-gray-300'></div>
          </div>
        </div>
      </div>

      {/* ===== Main ===== */}
      <main className='space-y-6 px-4 py-8'>
        {/* Title */}
        <div className='h-10 w-64 animate-pulse rounded bg-gray-300'></div>

        {/* Welcome Banner */}
        <div className='h-20 w-full animate-pulse rounded-md bg-gray-200'></div>

        {/* Tabs */}
        <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
          <div className='w-full space-y-2 sm:w-48'>
            <div className='h-8 w-24 rounded bg-gray-300'></div>
            <div className='h-8 w-24 rounded bg-gray-300'></div>
            <div className='h-8 w-24 rounded bg-gray-300'></div>
          </div>
          <div className='flex-1 space-y-4'>
            {/* Overview cards */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className='h-24 animate-pulse rounded-md bg-gray-200'
                ></div>
              ))}
            </div>

            {/* Categories Overview */}
            <div className='h-48 w-full animate-pulse rounded-md bg-gray-200'></div>

            {/* Separator */}
            <div className='h-px bg-gray-300'></div>

            {/* Top Courses */}
            <div className='space-y-2'>
              <div className='h-8 w-64 rounded bg-gray-300'></div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className='h-32 animate-pulse rounded-md bg-gray-200'
                  ></div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className='h-64 animate-pulse rounded-md bg-gray-200'></div>
            <div className='h-64 animate-pulse rounded-md bg-gray-200'></div>

            {/* Dashboard Activity Section */}
            <div className='h-48 animate-pulse rounded-md bg-gray-200'></div>
          </div>
        </div>
      </main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/admin/')({
  component: () => {
    return (
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    )
  },
})
