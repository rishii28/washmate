import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Update all PENDING users to ACTIVE
    const updatedUsers = await prisma.user.updateMany({
      where: { status: 'PENDING' },
      data: { status: 'ACTIVE' }
    })
    
    return NextResponse.json({ 
      message: `Fixed ${updatedUsers.count} pending users. They can now login.`,
      count: updatedUsers.count
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}