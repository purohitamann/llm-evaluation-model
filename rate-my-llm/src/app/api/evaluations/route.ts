// src/app/api/evaluations/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { prompt, response, rating, comment } = await req.json()

    // Input Validation
    if (!prompt || !response || rating === undefined || rating === null) {
      return NextResponse.json(
        { error: "Missing required fields: prompt, response, rating" },
        { status: 400 }
      )
    }

    // Ensure rating is within 1-5
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // Create new evaluation
    const newEvaluation = await prisma.evaluation.create({
      data: {
        prompt,
        response,
        rating,
        comment: comment || null, // Optional field
      },
    })

    return NextResponse.json(newEvaluation, { status: 201 })
  } catch (error: any) {
    console.error('Error in /api/evaluations:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
export async function GET() {
    try {
      const evaluations = await prisma.evaluation.findMany({
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(evaluations, { status: 200 })
    } catch (error: any) {
      console.error('Error fetching evaluations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }