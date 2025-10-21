import { NextRequest, NextResponse } from 'next/server'
import { SimplePDFParser } from '@/lib/simple-pdf-parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Parse PDF
    const parser = new SimplePDFParser()
    const parsedData = await parser.parsePDF(buffer)

    return NextResponse.json({
      success: true,
      data: parsedData,
      id: Date.now().toString()
    })

  } catch (error) {
    console.error('Error parsing PDF:', error)
    return NextResponse.json(
      { error: 'Failed to parse PDF' },
      { status: 500 }
    )
  }
}
