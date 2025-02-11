import nodemailer from "nodemailer";
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Servidor SMTP de Mailgun
    port: process.env.SMTP_PORT, // Puerto seguro para SMTP
    secure: false, // Usar `false` para el puerto 587, `true` para el puerto 465
    auth: {
        user: process.env.SMTP_USERNAME, // Usuario SMTP de Mailgun
        pass: process.env.SMTP_PASSWORD, // Contraseña SMTP de Mailgun
    },
} as SMTPTransport.Options); // Asegúrate de usar el tipo correcto

export const sendEmail = async (to: string, subject: string, html: string, buffer: Buffer, guide: string) => {
    const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to,
        subject,
        html,
        attachments: [
            {
                filename: `Reporte_${guide}.xlsx`,
                content: buffer,
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};