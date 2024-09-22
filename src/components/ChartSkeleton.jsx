import React from 'react'
import { LineChart, Line, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const ChartSkeleton = () => {
  // Generate some dummy data for the skeleton
  const dummyData = Array.from({ length: 7 }, (_, i) => ({ value: Math.random() * 100 }))

  return (
    <ResponsiveContainer width='100%' height='100%' className='bg-[#232229] rounded-3xl animate-pulse'>
      <LineChart
        data={dummyData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid vertical={false} stroke='#3C3B40' />
        <YAxis
          orientation='right'
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'transparent' }}
        />
        <Line
          type='linear'
          dataKey='value'
          stroke='#4B4B4B'
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ChartSkeleton
