import { Orbit } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className=''>
      <div className='m-auto flex w-full flex-col items-center justify-center gap-2'>
        <Orbit size={72} />
        <h1 className='text-4xl leading-tight font-bold'>Coming Soon</h1>
        <p className='text-muted-foreground text-center'>
          This page has not been created yet. <br />
          Stay tuned though!
        </p>
      </div>
    </div>
  )
}
