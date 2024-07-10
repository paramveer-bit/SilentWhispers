import { z } from "zod";
import UserModel from "@/models/user.Model";
import { messageSchema } from "@/schemas/messageSchema";
import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/user.Model";


export async function POST(req:NextRequest){
    await dbConnect();

    const {username,content} = await req.json();

    try {

        const user = await UserModel.findOne({username})
        if(!user){
            return NextResponse.json({
                success : false,
                message : 'User Not found'
            },{status:404})
        }

        if(!user.isAcceptingMessage){
            return NextResponse.json({
                success : false,
                message : 'User Not accepting the messages'
            },{status:403})
        }

        const newMessages = {content,createdAt:new Date()}

        user.messages.push(newMessages as Message)
        await user.save()

        return NextResponse.json({
            success : true,
            message : 'Message send successfully'
        },{status:200})
        
    } catch (error) {
        return NextResponse.json({
            success : false,
            message : 'Error in sending messgae'
        },{status:500})
    }

}
