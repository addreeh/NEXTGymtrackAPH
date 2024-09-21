import { signIn } from '@/auth'

export function LogIn ({
  provider,
  ...props
}) {
  return (
    <form
      className='w-full h-full bg-amber-100'
      action={async () => {
        'use server'
        await signIn(provider)
      }}
    >
      <button className='text-white' {...props}>Sign In</button>
    </form>
  )
}
