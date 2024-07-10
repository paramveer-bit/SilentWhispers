"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ApiResponse } from "@/types/ApiResponse"


const signInPage = ()=> {

  const [username,setUsername] =  useState('')
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsername,setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername,300)
  const { toast } = useToast()
  const router = useRouter()

  //Zod Implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    //1st it will take schema to implement zod
    resolver : zodResolver(signUpSchema),
    //2nd to set default value
    defaultValues : {
      username : '',
      email : '',
      password : ''
    }
  })

  useEffect(()=>{
    const checkUsernameUnique = async()=>{
      if(!username) setUsernameMessage('')
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const res = await axios.get(`/api/chech-username-unique?username=${username}`)
          let message = res.data.message
          setUsernameMessage(message)
        } catch (error : any) {
          setUsernameMessage(error.response?.data.message || "Error checking username")
        }finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[username])

  const onSubmit = async (data:z.infer<typeof signUpSchema>) =>{
    setIsSubmitting(true)
    try {
      const res = await axios.post('/api/sign-up',data)
      toast({
        title : 'Success',
        description : res.data.message,
        className : " border-2 border-green-600"
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error : any) {
      toast({
        title : 'Failed',
        description : error.response?.data.message || "Error in SignUp",
        variant : "destructive"
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join SilentWhispers
            </h1>
            <p className="mb-4">Sign up to start your anonymous advanture</p>
          </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} 
                        onChange={(e)=>{
                            debounced(e.target.value)
                          field.onChange(e)
                        }}  
                      />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin"/>}
                    <p className={usernameMessage==="User name available"?"text-green-500":"text-red-600"}>
                      {usernameMessage}
                    </p>
                    <FormDescription> 
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field}/>
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
              <Button type="submit" disabled={isSubmitting}>
                {
                  isSubmitting?(
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                    </>
                  ):('SignUp')
                }
              </Button>
              </form>
            </Form>
            <div className="text-center mt-4">
              <p>
                Already a member?{' '}
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                  Sign in
                </Link>
              </p>
            </div>
            
        </div>
    </div>
  )
}

export default signInPage