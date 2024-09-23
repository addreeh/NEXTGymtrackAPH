'use client'

import { CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function WeightChart ({ data, windowSize }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload.reduce((acc, entry, index, array) => {
        if (index % 2 === 0) {
          const weight = entry.value
          const reps = array[index + 1]?.value
          acc.push({ weight, reps })
        }
        return acc
      }, [])

      const sortedData = data.sort((a, b) => b.weight - a.weight)

      return (
        <div className='bg-black p-2 rounded shadow-md'>
          <p className='text-card-text text-sm font-bold'>{label}</p>
          {sortedData.map((entry, index) => (
            <p key={index} className='text-white text-sm'>
              {`${entry.weight} kg`}
            </p>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <ResponsiveContainer width='100%' height='100%' className='bg-[#232229] border-2 border-card-border rounded-3xl'>
      <LineChart
        width={windowSize.width}
        height={windowSize.height}
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 20,
          bottom: 0
        }}
      >
        <CartesianGrid vertical={false} stroke='#3C3B40' />
        <XAxis dataKey='date' visibility='hidden' />
        <YAxis
          dataKey='weight'
          orientation='right'
          axisLine={false}
          tickLine={false}
          tickFormatter={(tick) => `${tick} kg`}
          tick={{ fontSize: '12', fontWeight: '600' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line type='linear' dataKey='weight' stroke='white' activeDot={{ r: 8 }}>
          <LabelList dataKey='weight' position='bottom' offset={10} style={{ fill: 'white', fontWeight: 'normal', fontSize: '12px' }} />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  )
}
