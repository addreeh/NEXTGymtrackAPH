import Workouts from '@/components/Workouts'
// import { Plus, SlidersHorizontal } from 'lucide-react'
import { promises as fs } from 'fs'
import path from 'path'

export default async function Page () {
  const imageDirectory = path.join(process.cwd(), 'public/assets')
  const imageFilenames = await fs.readdir(imageDirectory)

  const gallery = imageFilenames
    .filter(file => file.endsWith('.webp'))
    .map(file => `/assets/${file}`)

  return (
    <>
      <header className='flex w-full items-center justify-between px-'>
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
      <Workouts gallery={gallery} />
    </>
  )
}
