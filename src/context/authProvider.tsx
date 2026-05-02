'use client'

import { SessionProvider } from "next-auth/react"

export default function authProvider({
  children,

}:{
  children: React.ReactNode
}) {
 
  return (
    <SessionProvider >
      {children}
    </SessionProvider>
  )
}

//anything wrapped inside this component will have access to session and auth features of next auth
//eg. <authProvider><Component1/><Component2/></authProvider><Component3/>  1,2 can use useSession() to get session data but 3 can't get