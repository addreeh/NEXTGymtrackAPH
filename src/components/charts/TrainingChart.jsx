import React, { useEffect, useState } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import RadarChartSkeleton from '../skeletons/RadarChartSkeleton'

export default function TrainingChart ({ totalProgress }) {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (totalProgress && totalProgress.length > 0) {
      const data = calculateMuscleGroupPercentages(totalProgress)
      setChartData(data)
    }
  }, [totalProgress])

  const calculateMuscleGroupPercentages = (data) => {
    const muscleGroupCounts = {}

    data.forEach((exercise) => {
      const muscleGroup = exercise.muscle_group
      if (muscleGroupCounts[muscleGroup]) {
        muscleGroupCounts[muscleGroup]++
      } else {
        muscleGroupCounts[muscleGroup] = 1
      }
    })

    const total = Object.values(muscleGroupCounts).reduce((acc, count) => acc + count, 0)

    return Object.entries(muscleGroupCounts).map(([muscleGroup, count]) => ({
      subject: muscleGroup,
      A: ((count / total) * 100).toFixed(2),
      fullMark: 100
    }))
  }

  if (chartData.length === 0) {
    return <RadarChartSkeleton />
  }

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <ResponsiveContainer width='100%' height='100%' className='max-w-md max-h-md'>
        <RadarChart cx='50%' cy='50%' outerRadius='85%' data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey='subject' tick={{ fill: 'white', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'white', fontSize: 10 }} />
          <Radar name='Muscle Group' dataKey='A' stroke='#white' fill='white' fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
