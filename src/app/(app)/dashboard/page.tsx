'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Message } from "@/models/user.Model"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"


function DashboardPage() {
  const[messages,setMessages] = useState<Message[]>([])
  const[isLoading,setIsLoading] = useState(false)
  const[isSwitchLoading,setIsSwitchLoading] = useState(false)

  const {toast} = useToast()

  const handleDeleteMessage = (messageId:string)=>{
    setMessages(messages.filter((message)=>message._id!==messageId))
  }

  const{data:session} = useSession()

  const form = useForm({
    resolver : zodResolver(acceptMessageSchema)
  })

  const {register,watch,setValue} = form

  const acceptMessages = watch('acceptMessages')

  const featchAcceptMessage = useCallback(async()=>{
    setIsSwitchLoading(true)
    try {
      const res = await axios.get('/api/accept-messages')
      setValue('acceptMessages',res.data.isAcceptingMesseges)
    } catch (error) {
      toast({
        title : "Error",
        description : "Fail to fetch Accept message status",
      })
    } finally{
      setIsSwitchLoading(false)
    }
  },[setValue,toast])

  const fetchMessages = useCallback(async(refresh:boolean = false)=>{
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const res = await axios.get('/api/get-messages')
      setMessages(res.data.message || [])

      if(refresh){
        toast({
          title : "Showing latest messages",
          className : " border-2 border-green-600"
        })
      }

    } catch (error) {
        toast({
          title : "Error",
          description : "Fail to fetch message inside"
        })
    } finally{
      setIsLoading(false)
      setIsSwitchLoading(false)

    }
  },[setIsLoading,setMessages,toast])

  useEffect(()=>{
    if(!session || !session.user) return
    fetchMessages()
    featchAcceptMessage()
  },
    [session,setValue,featchAcceptMessage,fetchMessages,toast]
  )

  //handel swich chnage
  const handleSwitchChange = async()=>{
    try {
      const res = await axios.post('/api/accept-messages',{
        acceptMessages : !acceptMessages
      })
      setValue('acceptMessages',!acceptMessages)
      toast({
        title : res.data.message,
        className : " border-2 border-green-600"
      })
    } catch (error) {
        toast({
          title : "Error",
          description : "Fail to fetch message",
          variant : "destructive"
        })    
    }
  }

  if(!session|| !session.user){
    return <div>Please Login</div>
  }

  const copyToClipboard = () =>{
    navigator.clipboard.writeText(profileUrl)
    toast({
      title:"URL Copied",
      description : "Profiel url copied successfully",
      className : " border-2 border-green-600"
    })
  }

  const {username} = session.user
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages?.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default DashboardPage