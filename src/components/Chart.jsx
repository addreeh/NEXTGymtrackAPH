import React, { useEffect, useState } from 'react'
import { LineChart, Line, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, XAxis } from 'recharts'

export default function Chart ({ chartData, selectedReps }) {
  const [data, setData] = useState([])
  const [windowSize, setWindowSize] = useState({ width: 500, height: 300 })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
  }, [])

  useEffect(() => {
    const processData = () => {
      const dailyData = {}

      chartData.forEach(d => {
        const formattedDate = new Date(d.date).toLocaleDateString('es-ES', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit'
        })

        if (!dailyData[formattedDate]) {
          dailyData[formattedDate] = []
        }

        dailyData[formattedDate].push({
          weight: d.weight[0],
          reps: d.repetitions[0]
        })
      })

      let processedData

      switch (selectedReps.value) {
        case 'max':
          processedData = Object.entries(dailyData).map(([date, entries]) => ({
            date,
            weight: Math.max(...entries.map(e => e.weight)),
            reps: entries.find(e => e.weight === Math.max(...entries.map(e => e.weight))).reps
          }))
          break
        case 'min':
          processedData = Object.entries(dailyData).map(([date, entries]) => ({
            date,
            weight: Math.min(...entries.map(e => e.weight)),
            reps: entries.find(e => e.weight === Math.min(...entries.map(e => e.weight))).reps
          }))
          break
        case 'avg':
          processedData = Object.entries(dailyData).map(([date, entries]) => ({
            date,
            weight: Math.round(entries.reduce((sum, e) => sum + e.weight, 0) / entries.length),
            reps: Math.round(entries.reduce((sum, e) => sum + e.reps, 0) / entries.length)
          }))
          break
        case 'all':
          processedData = Object.entries(dailyData).map(([date, entries]) => ({
            date,
            ...entries.reduce((acc, entry, index) => ({
              ...acc,
              [`weight${index + 1}`]: entry.weight,
              [`reps${index + 1}`]: entry.reps
            }), {})
          }))
          break
      }

      setData(processedData)
    }

    processData()
  }, [chartData, selectedReps])

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
              {`${entry.weight} kg - ${entry.reps} reps`}
            </p>
          ))}
        </div>
      )
    }

    return null
  }

  const renderLines = () => {
    if (selectedReps.value === 'all') {
      const maxEntries = Math.max(...data.map(item =>
        Object.keys(item).filter(key => key.startsWith('weight')).length
      ))

      return Array.from({ length: maxEntries }, (_, i) => (
        <React.Fragment key={i}>
          <Line type='linear' dataKey={`weight${i + 1}`} stroke='white' activeDot={{ r: 8 }} />
          <Line type='linear' dataKey={`reps${i + 1}`} stroke='white' dot={{ stroke: 'white', strokeWidth: 2 }} />
        </React.Fragment>
      ))
    } else {
      return (
        <>
          <Line type='linear' dataKey='weight' stroke='white' activeDot={{ r: 8 }}>
            <LabelList dataKey='weight' position='top' offset={10} style={{ fill: 'white', fontWeight: 'normal', fontSize: '12px' }} />
          </Line>
          <Line type='linear' dataKey='reps' stroke='white' dot={{ stroke: 'white', strokeWidth: 2 }}>
            <LabelList dataKey='reps' position='top' offset={10} style={{ fill: 'white', fontWeight: 'normal', fontSize: '12px' }} />
          </Line>
        </>
      )
    }
  }

  return (
    <ResponsiveContainer width='100%' height='100%' className='bg-[#232229] rounded-3xl'>
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
          orientation='right'
          axisLine={false}
          tickLine={false}
          tickFormatter={(tick) => `${tick} kg`}
          tick={{ fontSize: '12', fontWeight: '600' }}
        />
        <Tooltip content={<CustomTooltip />} />
        {renderLines()}
      </LineChart>
    </ResponsiveContainer>
  )
}
