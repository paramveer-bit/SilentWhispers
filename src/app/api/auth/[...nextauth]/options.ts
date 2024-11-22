import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";
import UserModel from "@/models/user.Model";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials: any): Promise<any> {

                await dbConnect()
                try {
                    const user = await UserModel.findOne({ email: credentials.identifier })
                    if (!user) {
                        throw new Error("User not found")
                    }

                    if (!user.isVerified) {
                        throw new Error("User is not verified")
                    }

                    const passwordCheck = await bcrypt.compare(credentials.password, user.password)

                    if (!passwordCheck) {
                        throw new Error("Wrong Password")
                    }

                    return user

                } catch (error: any) {
                    throw new Error(error)
                }

            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
            }
            return token
        },
        async session({ session, token }) {

            if (token) {
                session.user._id = token._id
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.isVerified = token.isVerified
                session.user.username = token.username;
            }
            return session
        }

    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: "/auth/sign-in"
    }


}



