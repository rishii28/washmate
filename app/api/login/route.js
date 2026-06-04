import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // First check in database
    let user = await prisma.user.findUnique({
      where: { email: email }
    })

    // If not in database, check localStorage (for demo purposes)
    if (!user) {
      // Check in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('user_') && !key.includes('laundry')) {
          const localUser = JSON.parse(localStorage.getItem(key))
          if (localUser.email === email) {
            user = localUser
            break
          }
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Wrong password' },
        { status: 401 }
      )
    }

    // Check approval status
    if (user.status === 'PENDING') {
      return NextResponse.json(
        { error: 'Account pending approval. Please wait for admin approval.' },
        { status: 403 }
      )
    }

    if (user.status === 'REJECTED') {
      return NextResponse.json(
        { error: 'Account was rejected. Contact admin.' },
        { status: 403 }
      )
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Account not activated. Status: ' + user.status },
        { status: 403 }
      )
    }

    return NextResponse.json({ 
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'CUSTOMER',
        status: user.status
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}