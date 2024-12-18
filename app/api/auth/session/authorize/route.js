import 'dotenv/config';
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import {streamToJSON} from "@/lib/server/utils";


export async function POST(request) {
    const data = await streamToJSON(request.body);
    console.log(data)
    const pendingtoken = cookies().get('pendingtoken').value
    console.log('=======================================')
    console.log(pendingtoken)
    if (await bcrypt.compare(data.email + data.digits, pendingtoken)) {
        const sessionid = await bcrypt.hash('Authorized' + data.email, process.env.SALT)
        return new Response('Authorized', {
            status: 200,
            headers: {
                'Set-Cookie': `token=${sessionid};path=/,email=${data.email};path=/`,
                'Access-Control-Allow-Origin': 'localhost:3000',
                'Acess-Control-Expose-Headers': 'Set-Cookie'},
        })
    } else {
        return new Response('Unauthorized', {
            status: 200,
        })
    }
}