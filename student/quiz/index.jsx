import { createFileRoute } from '@tanstack/react-router'
import { Brain, Link } from 'lucide-react'
import { Quiz } from './-components/quiz'

export const Route = createFileRoute('/student/quiz/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex h-lvh items-center justify-center'>
      <Link
        to='/student/courses'
        className='flex items-center space-x-3 rounded-lg px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600'
      >
        <Brain className='h-5 w-5' />
        <span className='font-medium'>Quiz</span>
      </Link>
      <Quiz />
    </div>
  )
}
