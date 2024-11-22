import UserModel from "@/models/user.Model";
import { sendVerificationMail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    await dbConnect()

    try {

        const { email, password, username } = await req.json()

        const verifiedUser = await UserModel.findOne({ email: email.toLowerCase(), isVerified: true })

        if (verifiedUser) {
            return NextResponse.json({ message: "Email already exists", success: false }, { status: 400 })
        }

        const userByemail = await UserModel.findOne({ email: email.toLowerCase() })

        const verifyToken = Math.floor(100000 + Math.random() * 900000).toString()
        const expiry = new Date()
        expiry.setHours(expiry.getHours() + 1);
        const res = NextResponse

        if (userByemail) {
            if (userByemail.isVerified) {
                return NextResponse.json({ message: "Email already exists", success: false }, { status: 400 })
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            userByemail.password = hashedPassword
            userByemail.verifyCode = verifyToken
            userByemail.isVerified = false
            userByemail.verifyCodeExpiryTime = expiry
            await userByemail.save()
            res.json({ data: userByemail })
        }
        else {
            const hashed = await bcrypt.hash(password, 10);



            const user = new UserModel({
                email: email.toLowerCase(),
                username,
                password: hashed,
                isVerified: false,
                verifyCode: verifyToken,
                verifyCodeExpiryTime: expiry,
                messages: [],
                isAcceptingMessage: false
            })

            await user.save()
            res.json({ data: user })

        }

        //sendverification email
        const emailResponse = await sendVerificationMail(email, username, verifyToken)
        if (!emailResponse.success) {
            return NextResponse.json({ message: "Error in sending mail" }, { status: 400 })
        }

        return res.json({ message: "Verification mail sent", success: true }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Error in sing-up" }, { status: 401 })
    }

} 
