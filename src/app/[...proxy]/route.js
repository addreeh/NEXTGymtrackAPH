import { auth } from '@/auth'

function stripContentEncoding (result) {
  const responseHeaders = new Headers(result.headers)
  responseHeaders.delete('content-encoding')

  return new Response(result.body, {
    status: result.status,
    statusText: result.statusText,
    headers: responseHeaders
  })
}

async function handler (request) {
  const session = await auth()

  const headers = new Headers(request.headers)
  headers.set('Authorization', `Bearer ${session?.accessToken}`)

  const backendUrl =
    process.env.THIRD_PARTY_API_EXAMPLE_BACKEND ??
    'https://authjs-third-party-backend.authjs.dev'

  const url = request.nextUrl.href.replace(request.nextUrl.origin, backendUrl)
  const result = await fetch(url, { headers, body: request.body })

  return stripContentEncoding(result)
}

export const dynamic = 'force-dynamic'

export { handler as GET, handler as POST }
