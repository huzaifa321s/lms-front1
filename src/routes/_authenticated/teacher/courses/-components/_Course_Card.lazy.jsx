import { useSearch } from '@tanstack/react-router';
import { ArrowRight, EditIcon, Eye, Trash2} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { openModalTeacher } from '../../../../../shared/config/reducers/teacher/teacherDialogSlice';
import { useAppUtils } from '../../../../../hooks/useAppUtils';
import { format } from 'date-fns';
import { memo, useEffect } from 'react';

const courseImg = `${import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL}public/courses/cover-images/`;

export const CardDemo = memo(({
  courseId,
  name,
  desc,
  query,
  page,
  index,
  studentsEnrolled,
  fetchStatus,
  isFetching,
  dateUpdated,
  image
}) => {




  const { navigate, dispatch } = useAppUtils();
  const searchParams = useSearch({ from: '/_authenticated/teacher/courses/' });
console.log("courseImg ===>",courseImg)
  return (
  <div className="relative group w-full max-w-sm mx-auto">
  <Card
    className={`relative w-full pt-0 bg-white/95 backdrop-blur-sm border-0 rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] overflow-hidden h-[450px] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02] ${
      (fetchStatus === 'fetching' || isFetching) &&
      'animate-pulse bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]'
    }`}
  >
    {/* Decorative Backgrounds */}
    <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full opacity-30 blur-lg"></div>
    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full opacity-25 blur-xl"></div>

    {/* Course Image */}
    <div className="relative overflow-hidden rounded-t-[8px]">
      <img
        src={`${courseImg}${image}`}
        srcSet={`
          ${courseImg}${image}?w=200 200w,
          ${courseImg}${image}?w=400 400w,
          ${courseImg}${image}?w=800 800w
        `}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33.33vw, 25vw"
        alt={name}
        className="w-full h-40 sm:h-48 object-cover"
        fetchpriority={index === 0 ? 'high' : 'auto'}
        decoding="async"
        loading={index === 0 ? 'eager' : 'lazy'}
        width="400"
        height="192"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2563eb]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {(fetchStatus === 'fetching' || isFetching) && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 animate-pulse"></div>
      )}
    </div>

    {/* Card Body */}
    <div className="flex-1 flex flex-col justify-between px-5 py-4">
      {/* Header */}
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-[#1e293b] font-bold text-lg sm:text-xl line-clamp-2">
          {name}
        </CardTitle>
      </CardHeader>

      {/* Description */}
      <CardContent className="p-0 mb-3">
        <p className="text-[#64748b] text-sm leading-relaxed line-clamp-3">
          {desc}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-0 flex flex-col gap-3 mt-auto">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 w-full">
          <Button
            size="sm"
            variant="default"
            onClick={() =>
              navigate({
                to: `/teacher/courses/course_details/${courseId}`,
                state: { page },
              })
            }
            className="flex-1 min-w-[70px] justify-center rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-medium shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02]"
          >
            <Eye size={14} className="mr-1" /> View
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate({ to: `/teacher/courses/edit_course/${courseId}` })
            }
            className="flex-1 min-w-[70px] justify-center rounded-[8px] border-[#e2e8f0] text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] transition-all duration-300"
          >
            <EditIcon size={14} className="mr-1" /> Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              dispatch?.(
                openModalTeacher({
                  type: 'delete-course-modal',
                  props: { searchParams, courseId, courseDetails: { name, desc }, query, page, index },
                })
              )
            }
            className="flex-1 min-w-[70px] justify-center rounded-[8px] bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white font-medium shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02]"
          >
            <Trash2 size={14} className="mr-1" /> Delete
          </Button>
        </div>

        {/* Students Enrolled */}
        <Tooltip>
          <div
            onClick={() =>
              navigate({
                to: `/teacher/courses/course_students/${courseId}`,
                search: { q: '' },
              })
            }
          >
            <TooltipTrigger asChild>
              <Button
                className="w-full rounded-[8px] bg-white/95 backdrop-blur-sm text-[#2563eb] border-2 border-[#e2e8f0] hover:bg-[#2563eb]/10 hover:border-[#2563eb] font-medium transition-all duration-300 flex items-center justify-between"
                variant="outline"
                size="sm"
              >
                <span className="flex items-center gap-1">
                  Students Enrolled <ArrowRight size={14} />
                </span>
                <Badge
                  variant="default"
                  className="ml-auto bg-[#2563eb]/20 text-[#2563eb] hover:bg-[#2563eb]/30"
                >
                  {studentsEnrolled}
                </Badge>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white/95 backdrop-blur-sm text-[#1e293b] border-[#e2e8f0] rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
              <p>Students Enrolled</p>
              <p className="text-xs text-gray-500">Click to view details</p>
            </TooltipContent>
          </div>
        </Tooltip>

        {/* Last Updated */}
        <div className="w-full pt-2 border-t border-[#e2e8f0]">
          <p className="text-xs text-[#64748b] font-medium flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-[#2563eb] rounded-full"></span>
            Updated: {format(dateUpdated, 'PPP')}
          </p>
        </div>
      </CardFooter>
    </div>
  </Card>
</div>

  );
})
