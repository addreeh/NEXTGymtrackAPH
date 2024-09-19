import Workouts from '@/components/Workouts'
import { Plus, SlidersHorizontal } from 'lucide-react'
import { AuthManagement } from '@/components/AuthManagement'

export default async function Page () {
  return (
    <div
      vaul-drawer-wrapper=''
      className='flex min-h-[100vh] flex-col items-center gap-5 bg-black p-5'
    >
      <header className='flex w-full items-center justify-between'>
        <h1 className='text-3xl font-bold text-white'>Workouts</h1>
        <section className='flex items-center gap-4'>
          <div className='rounded-full bg-svg-bg p-2.5 text-white'>
            <SlidersHorizontal width={20} height={20} />
          </div>
          <div className='rounded-full bg-svg-bg p-2 text-white'>
            <Plus width={20} height={20} />
          </div>
        </section>
      </header>
      <main>
        <AuthManagement />
        <Workouts />
      </main>
    </div>
  )
}
