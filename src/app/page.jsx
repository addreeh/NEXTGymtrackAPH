import Workouts from '@/components/Workouts'
// import { Plus, SlidersHorizontal } from 'lucide-react'

export default async function Page () {
  return (
    <>
      <header className='flex w-full items-center justify-between px-2'>
        <h1 className='text-3xl font-bold text-white'>Workouts</h1>
        {/* <section className='flex items-center gap-4'>
          <div className='rounded-full bg-svg-bg p-2.5 text-white'>
            <SlidersHorizontal width={20} height={20} />
          </div>
          <div className='rounded-full bg-svg-bg p-2 text-white'>
            <Plus width={20} height={20} />
          </div>
        </section> */}
      </header>
      <Workouts />
    </>
  )
}
