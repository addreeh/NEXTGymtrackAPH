'use client'

import { Plus } from 'lucide-react'

export default function NewWorkout () {
  const handleClick = () => {
    console.log('click')
  }

  return (
    <div onClick={handleClick} className='border-card-border flex h-[9.5rem] w-[9.5rem] justify-center items-center rounded-3xl border-2 bg-[#17171B] p-4 cursor-pointer ml-1 text-card-border'>
      <Plus className='w-20 h-20' />
    </div>
  )
}
