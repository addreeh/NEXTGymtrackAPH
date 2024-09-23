import { getCalories } from '@/lib/calories'
import { getUserByEmail, getWeightProgress } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// To handle a GET request to /api
export async function GET (request) {
  // const userEmail = request.nextUrl.searchParams.get('email')
  const userEmail = 'adrianpinohidalgo@gmail.com'
  const weight = await getWeightProgress(userEmail)
  const weightData = weight.weightProgress
  const user = await getUserByEmail(userEmail)
  const calories = getCalories(user.gender, user.age, user.height, user.weight)
  const nutritionData = { ...user, ...calories }
  console.log(nutritionData)

  return NextResponse.json({ weightData, nutritionData }, { status: 200 })
}
