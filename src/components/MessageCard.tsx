'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/models/user.Model"
import axios from "axios"
import { useToast } from "./ui/use-toast"
  
type MessageCardProps = {
    message : Message,
    onMessageDelete : (messageId:string) => void
}



function MessageCard( {message,onMessageDelete}:MessageCardProps) {

    const {toast} = useToast()
    const dayjs = require('dayjs')


    const handelDeleteConfirm = async ()=>{
        const res = await axios.delete(`/api/delete-message/${message._id}`)
        toast({
            title : res.data.message,
            className : " border-2 border-green-600"
        })
        onMessageDelete(String(message._id))
    }

  return (
    <Card>
        <CardHeader className=" justify-between h-full">
            <div className="flex justify-between items-center align-top">
                <CardTitle className="overflow-hidden text-lg w-[70%]">{message.content}</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div className="h-full align-top">
                            <Button variant="destructive"><X className="w-5 h-5 align-top"/>
                                Delete
                            </Button>
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently the current message.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handelDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <div className="text-sm ">
                {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </div>
        </CardHeader>
        
    </Card>
  )
}

export default MessageCard