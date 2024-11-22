import MailHelper from "@/helpers/nodeMailer"
import EmailTemplate from "@/helpers/EmailTemplate"


export async function sendVerificationMail(
    email: string,
    username: string,
    verificationCode: string
): Promise<any> {

    try {
        const html = `  <h3>Hello User <b>${username}</b> ,Congrats on regestring on SilentWhispers.</h3>
        <p>Your Code is</p> <h1>${verificationCode}</h1>
        `

        console.log(process.env.EMAIL)
        console.log(process.env.PASSWORD)
        const res = await MailHelper({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Silent  Whispers verification code',
            html: EmailTemplate({ username, code: verificationCode }),
            text: `Your verification code is ${verificationCode}`
        });
        console.log(res)
        return { success: true, message: "Verification email sent successfully" }
    } catch (error) {
        return { success: false, message: "Error in sending verification email" }
    }
}

