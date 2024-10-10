import { z } from "zod";
import UserModel from "@/models/user.Model";
import { userNameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { sendVerificationMail } from "@/helpers/sendVerificationEmail";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const { username } = await req.json();

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })
        if (!user) {
            return NextResponse.json({
                message: "User does not exists",
                success: false
            }, { status: 401 })
        }
        if (user.isVerified) {
            return NextResponse.json({
                message: "User already verified",
                success: false
            }, { status: 401 })
        }

        const verifyToken = Math.floor(100000 + Math.random() * 900000).toString()
        const expiry = new Date()
        expiry.setHours(expiry.getHours() + 1);
        user.verifyCode = verifyToken
        user.verifyCodeExpiryTime = expiry
        await user.save()

        const emailResponse = await sendVerificationMail(user.email, username, verifyToken)
        if (!emailResponse.success) {
            return NextResponse.json({ message: "Error in sending mail" }, { status: 400 })
        }

        return NextResponse.json({ message: "Verification Code sent", success: true }, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            message: "Error on resending code",
            success: false
        }, { status: 401 })
    }
}



