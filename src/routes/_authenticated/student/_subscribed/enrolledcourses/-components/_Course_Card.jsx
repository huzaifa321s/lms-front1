import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import courseImg from '../../../../../../../public/images/shadcn-admin.png';
import { Badge } from '@/components/ui/badge';
import { memo } from 'react';
const DEFAULT_COURSE_IMAGE = "https://images.unsplash.com/photo-1516321310762-90b0e7f8b4b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&h=160&q=80";export const CardDemo = memo(({ courseId, title, desc, category, image = DEFAULT_COURSE_IMAGE }) => {
  const navigate = useNavigate();

  // Define gradient style as a constant to avoid recreation on each render
  const gradientTextStyle = {
    background: "linear-gradient(45deg, #2563eb, #1d4ed8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <Card
      className="flex flex-col h-[28rem] w-full md:w-80 relative p-0 
                 bg-white rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] 
                 border border-slate-200 
                 transition-transform duration-300 ease-in-out 
                 hover:scale-[1.02] hover:border-slate-300 hover:shadow-lg 
                 overflow-hidden"
    >
      <div className="relative flex-shrink-0">
        <img
          src={image}
          alt={`${title} thumbnail`}
          className="w-full h-40 object-cover rounded-t-[12px]"
          loading="lazy" // Lazy load images for performance
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category badge */}
        {category && (
          <Badge
            className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-blue-700 
                       text-white shadow-md rounded-[8px] border-0"
          >
            {category}
          </Badge>
        )}
      </div>

      <CardHeader className="p-4">
        <h2
          className="mb-2 text-xl font-bold line-clamp-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif] 
                     text-slate-900"
          style={gradientTextStyle}
        >
          {title}
        </h2>
      </CardHeader>

      <CardContent
        className="p-4 pt-0 text-sm text-slate-600 
                   font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif] flex-grow line-clamp-4"
      >
        {desc}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          size="sm"
          className="group relative inline-flex h-9 items-center justify-center 
                     overflow-hidden rounded-[8px] 
                     bg-gradient-to-r from-blue-600 to-blue-700 
                     px-4 py-2 font-medium text-white shadow-md 
                     transition duration-300 ease-out hover:scale-105 hover:shadow-lg w-full 
                     font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
          onClick={() => navigate({ to: `/student/enrolledcourses/${courseId}` })}
          aria-label={`View details for ${title} course`}
        >
          <span className="relative z-10">View Course</span>
        </Button>
      </CardFooter>
    </Card>
  );
});