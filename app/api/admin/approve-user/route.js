import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, status } = body

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: status }
    })

    return NextResponse.json({ 
      message: 'User updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}