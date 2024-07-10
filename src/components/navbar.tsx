'use client'
import Link from "next/link"

import { useSession,signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button"

function Navbar() {
    const {data : session} = useSession()

    const user :User = session?.user

  return (
    <nav className="p-4 md:p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-3xl font-bold mb-4 md:mb-0">SilentWhispers</a>
        {
            session?(
                <>
                    <span className="mr-4 text-lg font-semibold">Welcome , {user.username || user.email}</span>
                    <Button className="w-full md:w-auto" onClick={()=>signOut()} variant="destructive">SignOut</Button>
                </>
            ):(
                <Link href='/sign-in'>
                    <Button className="w-full md:w-auto">Login</Button>
                </Link>
            )
        }
        </div>
    </nav>
  )
}

export default Navbar