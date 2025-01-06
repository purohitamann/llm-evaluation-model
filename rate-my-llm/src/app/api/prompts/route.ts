import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { systemPrompt, userPrompt, response, llmName } = body

    const savedPrompt = await prisma.prompt.create({
      data: {
        systemPrompt: systemPrompt || '',
        userPrompt: userPrompt || '',
        response: response || '',
        llmName: llmName || 'Unknown',
      },
    })
    return NextResponse.json(savedPrompt, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error saving prompt' }, { status: 500 })
  }
}

// Handle GET requests (optional)
export async function GET() {
  try {
    const allPrompts = await prisma.prompt.findMany()
    return NextResponse.json(allPrompts, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching prompts' }, { status: 500 })
  }
}
