'use client'

import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Chart ({ chartData }) {
  console.log('c', chartData)
  const [data, setData] = useState([])

  useEffect(() => {
    const entries = []
    chartData.forEach(d => {
      const entry = {
        date: d.date,
        weight: d.weight,
        reps: d.repetitions,
        amt: 2000
      }

      entries.push(entry)
    })
    console.log('data', entries)
    setData(entries)
  }, [chartData])

  return (
    <ResponsiveContainer width='100%' height='100%' className='w-full h-full bg-card-bg'>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid vertical={false} stroke='#3C3B40' />
        <XAxis dataKey='date' />
        <YAxis dataKey='weight' orientation='right' axisLine={false} tickLine={false} />
        <Tooltip />
        {/* <Legend /> */}
        <Line type='linear' dataKey='weight' stroke='white' activeDot={{ r: 8 }} />
        <Line type='linear' dataKey='reps' stroke='white' dot={{ stroke: 'white', strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
