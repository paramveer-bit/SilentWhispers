import { NextResponse,NextRequest } from 'next/server'
// import type { NextRequest } from 'next/server'
export {default} from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'

export const config = {
  matcher: [
    '/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'
    ]
}
// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {

  const token = await getToken({req:req,secret:process.env.JWT_SECRET})
  const url = req.nextUrl
  if (token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.next(); // Proceed without redirection
  }
  if(token && 
    (
      url.pathname.startsWith('/sign-in')||
      url.pathname.startsWith('/sign-up')||
      url.pathname.startsWith('/')||
      url.pathname.startsWith('/verify')
    )
  ){
    return NextResponse.redirect(new URL('/dashboard',req.url))
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
}
 
// See "Matching Paths" below to learn more
