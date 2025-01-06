import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { OpenAI } from 'openai'
import { computeBleu, computeRouge } from '../../../lib/metrics'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { systemPrompt, userPrompt } = body

    // Validation
    if (!systemPrompt || !userPrompt) {
      return NextResponse.json(
        { error: 'systemPrompt and userPrompt are required' },
        { status: 400 }
      )
    }

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 50,
    })
    const llmResponse = response.choices[0].message?.content || ''

    // Metrics
    const bleuScore = computeBleu(userPrompt, llmResponse)
    const rougeScore = computeRouge(userPrompt, llmResponse)

    // Save to DB
    const savedRecord = await prisma.prompt.create({
      data: {
        systemPrompt: systemPrompt.trim(),
        userPrompt: userPrompt.trim(),
        response: llmResponse.trim(),
        llmName: 'OpenAI gpt-3.5-turbo',
        bleu: bleuScore,
        rouge: rougeScore,
      },
    })

    return NextResponse.json(savedRecord, { status: 200 })
  } catch (error) {
    console.error('[POST /api/evaluate] error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
