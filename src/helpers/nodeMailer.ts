import nodemailer from "nodemailer";
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

type Mail = {
    to: string,
    subject: string,
    text: string,
    html: string,
    from: string
}

// async..await is not allowed in global scope, must use a wrapper
async function mail({ to, subject, text, html, from }: Mail) {
    console.log("starting")
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: from, // sender address
        to: to,
        subject: subject,
        text: text,
        html: html,
    });

    console.log("Message sent: %s", info.messageId);
    return info.messageId
}


export default mail
