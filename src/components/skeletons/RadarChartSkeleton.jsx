const RadarChartSkeleton = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='relative w-64 h-64 animate-pulse'>
        <div className='absolute inset-0 border-4 border-gray-300 rounded-full' />
        <div className='absolute inset-4 border-2 border-gray-300 rounded-full' />
        <div className='absolute inset-8 border-2 border-gray-300 rounded-full' />
        <div className='absolute inset-12 border-2 border-gray-300 rounded-full' />
        {[0, 60, 120, 180, 240, 300].map((rotation, index) => (
          <div
            key={index}
            className='absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gray-300 origin-left'
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        ))}
        {[0, 60, 120, 180, 240, 300].map((rotation, index) => (
          <div
            key={index}
            className='absolute w-16 h-4 bg-gray-300 rounded'
            style={{
              top: `${50 + 45 * Math.sin(rotation * Math.PI / 180)}%`,
              left: `${50 + 45 * Math.cos(rotation * Math.PI / 180)}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default RadarChartSkeleton
