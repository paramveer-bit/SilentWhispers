'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { string } from 'zod'
import dynamic from 'next/dynamic'
import * as z from 'zod'

function VerifyAccount() {
    const router = useRouter()
    const param = useParams<{username : string}>()
    const {toast} = useToast()
    const[resend,setResend] = useState(false)

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver : zodResolver(verifySchema),

    })

    const onSubmit = async(data:z.infer<typeof verifySchema>)=>{
        try {
            const res = await axios.post('/api/verify-code',{
                username: param.username,code:data.code
            })

            toast({
                title:"Success",
                description : res.data.message,
                className : " border-2 border-green-600"
            })
            router.replace('/sign-in')
        } catch (error: any) {
          toast({
            title:"Failed",
            description : error.response?.data.message,
            variant : "destructive"
        })
        }
    }

    const handleResend = async()=>{
      setResend(true)
      try {
          const res = await axios.post('/api/resend-code',{
              username: param.username
          })

          toast({
              title:"Success",
              description : res.data.message,
              className : " border-2 border-green-600"
          })
      } catch (error: any) {
        toast({
          title:"Failed",
          description : error.response?.data.message,
          variant : "destructive"
      })
      }finally{
        setResend(false)
      }
  }



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Verify Account
            </h1>
            <p className="mb-4">Enter verify code</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Verify Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-between'>
                <Button type="submit">Submit</Button>
                <Button variant="destructive" type='button' onClick={handleResend} disabled={resend} >Resend Email</Button>
              </div>
            </form>
          </Form>
        </div>
    </div>
  )
}

export default VerifyAccount