import { Suspense, useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import { QueryClient, queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { IconChalkboardTeacher } from '@tabler/icons-react';
import { BookOpen, Users, Star } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { handleCourseEnrollment } from '../../../shared/config/reducers/student/studentAuthSlice';
import { Show } from '../../../shared/utils/Show';
import { checkSubscriptionStatus, isActiveSubscription } from '../../../shared/utils/helperFunction';
import { getDebounceInput, getRenderPaginationButtons, useSearchInput } from '../../../utils/globalFunctions';
import { SmallLoader } from '../../_authenticated/teacher/-layout/data/components/teacher-authenticated-layout';
const queryClient = new QueryClient()



// Constants
const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1516321310762-479e93c1e69e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
const BASE_STORAGE_URL = import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL;
const MESSAGES = {
  noCourses: 'No courses found!',
  noCoursesDesc: 'Try adjusting your search criteria or explore our featured categories.',
  subscriptionExpired: 'Your subscription has expired!',
  noSubscription: 'You need an active subscription to enroll in courses!',
  enrollmentLimit: 'You have exceeded the course enrollment limit!',
  enrolledSuccess: 'Course enrolled successfully!',
};

// Query options for fetching courses
const coursesQueryOptions = ({ q, page, userID }) =>
  queryOptions({
    queryKey: ['courses', q, page],
    queryFn: async () => {
      let queryStr = `page=${page}`;
      if (q) queryStr += `&q=${q}`;
      if (userID) queryStr += `&userID=${userID}`;

      const response = await axios.get(`/web/course/get?${queryStr}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch courses');
    },
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const Route = createFileRoute('/student/courses/')({
  validateSearch: (search) => ({
    q: search.q || '',
    page: Number(search.page ?? 1),
    userID: search.userID || '',
  }),
  loaderDeps: ({ search }) => ({ q: search.q, page: search.page, userID: search.userID }),
  loader: ({ deps }) => queryClient.prefetchQuery(coursesQueryOptions(deps)),
  component: () => (
    <Suspense fallback={<CourseListSkeleton />}>
      <RouteComponent />
    </Suspense>
  ),
});

const CourseListSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
        <div className="h-4 w-96 mt-2 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-4 animate-pulse">
            <div className="h-44 w-full bg-slate-200 rounded-t-xl"></div>
            <div className="mt-4 space-y-2">
              <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
              <div className="h-4 w-full bg-slate-200 rounded"></div>
              <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MiniStats = ({ students = 1250, rating = 4.8, instructor }) => (
  <div className="mt-2 flex justify-between text-xs text-slate-600">
    <div className="flex items-center gap-1">
      <Users className="h-3 w-3" />
      <span>{students}</span>
    </div>
    <div className="flex items-center gap-1">
      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      <span>{rating}</span>
    </div>
    <div className="flex items-center gap-1">
      <IconChalkboardTeacher className="h-3 w-3" />
      <span>{instructor?.firstName} {instructor?.lastName}</span>
    </div>
  </div>
);

function RouteComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { q, page: currentPage, userID } = useSearch({ from: '/student/courses/' });
  const [searchInput, setSearchInput] = useSearchInput('/student/courses/');
  const credentials = useSelector((state) => state.studentAuth.credentials);
  const subscription = useSelector((state) => state.studentAuth.subscription);
  const isLoggedIn = useSelector((state) => !!state.studentAuth.token);
  const [selectedEnrolledCourseID, setSelectedEnrolledCourseID] = useState('');

  const debouncedSearch = getDebounceInput(searchInput, 800);
  const { data, isLoading } = useQuery(coursesQueryOptions({
    q: debouncedSearch,
    page: currentPage,
    userID: credentials?._id,
  }));
console.log('isLoading ===>',isLoading)
  const { courses = [], totalPages = 1, enrolledCourses = [] } = data || {};

  // Unified navigation handler
  const handleNavigation = useCallback(
    ({ page = currentPage, query = searchInput } = {}) => {
      navigate({
        to: '/student/courses',
        search: { page, q: query || undefined },
      });
    },
    [navigate, currentPage, searchInput],
  );

  // Enrollment mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (courseId) => {
      if (subscription && !isActiveSubscription(subscription)) {
        const status = checkSubscriptionStatus(subscription);
        if (status === 'past_due') {
          toast.error(MESSAGES.subscriptionExpired);
          navigate('/student/pay-invoice');
          throw new Error('Subscription expired');
        }
        toast.error(MESSAGES.noSubscription);
        navigate({ to: '/student/resubscription-plans' });
        throw new Error('No active subscription');
      }
      if (credentials?.remainingEnrollmentCount === 0) {
        toast.error(MESSAGES.enrollmentLimit);
        throw new Error('Enrollment limit exceeded');
      }

      const response = await axios.post('/student/course/enroll', { courseId });
      if (response.data.success) {
        const { remainingEnrollmentCount } = response.data.data;
        dispatch(handleCourseEnrollment({ id: courseId, remainingEnrollmentCount }));
        toast.success(MESSAGES.enrolledSuccess);
        return response.data;
      }
      throw new Error(response.data.message || 'Enrollment failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(coursesQueryOptions({
        q: debouncedSearch,
        page: currentPage,
        userID: credentials?._id,
      }));
      setSelectedEnrolledCourseID('');
    },
    onError: (error) => {
      if (!error.message.includes('expired') && !error.message.includes('subscription')) {
        console.log('error',error)
        toast.error(error.message || 'Failed to enroll in course');
      }
    },
  });

  const handleEnrollCourse = useCallback(
    (courseId) => {
      setSelectedEnrolledCourseID(courseId);
      mutate(courseId);
    },
    [mutate],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-6 font-sans">
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-slate-600">
              <span>Home</span>
              <svg className="h-4 w-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-slate-800">Courses</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Available Courses
            </h1>
            <p className="text-lg text-slate-600">Explore courses tailored for your learning journey</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNavigation()}
                placeholder="Search courses..."
                className="w-full rounded-lg border-slate-200 bg-white py-2.5 pl-10 pr-10 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                aria-label="Search courses"
              />
              <button
                onClick={() => handleNavigation()}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-600 transition-all duration-200"
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    handleNavigation({ query: '' });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-all duration-200"
                  aria-label="Clear search"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <Button
              variant="outline"
              className="rounded-lg border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
              aria-label="Filter courses"
            >
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        <Show>
          <Show.When isTrue={courses.length > 0 && !isLoading}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => {
                const coverImageUrl =  course.coverImage
                      ? `${BASE_STORAGE_URL}/courses/cover-images/${course.coverImage}`
                      : DEFAULT_COVER_IMAGE
                
                
                const isEnrolled = isLoggedIn && enrolledCourses?.includes(course._id);

                return (
                  <Card
                    key={course._id}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    role="article"
                    aria-label={`Course: ${course.name}`}
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={coverImageUrl}
                        alt={course.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        {course.category?.name || 'N/A'}
                      </div>
                      {isEnrolled && (
                        <div className="absolute top-3 right-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                          <svg className="h-3 w-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Enrolled
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {course.name}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
                      <MiniStats
                        students={course.enrolledStudents}
                        rating={course.rating}
                        instructor={course.instructor}
                      />
                      <div className="space-y-2">
                        {isLoggedIn && !isEnrolled && (
                          <Button
                            disabled={isPending && selectedEnrolledCourseID === course._id}
                            onClick={() => handleEnrollCourse(course._id)}
                            className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2.5 shadow-sm hover:shadow-md transition-all duration-300"
                            aria-label={`Enroll in ${course.name}`}
                          >
                            {isPending && selectedEnrolledCourseID === course._id ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Enrolling...
                              </div>
                            ) : (
                              <>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Enroll Now
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          disabled={isPending && selectedEnrolledCourseID === course._id}
                          onClick={() => navigate({ to: `/student/courses/${course._id}` })}
                          className="w-full rounded-lg border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                          aria-label={`View details of ${course.name}`}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Show.When>
          <Show.Else>
            {isLoading  ?  <SmallLoader/> : <div className="py-16 text-center">
              <div className="mx-auto w-fit rounded-full bg-slate-100 p-6 shadow-inner">
                <BookOpen className="h-16 w-16 text-slate-300" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-800">{MESSAGES.noCourses}</h3>
              <p className="mt-2 text-lg text-slate-600 max-w-md mx-auto">{MESSAGES.noCoursesDesc}</p>
             
            </div>}
            
          </Show.Else>
        </Show>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-md border border-slate-200">
              {currentPage > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleNavigation({ page: currentPage - 1 })}
                  className="h-10 w-10 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                  aria-label="Previous page"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </Button>
              )}
              {getRenderPaginationButtons(currentPage, totalPages, (page) => handleNavigation({ page }))}
              {currentPage < totalPages && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleNavigation({ page: currentPage + 1 })}
                  className="h-10 w-10 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                  aria-label="Next page"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RouteComponent;