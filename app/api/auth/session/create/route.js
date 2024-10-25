import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import bcrypt from 'bcrypt'
import {console} from "next/dist/compiled/@edge-runtime/primitives";
import {cookies} from "next/headers";

export async function GET(request) {
    const searchparams = request.nextUrl.searchParams
    const mailerSend = new MailerSend({
        apiKey: process.env.API_KEY,
    });

    const sentFrom = new Sender("no-reply@weightroom.epicliem.com", "GFS Weightroom");

    const recipients = [
        new Recipient(searchparams.get('email'), "User")
    ];
    let buf = new Uint8Array(6);
    crypto.getRandomValues(buf)
    const digits = buf.map((x) => (x % 10).toString())
    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("Your Code")
        .setText("Your code is:" +digits.join());
    await mailerSend.email.send(emailParams);
    const sessionid = await bcrypt.hash(searchparams.get('email') + digits.join(), process.env.SALT)
    if (await bcrypt.compare(searchparams.get('email') + digits.join(), sessionid)) {
        console.log('verified')
    } else {
        console.log('womp womp')
    }

    console.log(digits.join())
    console.log("sessionid" + sessionid)
    return new Response('Authorized', {
        status: 200,
        headers: { 'Set-Cookie': `pendingtoken=${sessionid}` },
    })
}