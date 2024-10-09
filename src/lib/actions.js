'use server'

import { auth } from '@/auth'
import { createExerciseToRoutine, deleteExerciseFromRoutine, deleteProgress, deleteRoutine, getExercises, getProgressByDate, getUserProgressLastWeekAndThreeWeeksBefore, getUserRoutinesWithExercises, insertProgress, insertRoutine, insertRoutineExercise, nullExerciseFromRoutine, updateRoutineName } from './supabase'
import { getFullDay } from './date'
import { revalidatePath } from 'next/cache'

export async function createProgress (formData) {
  const session = await auth()
  const email = session.user.email

  const today = new Date()
  const currentDayOfWeek = today.getDay()
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

  const selectedDayIndex = daysOfWeek.indexOf(formData.get('workoutDay'))
  const daysDiff = selectedDayIndex - currentDayOfWeek

  const selectedDate = new Date(today)
  selectedDate.setDate(today.getDate() + daysDiff)

  const date = getFullDay(selectedDate)

  let newProgress
  if (formData.get('weight1') && formData.get('weight2')) {
    newProgress = {
      date: date.full,
      repetitions: [parseInt(formData.get('reps1')), parseInt(formData.get('reps2'))],
      weight: [parseFloat(formData.get('weight1').replace(',', '.')), parseFloat(formData.get('weight2').replace(',', '.'))],
      exercise_definition_id: parseInt(formData.get('exerciseId')),
      type: formData.get('type') || 'lineal'
    }
  } else {
    newProgress = {
      date: date.full,
      repetitions: [parseInt(formData.get('reps'))],
      weight: [parseFloat(formData.get('weight').replace(',', '.'))],
      exercise_definition_id: parseInt(formData.get('exerciseId')),
      type: formData.get('type') || 'lineal'
    }
  }

  try {
    const insertedId = await insertProgress(email, newProgress)
    return insertedId
  } catch (error) {
    console.error('Error insertando el progreso', error)
    throw error
  }
}

export async function getProgress (exerciseId, workoutDay) {
  const session = await auth()
  const email = session.user.email

  const today = new Date()
  const currentDayOfWeek = today.getDay()
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

  const selectedDayIndex = daysOfWeek.indexOf(workoutDay)
  const daysDiff = selectedDayIndex - currentDayOfWeek

  const selectedDate = new Date(today)
  selectedDate.setDate(today.getDate() + daysDiff)

  const date = getFullDay(selectedDate)

  const result = await getProgressByDate(email, exerciseId, date.full)
  if (result.data) {
    const progress = result.data.map((item) => ({
      id: item.id,
      date: item.date,
      reps: item.repetitions.toString(),
      weight: item.weight.toString(),
      type: item.type
    }))

    return progress
    // updatedItems.push({ name: `${updatedItems.length + 1}ª Serie`, reps: '', weight: '', id: null })
    // setItems(updatedItems)
  }
}

export async function removeProgress (progressId) {
  try {
    await deleteProgress(progressId)
  } catch (error) {
    console.error('Error eliminando el progreso', error)
  }
}

export async function getRoutines () {
  try {
    const session = await auth()
    const email = session.user.email
    const workouts = await getUserRoutinesWithExercises(email)
    // const progress = await getUserProgressLastWeek(userEmail)
    // const workoutsWithProgress = mergeProgressWithExercises(workouts, progress)

    const totalProgress = await getUserProgressLastWeekAndThreeWeeksBefore(email)
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

export async function createRoutine (formData) {
  const session = await auth()
  const email = session.user.email

  try {
    const routine = {
      name: formData.workoutName,
      day: formData.selectedDays[0] || formData.selectedDays
    }

    const routineId = await insertRoutine(email, routine)

    const routineExercises = formData.selectedExercises.map(exercise => ({
      routine_id: routineId,
      exercise_id: exercise.id
    }))

    await insertRoutineExercise(routineExercises)

    revalidatePath('/')
    return true
  } catch (error) {
    console.error('Error insertando la rutina', error)
    return false
  }
}

export async function editRoutine (routineId, newName) {
  try {
    await updateRoutineName(routineId, newName)

    revalidatePath('/')
    return true
  } catch (error) {
    console.error('Error insertando la rutina', error)
    return false
  }
}

export async function insertExercisesRoutine (routineId, selectedExercises) {
  try {
    const routineExercises = selectedExercises.map(exercise => ({
      routine_id: routineId,
      exercise_id: exercise.id
    }))

    await insertRoutineExercise(routineExercises)
    revalidatePath('/')
    return true
  } catch (error) {
    console.error('Error insertando la rutina', error)
    return false
  }
}

export async function removeWorkout (workoutId) {
  try {
    await deleteRoutine(workoutId)
    revalidatePath('/')
    return true
  } catch (error) {
    console.error('Error eliminando el progreso', error)
    return false
  }
}

export async function addExerciseToRoutine (exercise) {
  try {
    await createExerciseToRoutine(exercise)
    revalidatePath('/')
    return true
  } catch (error) {
    console.error('Error in addExerciseToRoutine:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

export async function removeExerciseFromRoutine (exerciseId) {
  try {
    await deleteExerciseFromRoutine(exerciseId)
    revalidatePath('/')
    return true
  } catch (error) {
    console.error('Error in removeExerciseFromRoutine:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

export async function handleSeriesChangeRoutine (exerciseId, seriesValue, seriesType) {
  try {
    let updatedSeries

    if (seriesValue === 0) {
      updatedSeries = null
    } else {
      updatedSeries = `${seriesValue} x ${seriesType.toUpperCase()}`
    }

    console.log('handleSeriesChangeRoutine', exerciseId, updatedSeries)

    // Corregido el orden de los parámetros aquí
    await nullExerciseFromRoutine(exerciseId, updatedSeries)

    revalidatePath('/')
    return true
  } catch (error) {
    console.error('Error in handleSeriesChange:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }
  }
}
