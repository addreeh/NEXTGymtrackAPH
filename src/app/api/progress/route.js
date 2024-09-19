import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { auth } from '@/auth'

export async function POST (request) {
  const session = await auth()
  const userEmail = session.user.email
  console.log(userEmail)
  const supabase = createRouteHandlerClient({ cookies })

  const newProgress = await request.json()
  console.log('nre', newProgress)

  const data = 0

  // const { data, error } = await supabase
  //   .from('progress')
  //   .insert(newProgress)
  //   .select()

  // if (error) {
  //   return NextResponse.json({ error: error.message }, { status: 500 })
  // }

  return NextResponse.json(data)
}
