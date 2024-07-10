import { z } from "zod";
import UserModel, { User } from "@/models/user.Model";
import { messageSchema } from "@/schemas/messageSchema";
import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/user.Model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";



export async function DELETE(req:NextRequest,{params}:{params:{messageid:string}}){
    const messageid = params.messageid
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user 
    if(!session || !session.user){
        return NextResponse.json({
            success : false,
            message : "Not Authenticated"
        },{status:401})
    }

    try {
        const res = await UserModel.updateOne(
            {_id:user._id},
            {$pull : {messages:{_id:messageid}}}
        )
        if(res.modifiedCount==0){
            return NextResponse.json({
                success : false,
                message : "Error in deleting message or not found"
            },{status:404})
        }
        return NextResponse.json({
            success : true,
            message : "Successfully deleted"
        },{status:200})

    } catch (error) {
        return NextResponse.json({
            success : false,
            message : "Error in deleting message",
            error:error
        },{status:500})
    }
}