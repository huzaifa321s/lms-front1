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

export function CardDemo({ courseId, title, desc, category }) {
  const navigate = useNavigate();

  // Gradient text effect → Primary Blue
  const gradientTextStyle = {
    background: 'linear-gradient(45deg, #2563eb, #1d4ed8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <Card
      className="flex flex-col h-[28rem] w-full md:w-80 relative p-0 
                 bg-[#ffffff] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] 
                 border border-[#e2e8f0] 
                 transition-transform duration-300 ease-in-out 
                 hover:scale-[1.02] hover:border-[#cbd5e1] hover:shadow-lg overflow-hidden"
    >
      <div className="relative flex-shrink-0">
        <img
          src={courseImg}
          alt="Course Thumbnail"
          className="w-full object-cover rounded-t-[12px] h-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

        {/* Category badge */}
        {category && (
          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-md rounded-[8px] border-0">
            {category}
          </Badge>
        )}
      </div>

      <CardHeader className="p-4">
        <CardTitle
          className="mb-2 text-xl font-bold line-clamp-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif] text-[#1e293b]"
          style={gradientTextStyle}
        >
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 text-sm text-[#64748b] font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif] flex-grow line-clamp-4">
        {desc}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          size="sm"
          className="group relative inline-flex h-9 items-center justify-center 
                     overflow-hidden rounded-[8px] 
                     bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] 
                     px-4 py-2 font-medium text-white shadow-md 
                     transition duration-300 ease-out hover:scale-105 hover:shadow-lg w-full font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
          onClick={() => navigate({ to: `/student/enrolledcourses/${courseId}` })}
        >
          <span className="relative z-10">View Course</span>
        </Button>
      </CardFooter>
    </Card>
  );
}