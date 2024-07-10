"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signIn } from 'next-auth/react';
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios from 'axios'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
function signInPage() {

  const [isSubmitting,setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  //Zod Implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    //1st it will take schema to implement zod
    resolver : zodResolver(signInSchema),
    //2nd to set default value
    defaultValues : {
      identifier : '',
      password : ''
    }
  })

  const onSubmit = async (data:z.infer<typeof signInSchema>) =>{
    const res = await signIn('credentials',{
      redirect: false,
      identifier : data.identifier,
      password : data.password
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join SilentWhispers
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              </form>
            </Form>
            <div className="text-center mt-4">
              <p>
                Not a member?{' '}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                  Sign Up
                </Link>
              </p>
            </div>
            
        </div>
    </div>
  )
}

export default signInPage