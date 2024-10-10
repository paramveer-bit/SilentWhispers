import {resend } from "@/lib/resendEmail"
import { ApiResponse } from "@/types/ApiResponse"

    
export async function sendVerificationMail(
    email :string,
    username : string,
    verificationCode : string
) : Promise<any> {
   
    try {
        const html = `  <h3>Hello User <b>${username}</b> ,Congrats on regestring on SilentWhispers.</h3>
        <p>Your Code is</p> <h1>${verificationCode}</h1>
        `
        const res = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Silent  Whispers verification code',
            html: html
          });
          console.log(res)
        return {success:true, message: "Verification email sent successfully"}
    } catch (error) {
        return {success: false, message: "Error in sending verification email" }
    }
}

