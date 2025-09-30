import { Suspense, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Monitor, Plus } from 'lucide-react'
import CountUp from 'react-countup'
import { Button } from '@/components/ui/button'
import hero from '../../public/images/1.png'
import hero2 from '../../public/images/2.png'
import bg from '../../public/images/bg.png'
import team1 from '../../public/images/team/1.jpg'
import team2 from '../../public/images/team/2.jpg'
import team3 from '../../public/images/team/3.jpg'
import team4 from '../../public/images/team/4.jpg'
import team5 from '../../public/images/team/5.jpg'
import { NavbarRouteComponent } from './-NavbarRouteComponent'
import AboutSection from './-components/AboutSection'
import Feature from './-components/AppFeature'
import BlogSection from './-components/BlogSection'
import CourseGrid from './-components/GridCourse'
import TeamSection from './-components/Team'
import Partners from './-components/partener'
import { Footer } from './student/Footer'
import BlogGrid from './-components/GridBlog'



const CourseGridSkeleton = ({ grid }) => {
  return (
    <div className={grid}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white/60 backdrop-blur-lg border border-slate-200 rounded-xl shadow-sm p-6"
        >
          <div className="h-40 bg-slate-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div className="h-3 bg-slate-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  )
}

const teamImg = [team1, team2, team3, team4, team5]
function LandingPage() {
  const data = [
    {
      id: 1,
      coverImage: '1.jpg',
      lessons: 12,
      students: 340,
      title: 'React Basics for Beginners',
      description:
        'Learn the fundamentals of React including components, state, and props to build modern web apps.',
      name: 'John Doe',
    },
    {
      id: 2,
      coverImage: '2.jpg',
      lessons: 18,
      students: 420,
      title: 'Advanced JavaScript Concepts',
      description:
        'Deep dive into closures, async programming, ES6+ features, and advanced patterns in JavaScript.',
      name: 'Jane Smith',
    },
    {
      id: 3,
      coverImage: '3.jpg',
      lessons: 10,
      students: 210,
      title: 'Mastering CSS and Flexbox',
      description:
        'Understand CSS deeply with modern layouts using Flexbox and responsive design techniques.',
      name: 'Alex Johnson',
    },
    {
      id: 4,
      coverImage: '4.jpg',
      lessons: 25,
      students: 510,
      title: 'Node.js API Development',
      description:
        'Build powerful backend applications with Node.js, Express, and MongoDB integration.',
      name: 'Emily Davis',
    },
    {
      id: 5,
      coverImage: '5.jpg',
      lessons: 15,
      students: 300,
      title: 'UI/UX Design Principles',
      description:
        'Learn design thinking, wireframing, prototyping, and usability testing to improve product design.',
      name: 'Michael Brown',
    },
    {
      id: 6,
      coverImage: '6.jpg',
      lessons: 8,
      students: 150,
      title: 'Python for Data Science',
      description:
        'Get started with Python, NumPy, and Pandas for analyzing and visualizing datasets.',
      name: 'Sarah Wilson',
    },
    {
      id: 7,
      coverImage: '7.jpg',
      lessons: 20,
      students: 600,
      title: 'Fullstack Web Development',
      description:
        'End-to-end guide for building frontend and backend applications with React and Node.js.',
      name: 'David Miller',
    },
    {
      id: 8,
      coverImage: '8.jpg',
      lessons: 14,
      students: 280,
      title: 'TailwindCSS Crash Course',
      description:
        'Quickly style modern web applications with utility-first TailwindCSS framework.',
      name: 'Sophia Martinez',
    },
    {
      id: 9,
      coverImage: '9.jpg',
      lessons: 30,
      students: 800,
      title: 'Machine Learning Essentials',
      description:
        'Learn supervised and unsupervised learning, model evaluation, and ML algorithms basics.',
      name: 'Daniel Lee',
    },
    {
      id: 10,
      coverImage: '10.jpg',
      lessons: 22,
      students: 450,
      title: 'TypeScript with React',
      description:
        'Enhance your React apps with TypeScript, strong typing, and better developer experience.',
      name: 'Olivia Harris',
    },
  ]
  const navigate = useNavigate()
  return (
    <>
      <NavbarRouteComponent />
      <section
        id='home'
        className='relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 p-10 py-36 md:h-screen'
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className='relative container'>
          <div className='grid grid-cols-1 items-center gap-10 md:grid-cols-2'>
            {/* Left Content */}
            <div>
              <h1 className='mb-6 text-4xl leading-snug font-semibold tracking-wide text-slate-900 lg:text-5xl lg:leading-tight'>
                Best{' '}
                <span className='relative inline-block before:absolute before:-inset-2 before:block before:-skew-y-6 before:bg-gradient-to-tr before:from-blue-600 before:to-blue-800'>
                  <span className='relative font-bold text-white'>Online</span>
                </span>{' '}
                Courses <br /> From{' '}
                <span className='font-bold text-blue-700'>Bruce LMS</span>
              </h1>

              <p className='max-w-xl text-lg text-slate-600'>
                Discover a world of knowledge and opportunities with our online
                education platform. Pursue a new career with flexible learning.
              </p>

              <div className='my-5 flex flex-wrap gap-4'>
                <Button
                  onClick={() => navigate({ to: '/student/courses' })}
                  size=''
                  className='inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 font-medium tracking-wide text-white shadow-lg transition hover:scale-105'
                >
                  Browse Courses{' '}
                  <i className='mdi mdi-arrow-right ms-2 align-middle'></i>
                </Button>

                <Button
                  onClick={() => navigate({ to: '/teacher/register' })}
                  size=''
                  variant='outline'
                  className='rounded-lg border-blue-600 tracking-wide text-blue-600 hover:bg-blue-50'
                >
                  Become Instructor
                </Button>

                {/* New Button: View Our Instructors */}
                <Button
                  onClick={() => navigate({ to: '/student/instructors' })}
                  size=''
                  variant='ghost'
                  className='rounded-lg border border-blue-600 tracking-wide text-blue-600 transition hover:scale-105 hover:bg-blue-50'
                >
                  View Our Instructors
                </Button>
              </div>
            </div>

            {/* Right Content */}
            <div className='relative lg:ms-8'>
              <img src={hero} className='relative z-10 mx-auto' alt='hero' fetchPriority='high'/>

              {/* Instructor Avatars */}
              <div className='mover absolute bottom-12 -left-2 z-20 w-56 rounded-xl bg-white/70 p-4 shadow-lg backdrop-blur-md md:bottom-16 md:-left-10'>
                <h5 className='mb-3 text-lg font-semibold text-slate-800'>
                  Our Instructors
                </h5>
                <ul className='flex'>
                  {teamImg.map((item, index) => (
                    <li
                      key={index}
                      className='-ml-3 inline-block transition first:ml-0 hover:scale-105'
                    >
                      <img
                        src={item}
                        alt='team member'
                        className='size-10 rounded-full border-2 border-white shadow-md'
                      />
                    </li>
                  ))}
                  <li className='-ml-3 inline-block'>
                    <a className='flex size-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-sm text-white transition hover:scale-105'>
                      <Plus />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Course Stats */}
              <div className='mover-2 absolute top-28 -right-5 z-20 w-52 rounded-xl bg-white/70 p-4 shadow-lg backdrop-blur-md md:top-36 md:-right-10'>
                <div className='flex items-center'>
                  <div className='me-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600'>
                    <Monitor className='h-6 w-6' />
                  </div>
                  <div>
                    <span className='text-sm text-slate-500'>
                      Online Courses
                    </span>
                    <p className='text-xl font-bold text-slate-900'>
                      <CountUp
                        end={100}
                        className='counter-value inline-block'
                      />
                      +
                    </p>
                  </div>
                </div>
              </div>

              {/* Gradient Circle Decoration */}
              <div className='absolute bottom-1/2 left-1/2 -z-10 size-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tl from-blue-600 to-blue-800 opacity-70 blur-3xl md:left-0 md:size-[500px] md:translate-x-0'></div>
            </div>
          </div>
        </div>
      </section>

      <section className='pt-6'>
        <Partners />
      </section>
      <section className='relative flex flex-col items-center py-16 md:py-24'>
        <div className='relative container'>
          <AboutSection />
        </div>

        <div className='relative container mt-16 p-10 md:mt-24'>
          <div className='grid grid-cols-1 pb-6 text-center'>
            <h4 className='mb-6 text-2xl leading-normal font-semibold md:text-3xl md:leading-normal'>
              Discover Powerful Features
            </h4>
            <p className='mx-auto max-w-xl text-slate-400'>
              Discover a world of knowledge and opportunities with our online
              education platform pursue a new career.
            </p>
          </div>
          <Feature />
        </div>

        <div className='relative container mt-16 p-10 md:mt-24'>
          <div className='grid grid-cols-1 pb-6 text-center'>
            <h4 className='mb-6 text-2xl leading-normal font-semibold md:text-3xl md:leading-normal'>
              Explore Our Best Courses
            </h4>
            <p className='mx-auto max-w-xl text-slate-400'>
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
          <div className='mt-6 grid grid-cols-1 md:grid-cols-12'>
            <div className='text-center md:col-span-12'>
              <Link
                to='/student/courses'
                className='text-slate-400 duration-500 ease-in-out hover:text-violet-600'
              >
                See More Courses{' '}
                <i className='mdi mdi-arrow-right align-middle'></i>
              </Link>
            </div>
          </div>
        </div>
        <div className='relative mt-16 w-full overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 md:mt-24'>
          <div
            className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-cover bg-top bg-no-repeat px-6 py-16 pt-12 md:px-12 md:py-24 md:pt-0 lg:px-20 lg:py-28'
            style={{ backgroundImage: `url(${bg})` }}
          >
            <div className='relative container mx-auto'>
              <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-12'>
                {/* Text + Form Section */}
                <div className='text-center md:col-span-7 md:text-start lg:col-span-8'>
                  <h3 className='text-2xl font-semibold text-white md:text-3xl'>
                    Subscribe to Newsletter!
                  </h3>
                  <p className='mx-auto mt-2 max-w-xl text-white/70 md:mx-0'>
                    Subscribe to get the latest updates and information.
                  </p>

                  <form className='mx-auto mt-6 flex max-w-xl flex-col items-center gap-3 md:mx-0 md:flex-row'>
                    <input
                      type='email'
                      id='subscribe'
                      name='email'
                      className='w-full flex-1 rounded-full bg-blue-700 px-4 py-3 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-cyan-400'
                      placeholder='Enter your email'
                    />
                    <button
                      type='submit'
                      className='w-full rounded-full bg-cyan-500 px-6 py-3 font-medium text-white shadow-md shadow-cyan-500/20 transition hover:bg-cyan-600 md:w-auto'
                    >
                      Subscribe
                    </button>
                  </form>
                </div>

                {/* Image Section */}
                <div className='mt-8 md:col-span-5 md:mt-0 lg:col-span-4'>
                  <div className='relative'>
                    <img
                      src={hero2}
                      className='relative z-10 mx-auto w-64 md:w-80 lg:w-[350px]'
                      alt='hero2'
                    />
                    <div className='absolute bottom-0 left-1/2 z-0 size-64 -translate-x-1/2 rounded-full bg-gradient-to-tl from-blue-600/20 to-indigo-600 shadow-lg shadow-blue-500/20 md:size-[350px]'></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='relative container mt-16 p-10 md:mt-24'>
          <div className='grid grid-cols-1 pb-6 text-center'>
            <h4 className='mb-6 text-2xl leading-normal font-semibold md:text-3xl md:leading-normal'>
              Expert Instructors
            </h4>
            <p className='mx-auto max-w-xl text-slate-400'>
              Discover a world of knowledge and opportunities with our online
              education platform pursue a new career.
            </p>
          </div>
          <TeamSection />
        </div>

        <div className='relative container mt-16 p-10 md:mt-24'>
          <div className='grid grid-cols-1 pb-6 text-center'>
            <h4 className='mb-6 text-2xl leading-normal font-semibold md:text-3xl md:leading-normal'>
              Blogs
            </h4>
            <p className='mx-auto max-w-xl text-slate-400'>
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
