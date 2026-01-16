import { lazy, Suspense } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronRight, GraduationCap, Monitor, Plus } from 'lucide-react'
import CountUp from 'react-countup'
import { Button } from '@/components/ui/button'
import { NavbarRouteComponent } from './-NavbarRouteComponent'
import { Footer } from './student/Footer'

// --- Assets ---
import hero from '/images/1.png'
import hero2 from '/images/2.png'
import bg from '/images/bg.png'
import team1 from '/images/team/1.jpg'
import team2 from '/images/team/2.jpg'
import team3 from '/images/team/3.jpg'
import team4 from '/images/team/4.jpg'
import team5 from '/images/team/5.jpg'

// --- Lazy Components ---
const TeamSection = lazy(() => import('./-components/Team'))
const Partners = lazy(() => import('./-components/partener'))
const AboutSection = lazy(() => import('./-components/AboutSection'))
const Feature = lazy(() => import('./-components/AppFeature'))
const BlogGrid = lazy(() => import('./-components/GridBlog'))
const CourseGrid = lazy(() => import('./-components/GridCourse'))

// --- Skeletons ---
const CourseGridSkeleton = ({ grid }: { grid: string }) => {
  return (
    <div className={grid}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2 p-4 border rounded-xl shadow-sm bg-white">
          <div className="h-40 w-full rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-slate-200 animate-pulse" />
          <div className="h-3 w-1/4 rounded bg-slate-200 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

const SectionSkeleton = () => (
  <div className="w-full animate-pulse bg-gray-100 rounded-xl h-40 sm:h-52 md:h-64" />
)

// --- Constants ---
const TEAM_IMAGES = [team1, team2, team3, team4, team5]

// --- Component ---
function LandingPage() {
  const navigate = useNavigate()

  return (
    <>
      <NavbarRouteComponent />

      {/* Hero Section */}
      <section
        id="home"
        className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 px-4 sm:px-6 md:px-10 py-24 md:py-36 md:min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="relative container px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            {/* Left Content */}
            <div>
              <h1 className="mb-6 text-3xl sm:text-4xl leading-snug font-semibold tracking-wide text-slate-900 lg:text-5xl lg:leading-tight">
                Best{' '}
                <span className="relative inline-block before:absolute before:-inset-2 before:block before:-skew-y-6 before:bg-gradient-to-tr before:from-blue-600 before:to-blue-800">
                  <span className="relative font-bold text-white">Online</span>
                </span>{' '}
                Courses <br /> From{' '}
                <span className="font-bold text-blue-700">Bruce LMS</span>
              </h1>

              <p className="max-w-xl text-lg text-slate-600">
                Discover a world of knowledge and opportunities with our online
                education platform. Pursue a new career with flexible learning.
              </p>

              <div className="my-5 flex flex-wrap gap-4">
                <Button
                  onClick={() => navigate({ to: '/student/courses' })}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all"
                >
                  Browse Courses
                </Button>

                <Button
                  onClick={() => navigate({ to: '/teacher/register' })}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <GraduationCap className="mr-2 h-4 w-4" /> Become Instructor
                </Button>

                <Button
                  onClick={() => navigate({ to: '/student/instructors' })}
                  variant="ghost"
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <GraduationCap className="mr-2 h-4 w-4" /> View Our Instructors
                </Button>
              </div>
            </div>

            {/* Right Content */}
            <div className="relative lg:ms-8">
              <img
                src={hero}
                className="relative z-10 mx-auto w-full max-w-[380px] sm:max-w-[440px] md:max-w-[500px] h-auto"
                alt="hero"
                fetchPriority="high"
                width={500}
                height={500}
              />

              {/* Instructor Avatars */}
              <div className="hidden md:block absolute bottom-12 -left-2 z-20 w-56 rounded-xl bg-white/70 p-4 shadow-lg backdrop-blur-md md:bottom-16 md:-left-10 animate-bounce-slow">
                <h5 className="mb-3 text-lg font-semibold text-slate-800">
                  Our Instructors
                </h5>
                <ul className="flex">
                  {TEAM_IMAGES.map((item, index) => (
                    <li
                      key={index}
                      className="-ml-3 inline-block transition first:ml-0 hover:scale-105"
                    >
                      <img
                        src={item}
                        alt="team member"
                        className="size-10 rounded-full border-2 border-white shadow-md object-cover"
                        loading="lazy"
                      />
                    </li>
                  ))}
                  <li className="-ml-3 inline-block">
                    <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-sm text-white transition hover:scale-105 shadow-md">
                      <Plus className="h-4 w-4" />
                    </span>
                  </li>
                </ul>
              </div>

              {/* Course Stats */}
              <div className="hidden md:block absolute top-28 -right-5 z-20 w-52 rounded-xl bg-white/70 p-4 shadow-lg backdrop-blur-md md:top-36 md:-right-10 animate-bounce-slow delay-100">
                <div className="flex items-center">
                  <div className="me-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Monitor className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">
                      Online Courses
                    </span>
                    <p className="text-xl font-bold text-slate-900">
                      <CountUp
                        end={100}
                        className="inline-block"
                        duration={3}
                      />
                      +
                    </p>
                  </div>
                </div>
              </div>

              {/* Gradient Circle Decoration */}
              <div className="hidden md:block absolute bottom-1/2 left-1/2 -z-10 size-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tl from-blue-600 to-blue-800 opacity-70 blur-3xl md:left-0 md:size-[500px] md:translate-x-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="pt-6">
        <div className="container px-4 sm:px-6 md:px-8">
          <Suspense fallback={<SectionSkeleton />}>
            <Partners />
          </Suspense>
        </div>
      </section>

      <section className="relative flex flex-col items-center py-16 md:py-24">
        {/* About Section */}
        <div className="relative container px-4 sm:px-6 md:px-8">
          <Suspense fallback={<SectionSkeleton />}>
            <AboutSection />
          </Suspense>
        </div>

        {/* Features Section */}
        <div className="relative container mt-16 md:mt-24 px-4 sm:px-6 md:px-8 py-10">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h4 className="mb-6 text-2xl leading-normal font-semibold md:text-3xl md:leading-normal">
              Discover Powerful Features
            </h4>
            <p className="mx-auto max-w-xl text-slate-400">
              Discover a world of knowledge and opportunities with our online
              education platform pursue a new career.
            </p>
          </div>
          <Suspense fallback={<SectionSkeleton />}>
            <Feature />
          </Suspense>
        </div>

        {/* Courses Section */}
        <div className="relative container mt-16 md:mt-24 px-4 sm:px-6 md:px-8 py-10">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h4 className="mb-6 text-2xl leading-normal font-semibold md:text-3xl md:leading-normal">
              Explore Our Best Courses
            </h4>
            <p className="mx-auto max-w-xl text-slate-400">
              Discover a world of knowledge and opportunities with our online
              education platform pursue a new career.
            </p>
          </div>
          <Suspense
            fallback={
              <CourseGridSkeleton grid="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6" />
            }
          >
            <CourseGrid grid="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6" />
          </Suspense>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12">
            <div className="text-center md:col-span-12">
              <Link
                to="/student/courses"
                className="text-slate-400 duration-500 ease-in-out inline-flex items-center hover:text-violet-600"
              >
                See More Courses <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="relative mt-16 w-full overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 md:mt-24">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-cover bg-top bg-no-repeat px-6 py-16 pt-12 md:px-12 md:py-24 md:pt-0 lg:px-20 lg:py-28"
            style={{ backgroundImage: `url(${bg})` }}
          >
            <div className="relative container mx-auto">
              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
                <div className="text-center md:col-span-7 md:text-start lg:col-span-8">
                  <h3 className="text-2xl font-semibold text-white md:text-3xl">
                    Subscribe to Newsletter!
                  </h3>
                  <p className="mx-auto mt-2 max-w-xl text-white/70 md:mx-0">
                    Subscribe to get the latest updates and information.
                  </p>

                  <form className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-3 md:mx-0 md:flex-row">
                    <input
                      type="email"
                      id="subscribe"
                      name="email"
                      className="w-full rounded-full bg-white/10 px-6 py-3 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm transition-all"
                      placeholder="Enter your email"
                    />
                    <button
                      type="submit"
                      className="w-full md:w-auto rounded-full bg-white px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>

                <div className="mt-8 md:col-span-5 md:mt-0 lg:col-span-4">
                  <div className="relative">
                    <img
                      src={hero2}
                      className="relative z-10 mx-auto w-64 md:w-80 lg:w-[350px]"
                      alt="hero2"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-1/2 z-0 size-64 -translate-x-1/2 rounded-full bg-gradient-to-tl from-blue-600/20 to-indigo-600 shadow-lg shadow-blue-500/20 md:size-[350px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructors Section */}
        <div className="relative container mt-16 md:mt-24 px-4 sm:px-6 md:px-8 py-10">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h4 className="mb-6 text-2xl leading-normal font-semibold md:text-3xl md:leading-normal">
              Expert Instructors
            </h4>
            <p className="mx-auto max-w-xl text-slate-400">
              Discover a world of knowledge and opportunities with our online
              education platform pursue a new career.
            </p>
          </div>
          <Suspense fallback={<SectionSkeleton />}>
            <TeamSection />
          </Suspense>
        </div>

        {/* Blogs Section */}
        <div className="relative container mt-16 md:mt-24 px-4 sm:px-6 md:px-8 py-10">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h4 className="mb-6 text-2xl leading-normal font-semibold md:text-3xl md:leading-normal">
              Blogs
            </h4>
            <p className="mx-auto max-w-xl text-slate-400">
              Discover a world of knowledge and opportunities with our online
              education platform pursue a new career.
            </p>
          </div>
          <Suspense
            fallback={
              <CourseGridSkeleton grid="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6" />
            }
          >
            <BlogGrid grid="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6" />
          </Suspense>
        </div>
      </section>

      <Footer />
    </>
  )
}

export const Route = createFileRoute('/')({
  component: LandingPage,
})
