import UserModel from "@/models/user.Model";
import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req:NextRequest){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message : "Not Authenticated"
        },{status:401})
    }
    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        
        const messages = await UserModel.aggregate([
            {
                $match : {
                    _id : userId
                }
            },
            {
                $unwind : '$messages'
            },
            {
                $sort : {
                    'messages.createdAt' : -1,
                }
            },
            {
                $group : {
                    _id : '$_id',
                    messages : {$push:'$messages'}
                }
            }
        ])

        if(messages?.length<0){
            return NextResponse.json({
                success: false,
                message : "Error in getting all messages"
            },{status:401})
        }

        return NextResponse.json({
            success: true,
            message : messages[0]?.messages
        },{status:200})

        


    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message : "Fail to change accept message"
        },{status:500})
    }
    
    
}