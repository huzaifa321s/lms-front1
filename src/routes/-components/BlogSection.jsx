import React from 'react';
import { blogData } from './partenerData';
import { Link, useNavigate } from '@tanstack/react-router';
import {Button} from '@/components/ui/button'

const BlogSection = () => {
        const navigate = useNavigate()
    
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
      {blogData.slice(0, 3).map((item, index) => (
        <div
          key={index}
          className="group relative h-fit overflow-hidden bg-white  rounded-md shadow dark:shadow-gray-700 transition-all duration-500"
        >
          <div className="relative overflow-hidden">
            <img src={item.image} alt="" />
            <div className="absolute start-6 bottom-6">
              <span className="bg-violet-600 text-white text-[12px] px-2.5 py-1 rounded-md h-4">
                {item.tag}
              </span>
            </div>
          </div>

          <div className="relative p-6">
            <div>
              <div className="flex justify-between mb-4">
                <span className="text-slate-400 text-sm flex items-center">
                  <i data-feather="calendar" className="size-4 me-1"></i> {item.date}
                </span>
                <span className="text-slate-400 text-sm flex items-center">
                  <i data-feather="clock" className="size-4 me-1"></i> 5 Min
                </span>
              </div>

              <Link
                to={`blog-detail/${item.id}`}
                className="text-lg hover:text-violet-600 font-medium"
              >
                {item.title}
              </Link>

              <div className="mt-3">
                <Button
                  onClick={() => navigate({to:`/student/blogs/blog-details/sdfs`})}
                  className="btn btn-link hover:text-violet-600 after:bg-violet-600 duration-500 ease-in-out"
                >
                  Read More <i className="mdi mdi-arrow-right"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogSection;
