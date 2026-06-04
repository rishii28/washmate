import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(request) {
  try {
    const { to, name, amount, paymentDate, transactionId, paymentType } = await request.json()

    const paymentMethod = paymentType === 'ONLINE' ? '💳 Online Payment (UPI)' : '💵 Cash Payment'
    const transactionText = transactionId && transactionId !== 'Cash Payment' 
      ? `<p><strong>Transaction ID:</strong> ${transactionId}</p>` 
      : ''

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: 'Payment Confirmation - WashMate 🧺',
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #e0e7ff, #ffffff, #f3e8ff); border-radius: 16px;">
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px;">🧺</div>
            <h1 style="color: #4f46e5; margin: 0;">WashMate</h1>
            <p style="color: #6b7280;">Fast, Simple & Reliable</p>
          </div>
          
          <div style="background: white; border-radius: 12px; padding: 24px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Thank you for your payment! 🎉</h2>
            <p>Dear <strong style="color: #4f46e5;">${name}</strong>,</p>
            <p>We have successfully received your payment of <strong style="color: #ea580c; font-size: 24px;">₹${amount}</strong> on <strong>${paymentDate}</strong>.</p>
            
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            ${transactionText}
            
            <p>Your laundry records have been cleared. Thank you for choosing WashMate!</p>
          </div>
          
          <div style="text-align: center; padding: 16px; color: #6b7280; font-size: 12px;">
            <p>WashMate - Fast, Simple & Reliable Laundry Service</p>
            <p>📍 Your Trusted Laundry Partner</p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    
    return NextResponse.json({ message: 'Email sent successfully!' })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}