import { auth } from '@/auth'
import Tabs from '@/components/Tabs'
import { getUserProgressLastWeekAndThreeWeeksBefore } from '@/lib/supabase'
import Image from 'next/image'

export default async function Page () {
  const session = await auth()
  const data = await getUserProgressLastWeekAndThreeWeeksBefore(session?.user?.email)
  const totalProgress = data.lastWeek.concat(data.threeWeeksAgo)

  return (
    <>
      <header className='flex flex-row w-full gap-5 px-2 py-2'>
        <Image
          src={session?.user?.image}
          alt={session?.user?.name}
          width={100}
          height={100}
          className='rounded-2xl'
          priority
        />
        <div className='flex flex-col justify-between w-full'>
          <div>
            <h1 className='text-white text-2xl font-bold'>{session?.user?.name}</h1>
            {/* <h2 className='text-white/75 text-sm truncate text-ellipsis overflow-hidden'>{session?.user?.email}</h2> */}
          </div>
          <section className='grid grid-cols-3 items-center justify-between text-white'>
            <article className='flex flex-col justify-center'>
              <h2 className='text-sm text-white/75'>Edad</h2>
              <h3 className='font-bold text-xl'>23</h3>
            </article>
            <article className='flex flex-col justify-center'>
              <h2 className='text-sm text-gray-300'>Peso</h2>
              <h3 className='font-bold text-xl'>74 kg</h3>
            </article>
            <article className='flex flex-col justify-center'>
              <h2 className='text-sm text-gray-300'>Altura</h2>
              <h3 className='font-bold text-xl'>180 cm</h3>
            </article>
          </section>
        </div>
      </header>
      <main className='px-2'>
        {/* <div className='flex flex-row gap-4 pb-2'>
          <button className='bg-card-bg text-white/85 py-4 px-8 rounded-2xl'>Total calories <span className=''>  |  </span> <span className='text-white font-bold'>3000</span></button>
          <button className='bg-card-border-2 text-white py-4 px-8 rounded-2xl'>Edit</button>
        </div> */}

        <Tabs totalProgress={totalProgress} />
      </main>
    </>
  )
}
