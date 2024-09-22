import { auth } from '@/auth'
import { getUserProgressLastWeekAndThreeWeeksBefore, getUserRoutinesWithExercises } from '@/lib/supabase'
import { Suspense } from 'react'
import { DrawerWorkout } from './DrawerWorkout'
import SkeletonWorkouts from './SkeletonWorkouts'
import { Plus } from 'lucide-react'

export default async function Workouts () {
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

      return workoutsWithProgress
    } catch (error) {
      console.error('Error fetching data:', error)
      return { error: 'Failed to load data' }
    }
  }

  function mergeProgressWithExercises (workouts, totalProgress) {
    return workouts.map(workout => ({
      ...workout,
      routine_exercises: workout.routine_exercises.map(exercise => ({
        ...exercise,
        exercise_definitions: {
          ...exercise.exercise_definitions,
          progress: {
            lastWeek: totalProgress.lastWeek.filter(p => p.exercise_id === exercise.exercise_definitions.id),
            threeWeeksAgo: totalProgress.threeWeeksAgo.filter(p => p.exercise_id === exercise.exercise_definitions.id)
          }
        }
      }))
    }))
  }

  // function mergeProgressWithExercises (workouts, progress) {
  //   return workouts.map(workout => ({
  //     ...workout,
  //     routine_exercises: workout.routine_exercises.map(exercise => ({
  //       ...exercise,
  //       exercise_definitions: {
  //         ...exercise.exercise_definitions,
  //         progress: progress.filter(p => p.exercise_id === exercise.exercise_definitions.id)
  //       }
  //     }))
  //   }))
  // }

  const workouts = await getData()

  if (workouts.error) {
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
      <main className='flex-grow grid w-full grid-cols-2 items-center justify-between gap-5'>
        {workouts.map((workout, index) => (
          <DrawerWorkout key={index} workout={workout} />
        ))}
        <div className='border-card-border flex h-[9.5rem] w-[9.5rem] justify-center items-center rounded-3xl border-2 bg-[#17171B] p-4 cursor-pointer ml-1 text-card-border'>
          <Plus className='w-20 h-20' />
        </div>
      </main>
      <footer className='text-center py-4'>
        {workouts.some(workout => workout.day === nombreDia)
          ? (workouts
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
