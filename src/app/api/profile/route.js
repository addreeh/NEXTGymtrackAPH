import { auth } from '@/auth'
import { getCalories } from '@/lib/calories'
import { getUserByEmail, getWeightProgress } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// To handle a GET request to /api
export async function GET (request) {
  const session = await auth()
  const userEmail = session.user.email
  const weight = await getWeightProgress(userEmail)
  const weightData = weight.weightProgress
  const user = await getUserByEmail(userEmail)
  const calories = getCalories(user.gender, user.age, user.height, user.weight)
  const nutritionData = { ...user, ...calories }

  return NextResponse.json({ weightData, nutritionData }, { status: 200 })
}
