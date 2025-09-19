import { createFileRoute } from '@tanstack/react-router'
import {Quiz} from './-components/quiz'
import { Brain, Link } from 'lucide-react'

export const Route = createFileRoute('/student/quiz/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
     <div className='flex justify-center items-center h-lvh'>
         <Link
              to="/student/courses"    
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              
                >
                  <Brain className="w-5 h-5" />
                  <span className="font-medium">Quiz</span>
                </Link>
        <Quiz/>
    </div>
    
  )
}
