import { getProgressChart } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// To handle a GET request to /api
export async function GET (request) {
  const userEmail = request.nextUrl.searchParams.get('email')
  console.log(userEmail)
  const chartData = await getProgressChart(userEmail)
  // Do whatever you want
  return NextResponse.json({ chartData }, { status: 200 })
}
