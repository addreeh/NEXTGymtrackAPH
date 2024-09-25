import React, { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

export default function WeightChart ({ data }) {
  const [dataChart, setDataChart] = useState([])

  useEffect(() => {
    if (data && data.macro) {
      setDataChart([
        { name: 'carbs', value: data.macro.carbs },
        { name: 'protein', value: data.macro.protein },
        { name: 'fat', value: data.macro.fat }
      ])
    }
  }, [data])

  const COLORS = ['#232229', '#232229', '#232229']

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill='white' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

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

  if (dataChart.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <PieChart>
        <Pie
          data={dataChart}
          cx='50%'
          cy='50%'
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill='#8884d8'
          dataKey='value'
        >
          {dataChart.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
      </PieChart>
    </ResponsiveContainer>
  )
}
