import { z } from "zod";
import UserModel from "@/models/user.Model";
import { userNameValidation } from "@/schemas/signUpSchema";
import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function POST(req:NextRequest){
    await dbConnect();

    try {
        const {username,code} = await req.json();

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})
        if(!user){
            return NextResponse.json({
                message : "User does not exists",
                success: false
            },{status:401})
        }
        if(user.isVerified){
            return NextResponse.json({
                message : "User already verified",
                success: false
            },{status:401})
        }
        if(user.verifyCode!=code){
            return NextResponse.json({
                message : "Wrong verify code entered",
                success: false
            },{status:401})
        }
        if(user.verifyCodeExpiryTime<new Date()){
            return NextResponse.json({
                message : "Verify Code expired ",
                success: false
            },{status:401})
        }

        user.isVerified = true;
        await user.save()

        return NextResponse.json({
            message : "User verified success fully ",
            success: true
        },{status:200})

        
    } catch (error) {
        return NextResponse.json({
            message : "Error on verifying user",
            success: false
        },{status:401})
    }
}



