import { z } from "zod";
import UserModel from "@/models/user.Model";
import { userNameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

const UsernameQuerySchema = z.object({
    username: userNameValidation
})

export async function GET(req: NextRequest) {
    await dbConnect()

    try {
        const { searchParams } = new URL(req.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        //Validation
        const res = UsernameQuerySchema.safeParse(queryParam)

        if (!res.success) {
            const usernameErrors = res.error.format().username?._errors || []
            return NextResponse.json({
                success: false,
                message: usernameErrors[0],
            }, { status: 400 })
        }


        const { username } = res.data

        const user = await UserModel.findOne({ username, isVerified: true })
        if (user) {
            return NextResponse.json({
                success: true,
                message: "User name already taken"
            }, { status: 200 })
        }

        return NextResponse.json({
            success: true,
            message: "User name available"
        }, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "error in checking unique user"
        }, { status: 500 })
    }
}
