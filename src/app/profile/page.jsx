import { auth } from '@/auth'
import Tabs from '@/components/Tabs'
import Image from 'next/image'

export default async function Page () {
  const session = await auth()
  console.log(session)
  return (
    <>
      <header className='flex flex-row w-full gap-5 px-2 py-5'>
        <Image
          src={session?.user?.image}
          alt={session?.user?.name}
          width={100}
          height={100}
          className='rounded-2xl'
          priority
        />
        <div className='flex flex-col gap-2'>
          <h1 className='text-white text-2xl font-bold'>{session?.user?.name}</h1>
          <h2 className='text-white text-xs truncate text-ellipsis overflow-hidden'>{session?.user?.email}</h2>
        </div>
      </header>
      <main className='flex flex-col gap-5 p-2'>
        <div className='flex flex-row gap-4'>
          <button className='bg-card-bg text-white/85 py-4 px-8 rounded-2xl'>Total calories <span className=''>  |  </span> <span className='text-white font-bold'>3000</span></button>
          <button className='bg-card-border-2 text-white py-4 px-8 rounded-2xl'>Edit</button>
        </div>
        <section className='flex flex-row justify-between items-center text-white'>
          <article className='flex flex-col justify-center'>
            <h2 className='text-sm text-gray-300'>Edad</h2>
            <h3 className='font-bold text-xl'>23 años</h3>
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
      </main>
      <div className='App'>
        <div className='rounded-2xl overflow-hidden' style={{ boxShadow: '0 10px 20px rgba(0, 0, 0, 0.07)' }}>
          <Tabs />
        </div>
      </div>
    </>
  )
}
