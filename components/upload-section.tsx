"use client"

import type React from "react"

import { useState } from "react"
import { Upload, CheckCircle, AlertCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { generateSampleData, sampleIssuers } from "@/lib/sample-data"

interface UploadSectionProps {
  onUpload: (data: any) => void
}

export default function UploadSection({ onUpload }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [parsedData, setParsedData] = useState<any>(null)
  const [selectedIssuer, setSelectedIssuer] = useState<string>("Chase")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setUploadStatus("idle")

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to parse PDF')
      }

      const result = await response.json()
      
      if (result.success) {
        setParsedData(result.data)
        setUploadStatus("success")
        onUpload(result.data)
      } else {
        throw new Error(result.error || 'Failed to parse PDF')
      }
    } catch (error) {
      console.error('Error processing file:', error)
      setUploadStatus("error")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const loadSampleData = () => {
    setIsProcessing(true)
    setUploadStatus("idle")
    
    // Simulate processing delay
    setTimeout(() => {
      const sampleData = generateSampleData(selectedIssuer)
      setParsedData(sampleData)
      setUploadStatus("success")
      onUpload(sampleData)
      setIsProcessing(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Upload Credit Card Statement</h3>
          <p className="text-muted-foreground mb-6">Drag and drop your PDF file here or click to browse</p>

          <div className="flex gap-4 justify-center">
            <label>
              <input type="file" accept=".pdf" onChange={handleFileInput} className="hidden" disabled={isProcessing} />
              <Button disabled={isProcessing}>{isProcessing ? "Processing..." : "Select File"}</Button>
            </label>
          </div>
        </div>
      </Card>

      {/* Demo Mode */}
      <Card className="p-6 bg-muted/50">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Try Demo Mode</h3>
          <p className="text-muted-foreground mb-4">
            Test the application with sample data from different credit card issuers
          </p>
          <div className="flex gap-4 justify-center items-center">
            <select
              value={selectedIssuer}
              onChange={(e) => setSelectedIssuer(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background"
              disabled={isProcessing}
            >
              {sampleIssuers.map((issuer) => (
                <option key={issuer} value={issuer}>
                  {issuer}
                </option>
              ))}
            </select>
            <Button onClick={loadSampleData} disabled={isProcessing} variant="outline">
              <Play className="w-4 h-4 mr-2" />
              {isProcessing ? "Loading..." : "Load Sample Data"}
            </Button>
          </div>
        </div>
      </Card>

      {isProcessing && (
        <Card className="p-6 bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm font-medium">Processing your statement...</p>
          </div>
        </Card>
      )}

      {uploadStatus === "success" && parsedData && (
        <Card className="p-6 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-100">Statement Parsed Successfully</h4>
              <p className="text-sm text-green-700 dark:text-green-200">
                {parsedData.transactions.length} Transactions Found!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-background rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Issuer</p>
              <p className="font-semibold">{parsedData.issuer}</p>
            </div>
            <div className="bg-white dark:bg-background rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Billing Cycle</p>
              <p className="font-semibold text-sm">{parsedData.billingCycle}</p>
            </div>
            <div className="bg-white dark:bg-background rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Total Due</p>
              <p className="font-semibold">{parsedData.totalDue}</p>
            </div>
            <div className="bg-white dark:bg-background rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Card Last 4</p>
              <p className="font-semibold">•••• {parsedData.cardLast4}</p>
            </div>
          </div>
        </Card>
      )}

      {uploadStatus === "error" && (
        <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-100">Failed to Parse Statement</h4>
              <p className="text-sm text-red-700 dark:text-red-200">
                There was an error processing your PDF. Please make sure it's a valid credit card statement and try again.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
