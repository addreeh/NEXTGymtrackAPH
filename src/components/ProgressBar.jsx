import React from 'react'

export default function ProgressBar ({ percent }) {
  return (
    <div className='w-[200px] h-2 bg-white/20 rounded-full overflow-hidden'>
      <div
        className='h-full bg-white transition-all duration-300 ease-out rounded-full'
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
