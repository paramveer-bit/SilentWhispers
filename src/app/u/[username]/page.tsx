'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import suggestMessages from '@/suggestMessages.json'
import Link from 'next/link'

import { Input } from "@/components/ui/input"
import { messageSchema } from '@/schemas/messageSchema'
import axios from 'axios'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Separator } from '@radix-ui/react-separator'


function Page() {
    const[sending,setIsSendindg] = useState(false)
    const[suggestMessage,setSuggestMessage] = useState([''])
    const param = useParams<{username:string}>()
    const[content,setContent] = useState("")

    const {toast} = useToast()

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    })
    const messages = [
        "What's your favorite way to relax after a long day?",
        "If you could learn any language instantly, which one would you choose and why?",
        "What's a place you've always wanted to visit, and what attracts you to it?"
    ]

    const onSubmit = async (data: z.infer<typeof messageSchema>)=>{
        setIsSendindg(true)
        try {
            const res = await axios.post('/api/send-message',{
                username : param.username,
                content : data.content
            })
            toast({
                title : "success",
                description : res.data.message,
                className : " border-2 border-green-600"
            })
            form.reset()

        } catch (error : any) {
            toast({
                title :  error.response?.data.message || "Error in Sending Message",
                variant : "destructive"
            })
        }finally{
            setIsSendindg(false)
        }
    }

    const handleMessageButton = (content : string)=>{
        setContent(content)
        form.setValue('content',content)
    }

    const handleSuggestMessage = ()=>{
        const idx = Math.floor(Math.random()*(138))
        setSuggestMessage(suggestMessages[idx]);
    }
    useEffect(()=>{handleSuggestMessage()},[])

  return (
    <div className=' flex flex-col items-center min-h-screen p-5'>
        <div className='w-full text-center text-5xl font-bold p-10'>
            <h1>Public Profile Link</h1>
        </div>
        <div className='w-[60%]'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel >Send Anonymous Message to {param.username}</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Enter the message you want to send" {...field}/>
                        </FormControl>
                        <FormMessage /> 
                        </FormItem>
                    )}
                    />
                    <div className='w-full flex'>
                        <Button type="submit" className='mx-auto' disabled={sending || form.getValues().content==''}>
                            Submit
                        </Button>
                    </div>
                </form>
                
            </Form>
        </div>
        <div className='w-[60%] m-10'>
            <Button className='mb-5' onClick={handleSuggestMessage}>Suggest Messages</Button>
            <h3>Click on the text you want to select</h3>
            <div className='w-full border-2 h-52 flex flex-col p-3 justify-between mt-2 rounded-lg'>
                {suggestMessage.map((message,index)=>(
                    <button key={index} className='bg-white text-black border-2 p-2 rounded-sm hover:bg-slate-200' onClick={()=>handleMessageButton(message)}>
                        {message}
                    </button>
                ))}
            </div>
        </div>
        <footer className='w-[60%] flex flex-col items-center space-y-4 border-t-2 pt-6 border-slate-300'>
            <h1 className=' font-semibold'>Get Your Message Board</h1>
            <Link href="/sign-up" ><Button>Get Your Account</Button></Link>
        </footer>

    </div>
  )
}

export default Page