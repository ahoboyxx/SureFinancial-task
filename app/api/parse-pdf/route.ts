import { NextRequest, NextResponse } from 'next/server'
import { CreditCardPDFParser } from '@/lib/pdf-parser'
import { adminDb } from '@/lib/firebase-admin'

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
    const parser = new CreditCardPDFParser()
    const parsedData = await parser.parsePDF(buffer)
    
    // Clean up parser
    await parser.cleanup()

    // Store in Firebase (optional)
    try {
      const docRef = await adminDb.collection('statements').add({
        ...parsedData,
        uploadedAt: new Date(),
        fileName: file.name,
        fileSize: file.size
      })
      
      return NextResponse.json({
        success: true,
        data: parsedData,
        id: docRef.id
      })
    } catch (firebaseError) {
      // If Firebase fails, still return the parsed data
      console.error('Firebase error:', firebaseError)
      return NextResponse.json({
        success: true,
        data: parsedData,
        id: null
      })
    }

  } catch (error) {
    console.error('Error parsing PDF:', error)
    return NextResponse.json(
      { error: 'Failed to parse PDF' },
      { status: 500 }
    )
  }
}
