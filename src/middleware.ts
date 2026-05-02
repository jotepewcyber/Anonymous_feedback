import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
// - Instead of writing your own middleware function, you’re simply re-exporting the default export from next-auth/middleware.
// - This makes Next.js automatically use NextAuth’s middleware when handling requests.

// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt"



// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token=await getToken({req:request})
    const url=request.nextUrl

    if(token && (
        // url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') 
      
    )) 
    {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }


    if(!token &&(
        url.pathname.startsWith('/dashboard')
    )){
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
 
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',   //:path* means anything after dashboard
    '/verify/:path*'

]
}