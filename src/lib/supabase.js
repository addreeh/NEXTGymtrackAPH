import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
  // 'https://zgwopvltifyeavkolwqq.supabase.co',
  // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnd29wdmx0aWZ5ZWF2a29sd3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM1Nzc2MzYsImV4cCI6MjAzOTE1MzYzNn0.kRh0-VyVXaxgnPmj9M0rgVtYuLaQHIM7brVVODsfBrg'
)

export async function getUsers () {
  const { data, error } = await supabase
    .from('users')
    .select()

  if (error != null) throw new Error(error.message)
  return data
}

export async function getUserRoutines (userId) {
  const { data, error } = await supabase
    .from('routines')
    .select('*')
    .eq('user_id', userId)

  if (error != null) throw new Error(error.message)
  return data
}

export async function getUserRoutinesWithExercises (email) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (userError != null) throw new Error(userError.message)
  if (userData == null) throw new Error('User not found')

  const userId = userData.id

  const { data, error } = await supabase
    .from('routines')
    .select(`
      name,
      day,
      routine_exercises (
        series,
        rest,
        exercise_definitions (
          id,
          name,
          muscle_group,
          exercise_type
        )
      )
    `)
    .eq('user_id', userId)

  if (error != null) throw new Error(error.message)
  return data
}

export async function getUserProgressLastWeek (email) {
  const currentDate = new Date()
  const currentDayOfWeek = currentDate.getDay()
  const daysSinceLastSunday = currentDayOfWeek

  const lastSunday = new Date(currentDate)
  lastSunday.setDate(currentDate.getDate() - daysSinceLastSunday)

  const previousSunday = new Date(lastSunday)
  previousSunday.setDate(lastSunday.getDate() - 7)

  const lastSaturday = new Date(previousSunday)
  lastSaturday.setDate(previousSunday.getDate() + 6)

  const formatDate = (date) => date.toISOString().split('T')[0]

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (userError != null) throw new Error(userError.message)
  if (userData == null) throw new Error('User not found')

  const userId = userData.id

  const { data, error } = await supabase
    .from('progress')
    .select(`
    date,
    repetitions,
    weight,
    exercise_definitions (
      id,
      name
    )
  `)
    .eq('user_id', userId)
    .gte('date', formatDate(previousSunday))
    .lte('date', formatDate(lastSaturday))

  if (error) throw new Error(error.message)

  return data.map((entry) => ({
    date: entry.date,
    repetitions: entry.repetitions,
    weight: entry.weight,
    exercise_id: entry.exercise_definitions.id,
    exercise_name: entry.exercise_definitions.name
  }))
}

export async function getUserProgressLastWeekAndThreeWeeksBefore (email) {
  try {
    const currentDate = new Date()
    const currentDayOfWeek = currentDate.getDay()
    const daysSinceLastSunday = currentDayOfWeek

    // Calcular la fecha del último domingo
    const lastSunday = new Date(currentDate)
    lastSunday.setDate(currentDate.getDate() - daysSinceLastSunday)

    // Calcular la fecha del domingo anterior a la última semana (hace una semana)
    const previousSunday = new Date(lastSunday)
    previousSunday.setDate(lastSunday.getDate() - 7)

    // Calcular la fecha del sábado anterior (hace una semana)
    const lastSaturday = new Date(previousSunday)
    lastSaturday.setDate(previousSunday.getDate() + 6)

    // Calcular la fecha del domingo de tres semanas antes
    const threeWeeksAgoSunday = new Date(lastSunday)
    threeWeeksAgoSunday.setDate(lastSunday.getDate() - 21)

    // Calcular la fecha del sábado de tres semanas antes
    const threeWeeksAgoSaturday = new Date(threeWeeksAgoSunday)
    threeWeeksAgoSaturday.setDate(threeWeeksAgoSunday.getDate() + 6)

    const formatDate = (date) => date.toISOString().split('T')[0]

    // Obtener el ID del usuario por email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (userError) throw new Error(userError.message)
    if (!userData) throw new Error('User not found')

    const userId = userData.id

    // Combina las dos consultas en una sola
    const { data: progressData, error: progressError } = await supabase
      .from('progress')
      .select(`
    date,
    repetitions,
    weight,
    exercise_definitions (
      id,
      name
    )
  `)
      .eq('user_id', userId)
      .gte('date', formatDate(threeWeeksAgoSunday))
      .lte('date', formatDate(lastSaturday))

    if (progressError) throw new Error(progressError.message)

    // Procesa los datos para separarlos en lastWeek y threeWeeksAgo
    const lastWeek = progressData
      .filter(entry => new Date(entry.date) >= previousSunday && new Date(entry.date) <= lastSaturday)
      .map(formatEntry)

    const threeWeeksAgo = progressData
      .filter(entry => new Date(entry.date) >= threeWeeksAgoSunday && new Date(entry.date) < previousSunday)
      .map(formatEntry)

    return { lastWeek, threeWeeksAgo }
  } catch (error) {
    console.error('Error in getUserProgressLastWeekAndThreeWeeksBefore:', error)
    throw new Error('Failed to fetch user progress data')
  }
}

function formatEntry (entry) {
  return {
    date: entry.date,
    repetitions: entry.repetitions,
    weight: entry.weight,
    exercise_id: entry.exercise_definitions.id,
    exercise_name: entry.exercise_definitions.name
  }
}

export async function getProgressChart (email) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (userError != null) throw new Error(userError.message)
  if (userData == null) throw new Error('User not found')

  const userId = userData.id

  const { data, error } = await supabase
    .from('progress')
    .select(`
      id,
      date,
      repetitions,
      weight,
      exercise_definitions (
        id,
        name
      )
    `)
    .eq('user_id', userId)

  if (error != null) throw new Error(error.message)

  return data.map((entry) => ({
    date: entry.date,
    repetitions: entry.repetitions,
    weight: entry.weight,
    exercise_id: entry.exercise_definitions.id,
    exercise_name: entry.exercise_definitions.name
  }))
}

export async function getExercisesChart () {
  const { data, error } = await supabase
    .from('exercise_definitions')
    .select('*')

  if (error != null) throw new Error(error.message)
  return data
}

export async function getProgressByDate (email, exerciseId, date) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (userError != null) throw new Error(userError.message)
  if (userData == null) throw new Error('User not found')

  const userId = userData.id

  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_definition_id', exerciseId)
    .eq('date', date)

  return { data, error }
}

export async function insertProgress (email, newProgress) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (userError != null) throw new Error(userError.message)
  if (userData == null) throw new Error('User not found')

  const userId = userData.id

  newProgress.user_id = userId

  const { data, error } = await supabase
    .from('progress')
    .insert(newProgress)
    .select()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function updateProgress (id, updatedProgress) {
  const { error } = await supabase
    .from('progress')
    .update(updatedProgress)
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}

export async function deleteProgress (id) {
  const { error } = await supabase
    .from('progress')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}

export async function insertUser (user) {
  const { error } = await supabase
    .from('users')
    .insert(user)

  if (error != null) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getUser (email) {
  const { data } = await supabase
    .from('users')
    .select(`
      id,
      email,
      gender,
      age,
      weight,
      height
    `)
    .eq('email', email)
    .single()

  if (data) return data
  return null
}

export async function updateUser (email, updatedData) {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update(updatedData)
      .eq('email', email)
      .select()

    if (userError != null) {
      throw new Error('Error updating user')
    }

    if (updatedData.weight) {
      const { data: weightData, error: weightError } = await supabase
        .from('weight_progress')
        .insert({
          user_id: userData[0].id,
          weight: updatedData.weight
        })

      if (weightError != null) {
        throw new Error('Error inserting weight')
      }

      return { userData, weightData }
    }

    return { userData }
  } catch (error) {
    console.error('Error updating user:', error)
    return { error }
  }
}

export async function getWeightProgress (email) {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (userError != null) {
      throw new Error('Error fetching user')
    }

    const { data: weightProgress, error: weightError } = await supabase
      .from('weight_progress')
      .select('date, weight')
      .eq('user_id', user.id)
      .order('date', { ascending: true })

    if (weightError != null) {
      throw new Error('Error fetching weight progress')
    }

    return { data: weightProgress }
  } catch (error) {
    console.error('Error fetching weight progress:', error)
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
  }
}

export async function getProgressByMuscleGroup (userId) {
  try {
    const { data: muscleGroupData, error: muscleGroupError } = await supabase
      .from('progress')
      .select(`
        exercise_definitions (
          muscle_group
        ),
        repetitions,
        weight
      `)
      .eq('user_id', userId)

    if (muscleGroupError != null) throw new Error(muscleGroupError.message)
    const muscleGroupTotals = muscleGroupData.reduce((acc, entry) => {
      const muscleGroup = entry.exercise_definitions?.muscle_group
      const totalWeight = (entry.repetitions ?? 0) * (entry.weight ?? 0)

      if (muscleGroup === null || muscleGroup === undefined) return acc

      if (!acc[muscleGroup]) {
        acc[muscleGroup] = 0
      }
      acc[muscleGroup] += totalWeight

      return acc
    }, {})

    const grandTotal = Object.values(muscleGroupTotals).reduce((sum, weight) => sum + weight, 0)

    const result = Object.entries(muscleGroupTotals).map(([muscleGroup, totalWeight]) => ({
      muscle_group: muscleGroup,
      total_weight: totalWeight,
      percentage: (totalWeight / grandTotal) * 100
    }))

    return result
  } catch (error) {
    console.error('Error fetching progress by muscle group:', error)
    return []
  }
}
