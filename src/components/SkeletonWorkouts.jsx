export default function SkeletonWorkouts () {
  return (
    <div className='border-card-border flex h-[9.5rem] w-[9.5rem] flex-col justify-between rounded-3xl border-2 bg-card-bg p-4 cursor-pointer'>
      <div className='text-card-border flex w-full items-center justify-between'>
        <div className='border-card-border flex h-16 w-16 items-center justify-center rounded-full border-2'>
          <h2 className='border-card-border-2 flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl text-white'>
            0
          </h2>
        </div>
        <div className='mb-2'>
          <svg fill='currentColor' width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='currentColor'>
            <g id='SVGRepo_bgCarrier' strokeWidth='0' />
            <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />
            <g id='SVGRepo_iconCarrier'>
              <path d='M1,6A1,1,0,0,1,2,5H12a1,1,0,0,1,0,2H2A1,1,0,0,1,1,6ZM22,5H17V3a1,1,0,0,0-2,0V9a1,1,0,0,0,2,0V7h5a1,1,0,0,0,0-2Zm0,12H13V15a1,1,0,0,0-2,0v6a1,1,0,0,0,2,0V19h9a1,1,0,0,0,0-2ZM8,19a1,1,0,0,0,0-2H2a1,1,0,0,0,0,2Z' />
            </g>

          </svg>
        </div>
      </div>
      <div className='flex flex-col'>
        <h3 className='text-sm font-semibold text-white' />
        <h4 className='text-card-text text-xs' />
      </div>
    </div>
  )
}
