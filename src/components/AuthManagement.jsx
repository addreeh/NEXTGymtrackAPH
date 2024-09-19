import { auth, signIn, signOut } from '@/auth'

export async function AuthManagement () {
  const session = await auth()
  if (!session?.user) return <SignIn />
  return (
    <SignOut />
  )
}

export function SignIn ({
  provider,
  ...props
}) {
  return (
    <form
      action={async () => {
        'use server'
        await signIn(provider)
      }}
    >
      <button className='text-white' {...props}>Sign In</button>
    </form>
  )
}

export function SignOut (props) {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
      className='w-full'
    >
      <button variant='ghost' className='w-full p-0' {...props}>
        Sign Out
      </button>
    </form>
  )
}
