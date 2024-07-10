import UserModel from "@/models/user.Model";
import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";


export async function POST(req:NextRequest){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message : "User should be logged in before changing message preferance"
        },{status:401})
    }
    const userId = user._id
    const {acceptMessages} = await req.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage : acceptMessages,
        },{new:true})

        if(!updatedUser){
            return NextResponse.json({
                success: false,
                message : "Error in changing message preferance"
            },{status:401})
        }

        return NextResponse.json({
            success: true,
            message : "Successfully changed message preferance"
        },{status:200})


    } catch (error) {
        return NextResponse.json({
            success: false,
            message : "Fail to change accept message"
        },{status:500})
    }
    
    
}

export async function GET(req:NextRequest){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message : "User should be logged in before changing message preferance"
        },{status:401})
    }
    const userId = user._id

    try {
        const updatedUser = await UserModel.findById(userId)

        if(!updatedUser){
            return NextResponse.json({
                success: false,
                message : "Error in checking message preferance"
            },{status:401})
        }

        return NextResponse.json({
            success: true,
            message : "Successfully checked message preferance",
            isAcceptingMesseges : updatedUser.isAcceptingMessage
        },{status:200})


    } catch (error) {
        return NextResponse.json({
            success: false,
            message : "Fail to check accept message"
        },{status:500})
    }
    
    
}


