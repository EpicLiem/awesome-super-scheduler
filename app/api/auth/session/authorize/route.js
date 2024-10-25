import 'dotenv/config';
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import {EmailParams, MailerSend, Recipient, Sender} from "mailersend";

export async function GET(request) {
    const req = request.json()

    if (await bcrypt.compare(req.email + req.digits, cookies().get('pendingtoken'))) {
        const sessionid = await bcrypt.hash('Authorized' + req.email)
        return new Response('Authorized', {
            status: 200,
            headers: { 'Set-Cookie': `token=${sessionid}` },
        })
    } else {
        return new Response('Unauthorized', {
            status: 200,
        })
    }
}