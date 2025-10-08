import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { memo } from 'react';
import { Eye } from 'lucide-react';

const DEFAULT_COURSE_IMAGE =
  "https://images.unsplash.com/photo-1516321310762-90b0e7f8b4b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&h=160&q=80";

export const CardDemo = memo(({ courseId, title, desc, category, image = DEFAULT_COURSE_IMAGE }) => {
  const navigate = useNavigate();

  const gradientTextStyle = {
    background: "linear-gradient(45deg, #2563eb, #1d4ed8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <Card
      className="flex flex-col h-[22rem] w-full md:w-72 relative 
                 bg-white rounded-xl shadow-sm border border-slate-200 
                 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
      <img
  src={image}
  alt={`${title} thumbnail`}
  width={320}
  height={160}
  className="w-full h-full object-cover rounded-t-xl transition-transform duration-700 group-hover:scale-110"
  loading="lazy"
/>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category Badge */}
        {category && (
          <Badge
            className="absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-[11px] font-medium 
                       bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md border-0"
          >
            {category}
          </Badge>
        )}
      </div>

      {/* Title */}
      <CardHeader className="p-3 pb-1">
        <h2
          className="text-base font-bold line-clamp-2 font-sans transition-colors duration-300"
          style={gradientTextStyle}
        >
          {title}
        </h2>
      </CardHeader>

      {/* Description */}
      <CardContent className="p-3 pt-0 text-xs sm:text-sm text-slate-600 flex-grow line-clamp-3">
        {desc}
      </CardContent>

      {/* Footer Button */}
      <CardFooter className="p-3 pt-0">
       <Button
  size="sm"
  className="relative w-full rounded-lg overflow-hidden 
             bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-2
             shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
  onClick={() => navigate({ to: `/student/enrolledcourses/${courseId}` })}
  aria-label={`View details for ${title} course`}
>
  <span className="relative z-10 flex items-center justify-center gap-2">
    <Eye className="w-4 h-4" />
    View Course
  </span>
</Button>

      </CardFooter>
    </Card>
  );
});
