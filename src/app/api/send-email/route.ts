import { generateExcelBuffer } from '@/app/(modules)/(order)/tienda/guia/generate-excel-buffer';
import { sendEmail } from '@/lib/mailer/mailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { to, subject, html, tableData } = await request.json();
    if (!to || !subject || !html || !tableData) {
        return NextResponse.json({ error: 'Datos faltantes' }, { status: 400 });
    }

    try {
        const excelBuffer = await generateExcelBuffer(tableData.data, tableData.resumen);
        console.log(excelBuffer)
        const guide = tableData.guide
        await sendEmail(to, subject, html, excelBuffer, guide);
        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
    }
}