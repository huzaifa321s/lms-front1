interface Props {
  children: React.ReactNode
}

import image from '../../../public/images/main-logo.jpg'
export default function AuthLayout({ children }: Props) {
  return (
    <div className='bg-primary-foreground container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center gap-1'>
          <img src={image} loading='lazy' width={50} height={50} />
          <h1 className='text-xl font-medium'>Bruce LMS</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
