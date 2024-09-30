import { getExercises } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// To handle a GET request to /api
export async function GET (request) {
  const exercises = await getExercises()
  return NextResponse.json({ exercises }, { status: 200 })
}
