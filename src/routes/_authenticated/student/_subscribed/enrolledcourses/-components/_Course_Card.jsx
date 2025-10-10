import { memo } from 'react'
import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import {
  Eye,
  BookOpen,
  Info,
  Tag,
  FileText,
  User,
  CalendarDays,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
const DEFAULT_COURSE_IMAGE =
  'https://images.unsplash.com/photo-1516321310762-90b0e7f8b4b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&h=160&q=80'

export  const CardDemo = memo(({
  image,
  title,
  desc,
  category,
  material,
  instructor,
  enrollmentDate,
  courseId,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="group relative flex h-[24rem] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl md:w-72">
      {/* Image Section */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={title}
          width={320}
          height={160}
          className="h-full w-full object-cover rounded-t-2xl transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Category Badge */}
        {category && (
          <Badge className="absolute top-2 left-2 flex items-center gap-1 rounded-full border-0 bg-gradient-to-r from-blue-600 to-blue-700 px-2.5 py-0.5 text-[11px] font-medium text-white shadow-md">
            <Tag className="h-3 w-3" />
            {category}
          </Badge>
        )}
      </div>

      {/* Title */}
      <CardHeader className="p-4 pb-1">
        <h2 className="flex items-center gap-2 line-clamp-2 font-sans text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
          <BookOpen className="h-4 w-4 text-blue-600" />
          {title}
        </h2>
      </CardHeader>

      {/* Footer with Actions */}
      <CardFooter className="flex items-center justify-between p-4 mt-auto">
        <Button
          size="sm"
          onClick={() => navigate({ to: `/student/enrolledcourses/${courseId}` })}
          aria-label={`View details for ${title} course`}
          className="relative w-[48%] overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transition-all duration-500 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>

        {/* Popover for Details */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="w-[48%] border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Info className="h-4 w-4 mr-1" />
              Details
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="center"
            className="w-64 text-sm space-y-2"
          >
            <p className="text-slate-700 line-clamp-3">{desc}</p>
            <div className="border-t border-slate-200 pt-2 space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>
                  <strong>{material || 0}</strong> materials
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <User className="h-4 w-4 text-blue-500" />
                <span>
                  {instructor?.firstName
                    ? `${instructor.firstName} ${instructor.lastName || ""}`
                    : "Unknown Instructor"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CalendarDays className="h-4 w-4 text-blue-500" />
                <span>Enrolled on {format(enrollmentDate, "PPP")}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
})
