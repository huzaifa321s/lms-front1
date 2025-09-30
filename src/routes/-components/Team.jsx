import React from 'react'
import { Facebook, Instagram, Linkedin } from 'lucide-react'
import { teamData } from './partenerData'

const icons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
}

const TeamSection = () => {
  return (
    <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
      {teamData.slice(0, 4).map((item, index) => (
        <div key={index} className='group text-center'>
          <div className='relative mx-auto inline-block overflow-hidden rounded-full'>
            <img src={item.image} alt={item.name} />
            <div className='absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black opacity-0 duration-500 group-hover:opacity-100'></div>

            <ul className='absolute start-0 end-0 -bottom-20 flex list-none justify-center duration-500 group-hover:bottom-5'>
              {item.social.map((el, idx) => {
                const Icon = icons[el.name]
                return (
                  <li key={idx} className='mx-[2px] inline'>
                    <a
                      href='#!'
                      className='inline-flex size-8 items-center justify-center rounded-full bg-violet-600 text-white'
                    >
                      {Icon && <Icon className='h-4 w-4' />}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className='content mt-3'>
            <a
              href='#!'
              className='text-lg font-medium duration-500 hover:text-violet-600'
            >
              {item.name}
            </a>
            <p className='text-slate-400'>{item.position}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TeamSection
