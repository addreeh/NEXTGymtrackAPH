import { auth } from '@/auth'
import { getExercises, getUserProgressLastWeekAndThreeWeeksBefore, getUserRoutinesWithExercises } from '@/lib/supabase'
import { Suspense } from 'react'
import { DrawerWorkout } from '@/components/DrawerWorkout'
import SkeletonWorkouts from '@/components/skeletons/SkeletonWorkouts'
import { DrawerNewWorkout } from './DrawerNewWorkout'

export default async function Workouts ({ gallery }) {
  const session = await auth()

  const diasSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ]
  const fechaActual = new Date()
  const nombreDia = diasSemana[fechaActual.getDay()]

  async function getData () {
    try {
      const userEmail = session.user.email
      const workouts = await getUserRoutinesWithExercises(userEmail)
      // const progress = await getUserProgressLastWeek(userEmail)
      // const workoutsWithProgress = mergeProgressWithExercises(workouts, progress)

      const totalProgress = await getUserProgressLastWeekAndThreeWeeksBefore(userEmail)
      const workoutsWithProgress = mergeProgressWithExercises(workouts, totalProgress)
      const exercises = await getExercises()

      return { workoutsWithProgress, exercises }
    } catch (error) {
      console.error('Error fetching data:', error)
      return { error: 'Failed to load data' }
    }
  }

  function mergeProgressWithExercises (workouts, totalProgress) {
    return workouts.map(workout => ({
      ...workout,
      routine_exercises: workout.routine_exercises
        .map(exercise => ({
          ...exercise,
          exercise_definitions: {
            ...exercise.exercise_definitions,
            progress: {
              lastWeek: totalProgress.lastWeek.filter(p => p.exercise_id === exercise.exercise_definitions.id),
              threeWeeksAgo: totalProgress.threeWeeksAgo.filter(p => p.exercise_id === exercise.exercise_definitions.id)
            }
          }
        }))
        .sort((a, b) => a.order - b.order)
    }))
  }

  const { workoutsWithProgress, exercises } = await getData()

  if (workoutsWithProgress.error) {
    return (
      <p className='text-footer-text text-sm'>
        No tienes <span className='font-bold'>ningún</span> entreno programado
        hoy.
      </p>
    )
  }

  return (
    <Suspense fallback={
      Array.from({ length: 5 }).map((_, index) => <SkeletonWorkouts key={index} />)
    }
    >
      <main className='flex-grow grid w-full grid-cols-2 items-center justify-center gap-x-8 gap-y-6 overflow-y-auto px-2' id='hide-scroll'>
        {workoutsWithProgress.map((workout, index) => (
          <DrawerWorkout key={index} workout={workout} gallery={gallery} />
        ))}
        <DrawerNewWorkout exercises={exercises} gallery={gallery} />
      </main>
      <footer className='text-center bg-bg-app absolute bottom-0 left-0 right-0 py-4'>
        {workoutsWithProgress.some(workout => workout.day === nombreDia)
          ? (workoutsWithProgress
              .filter(workout => workout.day === nombreDia)
              .map(workout =>
                <p key={workout.id} className='text-footer-text text-sm'>
                  Tienes <span className='font-bold'>{workout.name}</span> programado
                  hoy.
                </p>
              ))
          : (
            <p className='text-footer-text text-sm'>
              No tienes <span className='font-bold'>ningún</span> entreno programado
              hoy.
            </p>
            )}
      </footer>
    </Suspense>
  )
}
