import { auth } from '@/auth'
import { getExercisesChart, getProgressChart, getUsers } from '@/lib/supabase'
import { Suspense } from 'react'
import Progress from '@/components/Progress'

export default async function Page () {
  const session = await auth()

  async function getData () {
    let exercises
    let progress
    let users
    let currentUser

    try {
      const userEmail = session.user.email
      exercises = await getExercisesChart()
      progress = await getProgressChart(userEmail)
      users = await getUsers()
      currentUser = session.user.email
    } catch (error) {
      console.error('Error fetching data:', error)
      return { error: 'Failed to load data' }
    }

    return { exercises, progress, users, currentUser }
  }

  const { exercises, progress, users, currentUser } = await getData()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* <div
        className='h-[calc(100vh-150px)] w-full items-center gap-8 bg-black p-5'
      > */}
      <Progress exercises={exercises} progress={progress} users={users} currentUser={currentUser} />
      {/* </div> */}
    </Suspense>
  )
}
