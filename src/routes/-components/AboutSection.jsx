import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import './index.css'
import about1 from '/course/1.jpg'
import about2 from '/course/4.jpg'
import { PlayIcon } from 'lucide-react'

function AboutSection({ title }) {
  return (
    <div className='flex justify-center'>
      <div className='about-container flex flex-col-reverse md:flex-row'>
        {/* Left Section - Images */}
        <div className='about-images'>
          <div className='main-image relative'>
            <img src={about1} alt='Main Course Image' />
            {/* Play Button - opens Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size='sm'
                  className='play-button'
                  aria-label='Play Video'
                >
                  <PlayIcon/>
                </Button>
              </DialogTrigger>

              <DialogContent className='max-w-full p-2 [&>button]:rounded-full [&>button]:bg-white [&>button]:p-2 [&>button]:text-black [&>button]:shadow'>
                <div className='relative overflow-hidden rounded-lg'>
                  <iframe
                    width='500'
                    height='400'
                    src='https://www.youtube.com/embed/yba7hPeTSjk?playlist=yba7hPeTSjk&loop=1'
                    title='About Video'
                    allowFullScreen
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className='secondary-image'>
            <img src={about2} alt='Secondary Course Image' />
          </div>
        </div>

        {/* Right Section - Content */}
        <div className='about-content'>
          {title && <span className='section-title'>Our Story</span>}
          <h2 className='about-title'>
            Access to Learning
            <br />
            Anytime & Anywhere
          </h2>
          <p className='about-text'>
            Many desktop publishing packages and web page editors now use Lorem
            Ipsum as their default model text, and a search for 'lorem ipsum'
            will uncover many web sites still in their infancy. Various versions
            have evolved over the years, sometimes by accident, sometimes on
            purpose (injected humour and the like).
          </p>
          <ul className='about-features'>
            <li>Flexible Timing</li>
            <li>Easy Learning</li>
            <li>Affordable</li>
            <li>World Class</li>
          </ul>
          <a
            href='#!'
            onClick={(e) => e.preventDefault()}
            className='learn-more'
          >
            Learn More <span className='arrow-icon'></span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default AboutSection
