import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import RadarChartSkeleton from '../skeletons/RadarChartSkeleton'

export default function TrainingChart ({ trainingData }) {
  if (trainingData.length === 0) {
    return <RadarChartSkeleton />
  }

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <ResponsiveContainer width='100%' height='100%' className='max-w-md max-h-md'>
        <RadarChart cx='50%' cy='50%' outerRadius='85%' data={trainingData}>
          <PolarGrid />
          <PolarAngleAxis dataKey='subject' tick={{ fill: 'white', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'white', fontSize: 10 }} />
          <Radar name='Muscle Group' dataKey='A' stroke='#white' fill='white' fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
