'use server'

import { auth } from '@/auth'
import { deleteProgress, getProgressByDate, insertProgress, insertRoutine, insertRoutineExercise } from './supabase'
import { getFullDay } from './date'

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

export async function createRoutine (formData) {
  const session = await auth()
  const email = session.user.email
  console.warn(formData)

  try {
    const routine = {
      name: formData.workoutName,
      day: formData.selectedDays[0] || formData.selectedDays
    }

    console.log('R', routine)

    const routineId = await insertRoutine(email, routine)

    console.log('RID', routineId)

    const routineExercises = formData.selectedExercises.map(exercise => ({
      routine_id: routineId,
      exercise_id: exercise.id
    }))

    await insertRoutineExercise(routineExercises)

    return true
  } catch (error) {
    console.error('Error insertando la rutina', error)
    return false
  }
}
