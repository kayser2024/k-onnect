import { sendEmail } from '@/lib/mailer/mailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { to, subject, html } = await request.json();

    try {
        await sendEmail(to, subject, html);
        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
    }
}