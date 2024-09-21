'use server'

import { auth } from '@/auth'
import { deleteProgress, getProgressByDate, insertProgress } from './supabase'
import { getFullDay } from './date'

export async function handleProgress (formData) {
  const session = await auth()
  const email = session.user.email

  const today = new Date()
  const currentDayOfWeek = today.getDay() // 0 (Domingo) a 6 (Sábado)
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
      weight: [parseInt(formData.get('weight1')), parseInt(formData.get('weight2'))],
      exercise_definition_id: parseInt(formData.get('exerciseId')),
      type: formData.get('type') || 'lineal'
    }
  } else {
    newProgress = {
      date: date.full,
      repetitions: [parseInt(formData.get('reps'))],
      weight: [parseInt(formData.get('weight'))],
      exercise_definition_id: parseInt(formData.get('exerciseId')),
      type: formData.get('type') || 'lineal'
    }
  }

  await insertProgress(email, newProgress)
}

export async function getProgress (exerciseId) {
  const session = await auth()
  const email = session.user.email

  const day = getFullDay(new Date())
  const result = await getProgressByDate(email, exerciseId, day.full)
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
  await deleteProgress(progressId)
}
