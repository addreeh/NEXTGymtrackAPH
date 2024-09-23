export const getCalories = (gender, age, height, weight) => {
  const tmb = getTMB(gender, age, height, weight)
  let carbs, protein, fat

  if (gender === 'male') {
    protein = weight * 2.2
    fat = weight * 0.8
    carbs = (tmb - ((protein * 4) + (fat * 9))) / 4
  }

  const macro = {
    carbs: carbs ?? 0,
    protein: protein ?? 0,
    fat: fat ?? 0
  }

  return { tmb, macro }
}

export const getTMB = (gender, age, height, weight) => {
  if (gender === 'male') {
    const tmb = (10 * weight) + (6.25 * height) - (5 * age) + 5
    return tmb * 1.55
  } else if (gender === 'female') {
    const tmb = (10 * weight) + (6.25 * height) - (5 * age) - 161
    return tmb * 1.55
  } else {
    return 0
  }
}
