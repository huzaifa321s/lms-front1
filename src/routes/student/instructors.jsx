import { createFileRoute } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'

export const users = [
  { id: 1, name: "Alex Brown", initials: "AB", title: "Senior Web Developer", image: "/instructors/alex.jpg", students: 1200, courses: 8 },
  { id: 2, name: "Sophia Lee", initials: "SL", title: "AI Specialist", image: "/instructors/sophia.jpg", students: 980, courses: 6 },
  { id: 3, name: "Michael Chen", initials: "MC", title: "UX/UI Designer", image: "/instructors/michael.jpg", students: 1500, courses: 10 },
  { id: 4, name: "Emily Davis", initials: "ED", title: "Full-Stack Engineer", image: "/instructors/emily.jpg", students: 850, courses: 5 },
  { id: 5, name: "David Wilson", initials: "DW", title: "Data Scientist", image: "/instructors/david.jpg", students: 1100, courses: 7 },
  { id: 6, name: "Olivia Martinez", initials: "OM", title: "Digital Marketing Expert", image: "/instructors/olivia.jpg", students: 720, courses: 4 },
]

export const Route = createFileRoute('/student/instructors')({
  component: InstructorsPage,
})

function InstructorsPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-blue-50">
      {/* Hero Section */}
            {/* Dev Notice Banner */}
      <div className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-center py-2 text-sm font-medium">
        🚧 This page is under development – dummy instructors are shown for now.
      </div>
      <section className="relative bg-blue-600 text-white py-20 overflow-hidden rounded-b-[3rem]">
        {/* Back Button */}
        <Button
          size="sm"
          variant="outline"
          className="absolute top-6 left-6 bg-white/20 z-20"
          onClick={() => navigate({ to: '/' })}
        >
          ← Back
        </Button>

        <div className="container mx-auto text-center relative z-10 px-6 pb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Our <span className="text-blue-200">Expert Instructors</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Learn from top industry professionals. Explore their courses, gain new skills, and start your journey today!
          </p>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="container mx-auto px-6 -mt-20 relative z-10 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
        {users.map((instructor, idx) => (
          <Card
            key={idx}
            className="bg-blue-50 border border-blue-300 rounded-3xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-500 p-6 flex flex-col items-center text-center group"
          >
            <Avatar className="h-28 w-28 mb-4 shadow-xl ring-4 ring-blue-200 group-hover:ring-blue-400 transition-all duration-500">
              {instructor.image ? <AvatarImage src={instructor.image} /> : <AvatarFallback>{instructor.initials}</AvatarFallback>}
            </Avatar>

            <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{instructor.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{instructor.title}</p>

            <div className="flex gap-4 mt-4">
              <div className="bg-white  text-black border-blue-300 px-4 py-1 rounded-2xl text-sm font-medium shadow transition-transform group-hover:scale-105">
                {instructor.students} Students
              </div>
              <div className="bg-white  text-black border-blue-300  px-4 py-1 rounded-2xl text-sm font-medium shadow transition-transform group-hover:scale-105">
                {instructor.courses} Courses
              </div>
            </div>

            <Button
              variant="default"
              size="sm"
              className="mt-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              View Profile
            </Button>

            <p className="mt-4 text-xs text-slate-500 max-w-xs">
              Join {instructor.students}+ students and start learning valuable skills from {instructor.name}.
            </p>
          </Card>
        ))}
      </section>

      {/* Call-to-Action */}
      <section className="mt-32 bg-blue-600 py-24 text-center text-white rounded-t-[3rem]">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">Want to Become an Instructor?</h3>
        <p className="max-w-2xl mx-auto mb-6 text-blue-100">
          Share your knowledge with thousands of students worldwide. Teaching on Bruce LMS gives you flexibility, exposure, and a chance to grow your career.
        </p>
        <Button
          size=""
          onClick={() =>navigate({to:'/teacher/register'})}
          className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg font-bold hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          Start Teaching Today
        </Button>
      </section>
    </div>
  )
}



