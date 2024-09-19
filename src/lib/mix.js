export function capitalizeWords (str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatTitle (title) {
  return title.replace(/\+/g, ' + ')
}

export function mergeProgressWithExercises (workouts, progress) {
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
