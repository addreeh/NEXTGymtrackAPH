import { auth } from '@/auth'
import { getUserProgressLastWeek, getUserRoutinesWithExercises } from '@/lib/supabase'
import { Suspense } from 'react'
import { DrawerWorkout } from './DrawerWorkout'
import SkeletonWorkouts from './SkeletonWorkouts'
import { getFullDay } from '@/lib/date'

export default async function Workouts () {
  const session = await auth()
  if (!session?.user) return null

  const workouts = await getData(session.user.email)

  if ('error' in workouts) {
    return <NoWorkoutsMessage />
  }

  return (
    <Suspense fallback={<SkeletonWorkouts count={5} />}>
      <div className='flex flex-col h-[calc(100vh-150px)] justify-between'>
        <WorkoutGrid workouts={workouts} />
        <TodayWorkoutMessage workouts={workouts} />
      </div>
    </Suspense>
  )
}

async function getData (userEmail) {
  try {
    const [workouts, progress] = await Promise.all([
      getUserRoutinesWithExercises(userEmail),
      getUserProgressLastWeek(userEmail)
    ])
    return mergeProgressWithExercises(workouts, progress)
  } catch (error) {
    console.error('Error fetching data:', error)
    return { error: 'Failed to load data' }
  }
}

function mergeProgressWithExercises (workouts, progress) {
  return workouts.map(workout => ({
    ...workout,
    routine_exercises: workout.routine_exercises.map(exercise => ({
      ...exercise,
      exercise_definitions: {
        ...exercise.exercise_definitions,
        progress: progress.filter(p => p.exercise_id === exercise.exercise_definitions.id)
      }
    }))
  }))
}

function WorkoutGrid ({ workouts }) {
  return (
    <div className='flex-grow grid w-full grid-cols-2 items-center justify-between gap-5'>
      {workouts.map((workout, index) => (
        <DrawerWorkout key={workout.id || index} workout={workout} />
      ))}
    </div>
  )
}

function TodayWorkoutMessage ({ workouts }) {
  const today = new Date()
  const { nombre: nombreDia } = getFullDay(today)
  const todayWorkouts = workouts.filter(workout => workout.day === nombreDia)

  return (
    <div className='text-center py-4'>
      {todayWorkouts.length > 0
        ? (
            todayWorkouts.map(workout => (
              <p key={workout.id} className='text-footer-text text-sm'>
                Tienes <span className='font-bold'>{workout.name}</span> programado hoy.
              </p>
            ))
          )
        : (
          <NoWorkoutsMessage />
          )}
    </div>
  )
}

function NoWorkoutsMessage () {
  return (
    <p className='text-footer-text text-sm'>
      No tienes <span className='font-bold'>ningún</span> entreno programado hoy.
    </p>
  )
}
