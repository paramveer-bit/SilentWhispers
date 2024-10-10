'use client'
import Link from "next/link"
import { signIn } from 'next-auth/react';
import { useSession,signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"




function Navbar() {
    const router = useRouter()

    const { toast } = useToast()

    const {data : session} = useSession()

    const user :User = session?.user

    const demo = async ()=>{
        const res = await signIn('credentials',{
            redirect: false,
            identifier : "demo@gmail.com",
            password : "12345678"
          })
    
          if(res?.error){
            if(res.error == 'CredentialsSignin'){
              toast({
                title : 'Login Failed',
                description : 'Incorect username or passeord',
                variant : 'destructive'
              })
            }
            else{
              toast({
                description: res.error,
                variant: 'destructive',
            })
            }
          }
          if (res?.url) {
            router.replace('/dashboard');
          }
    }

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
                <div className="space-x-3">
                    <Link href='/sign-in'>
                        <Button className="w-full md:w-auto">Login</Button>
                    </Link>
                    <Button className="w-full md:w-auto" onClick={demo} variant="destructive">Trial</Button>
                </div>
            )
        }
        </div>
    </nav>
  )
}

export default Navbar