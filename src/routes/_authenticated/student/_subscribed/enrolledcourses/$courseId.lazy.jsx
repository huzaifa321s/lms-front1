import { memo, useEffect, useMemo } from 'react';
import axios from 'axios';
import { QueryClient, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useParams, createLazyFileRoute } from '@tanstack/react-router';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';


// Initialize QueryClient
const queryClient = new QueryClient();

// Course query options
const courseQueryOptions = (params) =>
  queryOptions({
    queryKey: ['course', params.courseId],
    queryFn: async () => {
      try {
        const response = await axios.get(`/student/course/get-enrolled-course/${params.courseId}`);
        if (response.data.success) {
          return { details: response.data.data };
        }
        return { details: null };
      } catch (error) {
        console.error('Error fetching course:', error.response?.data?.message || error.message);
        return { details: null };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

// Route definition
export const Route = createLazyFileRoute(
  '/_authenticated/student/_subscribed/enrolledcourses/$courseId'
)({
  loader: ({ params }) => queryClient.ensureQueryData(courseQueryOptions(params)),
  component: memo(RouteComponent), // Memoize component to prevent unnecessary re-renders
});

// Memoized styles to avoid recreation on renders
const gradientTextStyle = {
  background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

function RouteComponent() {
  const { courseId } = useParams({
    from: '/_authenticated/student/_subscribed/enrolledcourses/$courseId',
  });
  const { data, error } = useSuspenseQuery(courseQueryOptions({ courseId }));
  const details = data?.details;

  // Default course image
  const DEFAULT_COURSE_IMAGE = 'https://images.unsplash.com/photo-1516321310762-90b0e7f8b4b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&h=160&q=80';

  // Compute cover image using useMemo for performance
  const coverImage = useMemo(() => {
    const baseUrl = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}public`;
    console.log('details.coverImage',details.coverImage)
    console.log("sss",details?.coverImage
    ? `${baseUrl}/courses/cover-images/${details.coverImage}`
    : DEFAULT_COURSE_IMAGE)
    return details?.coverImage
      ? `${baseUrl}/courses/cover-images/${details.coverImage}`
      : DEFAULT_COURSE_IMAGE;
  }, [details?.coverImage]);

  // Base material URL
  const baseMaterialUrl = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}public/courses/material/`;

  console.log('baseMateiralURL ===>',baseMaterialUrl)

  // Handle error state
  if (error || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
        <p className="text-lg text-red-500">Failed to load course details.</p>
          <Button
            size="sm"
            onClick={() => window.history.back()}
            variant="outline"
            className="mt-4 border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header>
        <h1
          className="w-full text-2xl font-extrabold tracking-tight md:text-3xl"
          style={gradientTextStyle}
        >
          Course Details
        </h1>
        <div className="my-2 flex w-full items-center justify-between">
          <Button
            size="sm"
            onClick={() => window.history.back()}
            variant="outline"
            className="ml-auto flex items-center gap-2 border-slate-200 bg-slate-100 font-medium text-slate-600 shadow-lg hover:border-slate-300 hover:bg-slate-200 hover:shadow-xl rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
            Back
          </Button>
        </div>
      </Header>

      {/* Course Card */}
      <div className="mx-4 mt-4">
        <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          {/* Glow effect */}
          <div className="pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-amber-500/10 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />

          {/* Course Cover Image */}
          <div className="relative">
            <div className="absolute inset-0 z-10 rounded-t-xl bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            <img
              src={coverImage}
              alt={`${details.name} cover`}
              className="h-80 w-full rounded-t-xl object-cover object-center sm:h-96"
              loading="lazy"
            />
            <Badge className="absolute right-4 bottom-4 z-20 rounded-full border-0 bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1.5 font-semibold text-white shadow-lg">
              {details.category?.name || 'Uncategorized'}
            </Badge>
          </div>

          {/* Course Content */}
          <div className="relative p-6 sm:p-8">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <h1
                    className="mb-4 text-3xl font-bold leading-tight lg:text-4xl"
                    style={gradientTextStyle}
                  >
                    {details.name || 'Unnamed Course'}
                  </h1>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-500 p-2">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Instructor</p>
                      <p className="font-semibold text-slate-900">
                        {details.instructor?.firstName || ''} {details.instructor?.lastName || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
                <p className="text-lg leading-relaxed text-slate-600">
                  {details.description || 'No description available.'}
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className="my-8 flex items-center justify-center">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              <div className="px-4">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            </div>

            {/* Course Materials */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-500 p-2 shadow-sm">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h2
                  className="text-2xl font-bold"
                  style={gradientTextStyle}
                >
                  Course Materials
                </h2>
              </div>

              <div className="space-y-4">
                {details.material && details.material.length > 0 ? (
                  details.material.map((material, index) => (
                    <div key={material._id || `material-${index}`} className="group/item">
                      <Accordion
                        type="single"
                        collapsible
                        className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200"
                      >
                        <AccordionItem value={`item-${index}`} className="border-none">
                          <AccordionTrigger
                            className="px-6 py-4 text-left font-semibold text-slate-900 hover:bg-slate-50 hover:text-blue-600"
                            aria-label={`Toggle ${material.title} details`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-emerald-500 transition-transform duration-200 group-hover/item:scale-125" />
                              {material.title || 'Untitled Material'}
                            </div>
                          </AccordionTrigger>
                         <AccordionContent className="space-y-4 px-6 pb-6">
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <div className="space-y-3">
      <div>
        <span className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
          Description:
        </span>
        <p className="mt-1 leading-relaxed text-slate-600">
          {material.description || 'No description provided.'}
        </p>
      </div>

    {material.media.endsWith('.pdf') && (
  <iframe
    src={`${baseMaterialUrl}${material.media}`}
    className="w-full h-[70vh] rounded-lg border bg-slate-50"
  />
)}

{material.media.match(/\.(png|jpg|jpeg|gif)$/) && (
  <div className="flex items-center justify-center bg-slate-100 h-[70vh] rounded-lg border">
    <img
      src={`${baseMaterialUrl}${material.media}`}
      alt="Preview"
      className="max-h-full max-w-full object-contain"
    />
  </div>
)}

{material.media.match(/\.(mp4|webm)$/) && (
  <video
    controls
    src={`${baseMaterialUrl}${material.media}`}
    className="w-full h-[70vh] rounded-lg border bg-black"
  />
)}



    </div>
  </div>
</AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <p className="text-lg text-slate-600">No course materials available yet.</p>
                    <p className="mt-1 text-sm text-slate-400">Check back later for updates!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

RouteComponent.displayName = 'CourseDetails';