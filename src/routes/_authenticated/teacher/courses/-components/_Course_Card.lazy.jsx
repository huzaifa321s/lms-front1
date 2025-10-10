import { useSearch } from '@tanstack/react-router';
import { Eye, Edit as EditIcon, Trash2, ArrowRight, MoreVertical } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { openModalTeacher } from '../../../../../shared/config/reducers/teacher/teacherDialogSlice';
import { useAppUtils } from '../../../../../hooks/useAppUtils';
import { format } from 'date-fns';
import { memo, useEffect } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
      className={`relative w-full bg-white/95 backdrop-blur-sm border-0 rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] overflow-hidden h-[460px] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02] ${
        (fetchStatus === "fetching" || isFetching) &&
        "animate-pulse bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]"
      }`}
    >
      {/* Decorative Background */}
      <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full opacity-30 blur-lg"></div>

      {/* Course Image */}
      <div className="relative overflow-hidden rounded-t-[8px]">
        <img
          src={`${courseImg}${image}`}
          alt={name}
          className="w-full h-40 sm:h-48 object-cover"
          fetchpriority={index === 0 ? "high" : "auto"}
          loading={index === 0 ? "eager" : "lazy"}
        />

        {(fetchStatus === "fetching" || isFetching) && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 animate-pulse"></div>
        )}

        {/* Popover Button (⋮ icon) */}
        <div className="absolute top-2 right-2 z-10">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-gray-100"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-[8px] shadow-lg">
              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-gray-700 hover:text-[#2563eb]"
                  onClick={() =>
                    navigate({
                      to: `/teacher/courses/course_details/${courseId}`,
                      state: { page },
                    })
                  }
                >
                  <Eye className="w-4 h-4 mr-2" /> View Details
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-gray-700 hover:text-[#2563eb]"
                  onClick={() =>
                    navigate({ to: `/teacher/courses/edit_course/${courseId}` })
                  }
                >
                  <EditIcon className="w-4 h-4 mr-2" /> Edit Course
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-red-600 hover:text-red-700"
                  onClick={() =>
                    dispatch?.(
                      openModalTeacher({
                        type: "delete-course-modal",
                        props: {
                          searchParams,
                          courseId,
                          courseDetails: { name, desc },
                          query,
                          page,
                          index,
                        },
                      })
                    )
                  }
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 flex flex-col justify-between px-5 py-4">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-[#1e293b] font-bold text-lg sm:text-xl line-clamp-2">
            {name}
          </CardTitle>
        </CardHeader>

        {/* Description */}
        <CardContent className="p-0 mb-3">
          <div className="text-[#64748b] text-sm leading-relaxed h-[60px] sm:h-[70px] overflow-hidden relative">
            <p className="line-clamp-3">{desc || "No description available."}</p>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent"></div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-0 flex flex-col gap-3 mt-auto">
          {/* Students Enrolled */}
          <Tooltip>
            <div
              onClick={() =>
                navigate({
                  to: `/teacher/courses/course_students/${courseId}`,
                  search: { q: "" },
                })
              }
            >
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex justify-between w-full"
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
                <p>View Enrolled Students</p>
              </TooltipContent>
            </div>
          </Tooltip>

          {/* Last Updated */}
          <div className="w-full pt-2 border-t border-[#e2e8f0]">
            <p className="text-xs text-[#64748b] font-medium flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-[#2563eb] rounded-full"></span>
              Updated: {format(dateUpdated, "PPP")}
            </p>
          </div>
        </CardFooter>
      </div>
    </Card>
</div>

  );
})
