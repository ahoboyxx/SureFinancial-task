import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(request: NextRequest) {
  try {
    const { transactions, statements } = await request.json()

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    // Create a new spreadsheet
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `Credit Card Statement - ${new Date().toLocaleDateString()}`,
        },
      },
    })

    const spreadsheetId = spreadsheet.data.spreadsheetId

    if (!spreadsheetId) {
      throw new Error('Failed to create spreadsheet')
    }

    // Prepare data for sheets
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Tag']
    const rows = transactions.map((t: any) => [
      t.date,
      t.description,
      t.amount,
      t.category,
      t.tag
    ])

    // Add summary data
    const summaryData = [
      ['Statement Summary'],
      ['Issuer', statements[0]?.issuer || 'Unknown'],
      ['Billing Cycle', statements[0]?.billingCycle || 'Unknown'],
      ['Total Due', statements[0]?.totalDue || 'Unknown'],
      ['Card Last 4', statements[0]?.cardLast4 || 'Unknown'],
      ['Payment Due Date', statements[0]?.paymentDueDate || 'Unknown'],
      [''],
      ['Transaction Details'],
      ...headers,
      ...rows
    ]

    // Write data to the spreadsheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: summaryData,
      },
    })

    // Format the spreadsheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: headers.length,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.2, green: 0.4, blue: 0.8 },
                  textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          },
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 8,
                endRowIndex: 9,
                startColumnIndex: 0,
                endColumnIndex: headers.length,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                  textFormat: { bold: true },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: headers.length,
              },
            },
          },
        ],
      },
    })

    // Get the shareable link
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`

    return NextResponse.json({
      success: true,
      spreadsheetId,
      url: spreadsheetUrl,
      message: 'Data exported to Google Sheets successfully'
    })

  } catch (error) {
    console.error('Error exporting to Google Sheets:', error)
    return NextResponse.json(
      { error: 'Failed to export to Google Sheets' },
      { status: 500 }
    )
  }
}
