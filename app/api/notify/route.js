import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import {NextResponse} from "next/server";

export async function POST(request) {
    const mailerSend = new MailerSend({
        apiKey: process.env.API_KEY,
    });

    const sentFrom = new Sender("no-reply@weightroom.epicliem.com", "GFS Weightroom");

    const recipients = [
        new Recipient("liem@epicliem.com", "Liem Luttrell")
    ];

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("This is a Subject")
        .setHtml("<strong>This is the HTML content</strong>")
        .setText("This is the text content");

    await mailerSend.email.send(emailParams);

    return new NextResponse("cool")
}