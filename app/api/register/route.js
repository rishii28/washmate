import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Demo account that is auto-approved
const DEMO_EMAIL = 'test@gmail.com'
const DEMO_PASSWORD = 'test@123'

// Demo laundry records
const DEMO_LAUNDRY_RECORDS = [
  {
    date: '2026-06-01',
    pairs: 5,
    singles: 1,
    status: 'Received',
    amount: 110,
    pickupStatus: null,
    pickupDate: null,
    serviceType: 'Clothes'
  },
  {
    date: '2026-06-02',
    pairs: 10,
    singles: 0,
    status: 'Ready',
    amount: 200,
    pickupStatus: null,
    pickupDate: null,
    serviceType: 'Clothes'
  },
  {
    date: '2026-06-03',
    pairs: 2,
    singles: 0,
    status: 'Completed',
    amount: 100,
    pickupStatus: 'Picked Up',
    pickupDate: '2026-06-03',
    serviceType: 'Blanket'
  }
]

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, password } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Check if this is the demo account
    const isDemoAccount = (email === DEMO_EMAIL && password === DEMO_PASSWORD)
    const userStatus = isDemoAccount ? 'ACTIVE' : 'PENDING'

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        password: password,
        status: userStatus,
        role: 'CUSTOMER',
      }
    })

    const message = isDemoAccount 
      ? 'Demo account created! You can login now. Sample laundry records have been added.'
      : 'Registration successful! Please wait for admin approval.'

    return NextResponse.json({ 
      message: message,
      userId: user.id,
      autoApproved: isDemoAccount
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}