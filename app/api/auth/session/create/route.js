import 'dotenv/config';
import bcrypt from 'bcrypt'
import {console} from "next/dist/compiled/@edge-runtime/primitives";
import {cookies} from "next/headers";
import { Resend } from 'resend';

export async function GET(request) {
    const searchparams = request.nextUrl.searchParams
    const resend = new Resend(process.env.RESEND);
    let buf = new Uint8Array(6);
    crypto.getRandomValues(buf)
    const digits = buf.map((x) => (x % 10).toString())

    const { data, error } = await resend.emails.send({
        from: "GFS Weightroom <no-reply@weightroom.epicliem.com>",
        to: [searchparams.get('email')],
        subject: "Your GFS Weightroom Code",
        text: "Your GFS Weightroom Code:" + digits.join(''),
    });
    console.log(data)
    console.log(error)
    const sessionid = await bcrypt.hash(searchparams.get('email') + digits.join(''), process.env.SALT)
    if (await bcrypt.compare(searchparams.get('email') + digits.join(), sessionid)) {
        console.log('verified')
    } else {
        console.log('womp womp')
    }
    console.log(digits.join())
    console.log("sessionid" + sessionid)
    return new Response('Authorized', {
        status: 200,
        headers: { 'Set-Cookie': `pendingtoken=${sessionid}`,
            'Access-Control-Allow-Origin': 'localhost:3000',
            'Acess-Control-Expose-Headers': 'Set-Cookie' },
    })
}