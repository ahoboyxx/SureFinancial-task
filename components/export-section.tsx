"use client"

import { useState } from "react"
import { Download, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Transaction {
  date: string
  description: string
  amount: number
  category: string
  tag: string
}

interface Statement {
  issuer: string
  billingCycle: string
  totalDue: string
  cardLast4: string
}

interface ExportSectionProps {
  transactions: Transaction[]
  statements: Statement[]
}

export default function ExportSection({ transactions, statements }: ExportSectionProps) {
  const [copied, setCopied] = useState(false)
  const [exported, setExported] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)

  const generateCSV = () => {
    const headers = ["Date", "Description", "Amount", "Category", "Tag"]
    const rows = transactions.map((t) => [t.date, t.description, t.amount, t.category, t.tag])
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transactions.csv"
    a.click()

    setExported("csv")
    setTimeout(() => setExported(null), 2000)
  }

  const generateSummary = () => {
    const summary = `SpendSmart Statement Summary
=====================================
Issuer: ${statements[0]?.issuer || "N/A"}
Billing Cycle: ${statements[0]?.billingCycle || "N/A"}
Total Due: ${statements[0]?.totalDue || "N/A"}
Card Last 4: ${statements[0]?.cardLast4 || "N/A"}

Total Spent: ₹${totalSpent.toLocaleString()}
Number of Transactions: ${transactions.length}

Top Spending Categories:
${Object.entries(
  transactions.reduce((acc: Record<string, number>, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {})
)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5)
  .map(([cat, amount]) => `- ${cat}: ₹${amount}`)
  .join("\n")}
`
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportToGoogleSheets = async () => {
    setIsExporting(true)
    try {
      const response = await fetch('/api/export-google-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactions, statements }),
      })

      if (!response.ok) {
        throw new Error('Failed to export to Google Sheets')
      }

      const result = await response.json()
      
      if (result.success) {
        // Open the Google Sheets in a new tab
        window.open(result.url, '_blank')
        setExported('google-sheets')
        setTimeout(() => setExported(null), 3000)
      } else {
        throw new Error(result.error || 'Failed to export to Google Sheets')
      }
    } catch (error) {
      console.error('Error exporting to Google Sheets:', error)
      alert('Failed to export to Google Sheets. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Export Your Data</h2>
        <p className="text-muted-foreground">Download or share your spending analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={generateCSV}>
          <Download className="w-8 h-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">Download CSV</h3>
          <p className="text-sm text-muted-foreground mb-4">Export all transactions as CSV file</p>
          <Button variant="outline" className="w-full bg-transparent">
            Download
          </Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={generateSummary}>
          <Copy className="w-8 h-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">Copy Summary</h3>
          <p className="text-sm text-muted-foreground mb-4">Copy spending summary to clipboard</p>
          <Button variant="outline" className="w-full bg-transparent">
            Copy
          </Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={exportToGoogleSheets}>
          <div className="w-8 h-8 text-primary mb-4">📊</div>
          <h3 className="font-semibold mb-2">Google Sheets</h3>
          <p className="text-sm text-muted-foreground mb-4">Export to Google Sheets with formatting</p>
          <Button variant="outline" className="w-full bg-transparent" disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export to Sheets'}
          </Button>
        </Card>
      </div>

      {copied && (
        <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <p className="text-sm font-medium text-green-900 dark:text-green-100">Summary copied to clipboard!</p>
        </Card>
      )}

      {exported === "csv" && (
        <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <p className="text-sm font-medium text-green-900 dark:text-green-100">CSV file downloaded successfully!</p>
        </Card>
      )}

      {exported === "google-sheets" && (
        <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <p className="text-sm font-medium text-green-900 dark:text-green-100">Data exported to Google Sheets successfully!</p>
        </Card>
      )}

      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-4">Export Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Transactions</p>
            <p className="text-2xl font-bold">{transactions.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
            <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Categories</p>
            <p className="text-2xl font-bold">{new Set(transactions.map((t) => t.category)).size}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Merchants</p>
            <p className="text-2xl font-bold">{new Set(transactions.map((t) => t.description.split("-")[0])).size}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
