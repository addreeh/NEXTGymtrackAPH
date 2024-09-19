import { auth } from '@/auth'
import { getExercisesChart, getProgressChart } from '@/lib/supabase'
import { Suspense } from 'react'
import Progress from '@/components/Progress'

const session = await auth()

async function getData () {
  let exercises
  let progress

  try {
    const userEmail = session.user.email
    exercises = await getExercisesChart()
    progress = await getProgressChart(userEmail)
  } catch (error) {
    console.error('Error fetching data:', error)
    return { error: 'Failed to load data' }
  }

  return { exercises, progress }
}

export default async function Page () {
  const { exercises, progress } = await getData()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className='flex min-h-[100vh] flex-col items-center gap-8 bg-black p-5'
      >
        <Progress exercises={exercises} progress={progress} />
      </div>
    </Suspense>
  )
}
