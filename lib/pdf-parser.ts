import pdf from 'pdf-parse'
import { createWorker } from 'tesseract.js'

export interface ParsedTransaction {
  date: string
  description: string
  amount: number
  category: string
  tag: string
}

export interface ParsedStatement {
  issuer: string
  billingCycle: string
  totalDue: string
  cardLast4: string
  paymentDueDate: string
  transactions: ParsedTransaction[]
}

export class CreditCardPDFParser {
  private worker: any = null

  constructor() {
    this.initializeOCR()
  }

  private async initializeOCR() {
    this.worker = await createWorker('eng')
  }

  async parsePDF(buffer: Buffer): Promise<ParsedStatement> {
    try {
      // Extract text from PDF
      const pdfData = await pdf(buffer)
      const text = pdfData.text

      // Detect credit card issuer
      const issuer = this.detectIssuer(text)
      
      // Parse based on issuer
      switch (issuer) {
        case 'HDFC Bank':
          return this.parseHDFCStatement(text)
        case 'ICICI Bank':
          return this.parseICICIStatement(text)
        case 'State Bank of India':
          return this.parseSBIStatement(text)
        case 'Axis Bank':
          return this.parseAxisStatement(text)
        case 'Kotak Mahindra Bank':
          return this.parseKotakStatement(text)
        case 'Chase':
          return this.parseChaseStatement(text)
        case 'American Express':
          return this.parseAmexStatement(text)
        case 'Capital One':
          return this.parseCapitalOneStatement(text)
        case 'Citi':
          return this.parseCitiStatement(text)
        case 'Discover':
          return this.parseDiscoverStatement(text)
        default:
          return this.parseGenericStatement(text)
      }
    } catch (error) {
      console.error('Error parsing PDF:', error)
      throw new Error('Failed to parse PDF')
    }
  }

  private detectIssuer(text: string): string {
    const issuerPatterns = {
      'HDFC Bank': /hdfc|hdfc bank/i,
      'ICICI Bank': /icici|icici bank/i,
      'State Bank of India': /sbi|state bank of india/i,
      'Axis Bank': /axis|axis bank/i,
      'Kotak Mahindra Bank': /kotak|kotak mahindra/i,
      'Chase': /chase|jpmorgan|jpm/i,
      'American Express': /american express|amex/i,
      'Capital One': /capital one/i,
      'Citi': /citibank|citi/i,
      'Discover': /discover/i
    }

    for (const [issuer, pattern] of Object.entries(issuerPatterns)) {
      if (pattern.test(text)) {
        return issuer
      }
    }
    return 'Unknown'
  }

  private parseHDFCStatement(text: string): ParsedStatement {
    // HDFC Bank statement parsing logic
    const billingCycleMatch = text.match(/Statement Period\s*(\d{2}\/\d{2}\/\d{4})\s*to\s*(\d{2}\/\d{2}\/\d{4})/i)
    const totalDueMatch = text.match(/Total Amount Due\s*₹?([\d,]+\.?\d*)/i)
    const cardLast4Match = text.match(/\*{4}\s*(\d{4})/i)
    const dueDateMatch = text.match(/Payment Due Date\s*(\d{2}\/\d{2}\/\d{4})/i)

    const transactions = this.extractHDFCTransactions(text)

    return {
      issuer: 'HDFC Bank',
      billingCycle: billingCycleMatch ? `${billingCycleMatch[1]} - ${billingCycleMatch[2]}` : 'Unknown',
      totalDue: totalDueMatch ? `₹${totalDueMatch[1]}` : 'Unknown',
      cardLast4: cardLast4Match ? cardLast4Match[1] : 'Unknown',
      paymentDueDate: dueDateMatch ? dueDateMatch[1] : 'Unknown',
      transactions
    }
  }

  private parseICICIStatement(text: string): ParsedStatement {
    // ICICI Bank statement parsing logic
    const billingCycleMatch = text.match(/Statement Period\s*(\d{2}\/\d{2}\/\d{4})\s*to\s*(\d{2}\/\d{2}\/\d{4})/i)
    const totalDueMatch = text.match(/Total Amount Due\s*₹?([\d,]+\.?\d*)/i)
    const cardLast4Match = text.match(/\*{4}\s*(\d{4})/i)
    const dueDateMatch = text.match(/Payment Due Date\s*(\d{2}\/\d{2}\/\d{4})/i)

    const transactions = this.extractICICITransactions(text)

    return {
      issuer: 'ICICI Bank',
      billingCycle: billingCycleMatch ? `${billingCycleMatch[1]} - ${billingCycleMatch[2]}` : 'Unknown',
      totalDue: totalDueMatch ? `₹${totalDueMatch[1]}` : 'Unknown',
      cardLast4: cardLast4Match ? cardLast4Match[1] : 'Unknown',
      paymentDueDate: dueDateMatch ? dueDateMatch[1] : 'Unknown',
      transactions
    }
  }

  private parseSBIStatement(text: string): ParsedStatement {
    // State Bank of India statement parsing logic
    const billingCycleMatch = text.match(/Statement Period\s*(\d{2}\/\d{2}\/\d{4})\s*to\s*(\d{2}\/\d{2}\/\d{4})/i)
    const totalDueMatch = text.match(/Total Amount Due\s*₹?([\d,]+\.?\d*)/i)
    const cardLast4Match = text.match(/\*{4}\s*(\d{4})/i)
    const dueDateMatch = text.match(/Payment Due Date\s*(\d{2}\/\d{2}\/\d{4})/i)

    const transactions = this.extractSBITransactions(text)

    return {
      issuer: 'State Bank of India',
      billingCycle: billingCycleMatch ? `${billingCycleMatch[1]} - ${billingCycleMatch[2]}` : 'Unknown',
      totalDue: totalDueMatch ? `₹${totalDueMatch[1]}` : 'Unknown',
      cardLast4: cardLast4Match ? cardLast4Match[1] : 'Unknown',
      paymentDueDate: dueDateMatch ? dueDateMatch[1] : 'Unknown',
      transactions
    }
  }

  private parseAxisStatement(text: string): ParsedStatement {
    // Axis Bank statement parsing logic
    const billingCycleMatch = text.match(/Statement Period\s*(\d{2}\/\d{2}\/\d{4})\s*to\s*(\d{2}\/\d{2}\/\d{4})/i)
    const totalDueMatch = text.match(/Total Amount Due\s*₹?([\d,]+\.?\d*)/i)
    const cardLast4Match = text.match(/\*{4}\s*(\d{4})/i)
    const dueDateMatch = text.match(/Payment Due Date\s*(\d{2}\/\d{2}\/\d{4})/i)

    const transactions = this.extractAxisTransactions(text)

    return {
      issuer: 'Axis Bank',
      billingCycle: billingCycleMatch ? `${billingCycleMatch[1]} - ${billingCycleMatch[2]}` : 'Unknown',
      totalDue: totalDueMatch ? `₹${totalDueMatch[1]}` : 'Unknown',
      cardLast4: cardLast4Match ? cardLast4Match[1] : 'Unknown',
      paymentDueDate: dueDateMatch ? dueDateMatch[1] : 'Unknown',
      transactions
    }
  }

  private parseKotakStatement(text: string): ParsedStatement {
    // Kotak Mahindra Bank statement parsing logic
    const billingCycleMatch = text.match(/Statement Period\s*(\d{2}\/\d{2}\/\d{4})\s*to\s*(\d{2}\/\d{2}\/\d{4})/i)
    const totalDueMatch = text.match(/Total Amount Due\s*₹?([\d,]+\.?\d*)/i)
    const cardLast4Match = text.match(/\*{4}\s*(\d{4})/i)
    const dueDateMatch = text.match(/Payment Due Date\s*(\d{2}\/\d{2}\/\d{4})/i)

    const transactions = this.extractKotakTransactions(text)

    return {
      issuer: 'Kotak Mahindra Bank',
      billingCycle: billingCycleMatch ? `${billingCycleMatch[1]} - ${billingCycleMatch[2]}` : 'Unknown',
      totalDue: totalDueMatch ? `₹${totalDueMatch[1]}` : 'Unknown',
      cardLast4: cardLast4Match ? cardLast4Match[1] : 'Unknown',
      paymentDueDate: dueDateMatch ? dueDateMatch[1] : 'Unknown',
      transactions
    }
  }

  private parseChaseStatement(text: string): ParsedStatement {
    // Chase statement parsing logic
    const billingCycleMatch = text.match(/Statement Period\s*(\d{2}\/\d{2}\/\d{4})\s*to\s*(\d{2}\/\d{2}\/\d{4})/i)
    const totalDueMatch = text.match(/New Balance\s*\$?([\d,]+\.?\d*)/i)
    const cardLast4Match = text.match(/\*{4}\s*(\d{4})/i)
    const dueDateMatch = text.match(/Payment Due Date\s*(\d{2}\/\d{2}\/\d{4})/i)

    const transactions = this.extractChaseTransactions(text)

    return {
      issuer: 'Chase',
      billingCycle: billingCycleMatch ? `${billingCycleMatch[1]} - ${billingCycleMatch[2]}` : 'Unknown',
      totalDue: totalDueMatch ? `$${totalDueMatch[1]}` : 'Unknown',
      cardLast4: cardLast4Match ? cardLast4Match[1] : 'Unknown',
      paymentDueDate: dueDateMatch ? dueDateMatch[1] : 'Unknown',
      transactions
    }
  }

  private parseAmexStatement(text: string): ParsedStatement {
    // American Express statement parsing logic
    const billingCycleMatch = text.match(/Statement Period\s*(\d{2}\/\d{2}\/\d{4})\s*to\s*(\d{2}\/\d{2}\/\d{4})/i)
    const totalDueMatch = text.match(/New Balance\s*\$?([\d,]+\.?\d*)/i)
    const cardLast4Match = text.match(/\*{4}\s*(\d{4})/i)
    const dueDateMatch = text.match(/Payment Due Date\s*(\d{2}\/\d{2}\/\d{4})/i)

    const transactions = this.extractAmexTransactions(text)

    return {
      issuer: 'American Express',
      billingCycle: billingCycleMatch ? `${billingCycleMatch[1]} - ${billingCycleMatch[2]}` : 'Unknown',
      totalDue: totalDueMatch ? `$${totalDueMatch[1]}` : 'Unknown',
      cardLast4: cardLast4Match ? cardLast4Match[1] : 'Unknown',
      paymentDueDate: dueDateMatch ? dueDateMatch[1] : 'Unknown',
      transactions
    }
  }

  private parseCapitalOneStatement(text: string): ParsedStatement {
    // Capital One statement parsing logic
    const billingCycleMatch = text.match(/Statement Period\s*(\d{2}\/\d{2}\/\d{4})\s*to\s*(\d{2}\/\d{2}\/\d{4})/i)
    const totalDueMatch = text.match(/New Balance\s*\$?([\d,]+\.?\d*)/i)
    const cardLast4Match = text.match(/\*{4}\s*(\d{4})/i)
    const dueDateMatch = text.match(/Payment Due Date\s*(\d{2}\/\d{2}\/\d{4})/i)

    const transactions = this.extractCapitalOneTransactions(text)

    return {
      issuer: 'Capital One',
      billingCycle: billingCycleMatch ? `${billingCycleMatch[1]} - ${billingCycleMatch[2]}` : 'Unknown',
      totalDue: totalDueMatch ? `$${totalDueMatch[1]}` : 'Unknown',
      cardLast4: cardLast4Match ? cardLast4Match[1] : 'Unknown',
      paymentDueDate: dueDateMatch ? dueDateMatch[1] : 'Unknown',
      transactions
    }
  }

  private parseCitiStatement(text: string): ParsedStatement {
    // Citi statement parsing logic
    const billingCycleMatch = text.match(/Statement Period\s*(\d{2}\/\d{2}\/\d{4})\s*to\s*(\d{2}\/\d{2}\/\d{4})/i)
    const totalDueMatch = text.match(/New Balance\s*\$?([\d,]+\.?\d*)/i)
    const cardLast4Match = text.match(/\*{4}\s*(\d{4})/i)
    const dueDateMatch = text.match(/Payment Due Date\s*(\d{2}\/\d{2}\/\d{4})/i)

    const transactions = this.extractCitiTransactions(text)

    return {
      issuer: 'Citi',
      billingCycle: billingCycleMatch ? `${billingCycleMatch[1]} - ${billingCycleMatch[2]}` : 'Unknown',
      totalDue: totalDueMatch ? `$${totalDueMatch[1]}` : 'Unknown',
      cardLast4: cardLast4Match ? cardLast4Match[1] : 'Unknown',
      paymentDueDate: dueDateMatch ? dueDateMatch[1] : 'Unknown',
      transactions
    }
  }

  private parseDiscoverStatement(text: string): ParsedStatement {
    // Discover statement parsing logic
    const billingCycleMatch = text.match(/Statement Period\s*(\d{2}\/\d{2}\/\d{4})\s*to\s*(\d{2}\/\d{2}\/\d{4})/i)
    const totalDueMatch = text.match(/New Balance\s*\$?([\d,]+\.?\d*)/i)
    const cardLast4Match = text.match(/\*{4}\s*(\d{4})/i)
    const dueDateMatch = text.match(/Payment Due Date\s*(\d{2}\/\d{2}\/\d{4})/i)

    const transactions = this.extractDiscoverTransactions(text)

    return {
      issuer: 'Discover',
      billingCycle: billingCycleMatch ? `${billingCycleMatch[1]} - ${billingCycleMatch[2]}` : 'Unknown',
      totalDue: totalDueMatch ? `$${totalDueMatch[1]}` : 'Unknown',
      cardLast4: cardLast4Match ? cardLast4Match[1] : 'Unknown',
      paymentDueDate: dueDateMatch ? dueDateMatch[1] : 'Unknown',
      transactions
    }
  }

  private parseGenericStatement(text: string): ParsedStatement {
    // Generic parsing for unknown issuers
    const transactions = this.extractGenericTransactions(text)

    return {
      issuer: 'Unknown',
      billingCycle: 'Unknown',
      totalDue: 'Unknown',
      cardLast4: 'Unknown',
      paymentDueDate: 'Unknown',
      transactions
    }
  }

  private extractHDFCTransactions(text: string): ParsedTransaction[] {
    // HDFC Bank transaction extraction logic
    const transactionRegex = /(\d{2}\/\d{2})\s+([^₹]+?)\s+₹?([\d,]+\.?\d*)/g
    const transactions: ParsedTransaction[] = []
    let match

    while ((match = transactionRegex.exec(text)) !== null) {
      const [, date, description, amount] = match
      transactions.push({
        date: this.formatDate(date),
        description: description.trim(),
        amount: parseFloat(amount.replace(/,/g, '')),
        category: this.categorizeTransaction(description),
        tag: this.categorizeTransaction(description)
      })
    }

    return transactions
  }

  private extractICICITransactions(text: string): ParsedTransaction[] {
    // ICICI Bank transaction extraction logic
    const transactionRegex = /(\d{2}\/\d{2})\s+([^₹]+?)\s+₹?([\d,]+\.?\d*)/g
    const transactions: ParsedTransaction[] = []
    let match

    while ((match = transactionRegex.exec(text)) !== null) {
      const [, date, description, amount] = match
      transactions.push({
        date: this.formatDate(date),
        description: description.trim(),
        amount: parseFloat(amount.replace(/,/g, '')),
        category: this.categorizeTransaction(description),
        tag: this.categorizeTransaction(description)
      })
    }

    return transactions
  }

  private extractSBITransactions(text: string): ParsedTransaction[] {
    // State Bank of India transaction extraction logic
    const transactionRegex = /(\d{2}\/\d{2})\s+([^₹]+?)\s+₹?([\d,]+\.?\d*)/g
    const transactions: ParsedTransaction[] = []
    let match

    while ((match = transactionRegex.exec(text)) !== null) {
      const [, date, description, amount] = match
      transactions.push({
        date: this.formatDate(date),
        description: description.trim(),
        amount: parseFloat(amount.replace(/,/g, '')),
        category: this.categorizeTransaction(description),
        tag: this.categorizeTransaction(description)
      })
    }

    return transactions
  }

  private extractAxisTransactions(text: string): ParsedTransaction[] {
    // Axis Bank transaction extraction logic
    const transactionRegex = /(\d{2}\/\d{2})\s+([^₹]+?)\s+₹?([\d,]+\.?\d*)/g
    const transactions: ParsedTransaction[] = []
    let match

    while ((match = transactionRegex.exec(text)) !== null) {
      const [, date, description, amount] = match
      transactions.push({
        date: this.formatDate(date),
        description: description.trim(),
        amount: parseFloat(amount.replace(/,/g, '')),
        category: this.categorizeTransaction(description),
        tag: this.categorizeTransaction(description)
      })
    }

    return transactions
  }

  private extractKotakTransactions(text: string): ParsedTransaction[] {
    // Kotak Mahindra Bank transaction extraction logic
    const transactionRegex = /(\d{2}\/\d{2})\s+([^₹]+?)\s+₹?([\d,]+\.?\d*)/g
    const transactions: ParsedTransaction[] = []
    let match

    while ((match = transactionRegex.exec(text)) !== null) {
      const [, date, description, amount] = match
      transactions.push({
        date: this.formatDate(date),
        description: description.trim(),
        amount: parseFloat(amount.replace(/,/g, '')),
        category: this.categorizeTransaction(description),
        tag: this.categorizeTransaction(description)
      })
    }

    return transactions
  }

  private extractChaseTransactions(text: string): ParsedTransaction[] {
    // Chase transaction extraction logic
    const transactionRegex = /(\d{2}\/\d{2})\s+([^$]+?)\s+\$?([\d,]+\.?\d*)/g
    const transactions: ParsedTransaction[] = []
    let match

    while ((match = transactionRegex.exec(text)) !== null) {
      const [, date, description, amount] = match
      transactions.push({
        date: this.formatDate(date),
        description: description.trim(),
        amount: parseFloat(amount.replace(/,/g, '')),
        category: this.categorizeTransaction(description),
        tag: this.categorizeTransaction(description)
      })
    }

    return transactions
  }

  private extractAmexTransactions(text: string): ParsedTransaction[] {
    // Amex transaction extraction logic
    const transactionRegex = /(\d{2}\/\d{2})\s+([^$]+?)\s+\$?([\d,]+\.?\d*)/g
    const transactions: ParsedTransaction[] = []
    let match

    while ((match = transactionRegex.exec(text)) !== null) {
      const [, date, description, amount] = match
      transactions.push({
        date: this.formatDate(date),
        description: description.trim(),
        amount: parseFloat(amount.replace(/,/g, '')),
        category: this.categorizeTransaction(description),
        tag: this.categorizeTransaction(description)
      })
    }

    return transactions
  }

  private extractCapitalOneTransactions(text: string): ParsedTransaction[] {
    // Capital One transaction extraction logic
    const transactionRegex = /(\d{2}\/\d{2})\s+([^$]+?)\s+\$?([\d,]+\.?\d*)/g
    const transactions: ParsedTransaction[] = []
    let match

    while ((match = transactionRegex.exec(text)) !== null) {
      const [, date, description, amount] = match
      transactions.push({
        date: this.formatDate(date),
        description: description.trim(),
        amount: parseFloat(amount.replace(/,/g, '')),
        category: this.categorizeTransaction(description),
        tag: this.categorizeTransaction(description)
      })
    }

    return transactions
  }

  private extractCitiTransactions(text: string): ParsedTransaction[] {
    // Citi transaction extraction logic
    const transactionRegex = /(\d{2}\/\d{2})\s+([^$]+?)\s+\$?([\d,]+\.?\d*)/g
    const transactions: ParsedTransaction[] = []
    let match

    while ((match = transactionRegex.exec(text)) !== null) {
      const [, date, description, amount] = match
      transactions.push({
        date: this.formatDate(date),
        description: description.trim(),
        amount: parseFloat(amount.replace(/,/g, '')),
        category: this.categorizeTransaction(description),
        tag: this.categorizeTransaction(description)
      })
    }

    return transactions
  }

  private extractDiscoverTransactions(text: string): ParsedTransaction[] {
    // Discover transaction extraction logic
    const transactionRegex = /(\d{2}\/\d{2})\s+([^$]+?)\s+\$?([\d,]+\.?\d*)/g
    const transactions: ParsedTransaction[] = []
    let match

    while ((match = transactionRegex.exec(text)) !== null) {
      const [, date, description, amount] = match
      transactions.push({
        date: this.formatDate(date),
        description: description.trim(),
        amount: parseFloat(amount.replace(/,/g, '')),
        category: this.categorizeTransaction(description),
        tag: this.categorizeTransaction(description)
      })
    }

    return transactions
  }

  private extractGenericTransactions(text: string): ParsedTransaction[] {
    // Generic transaction extraction logic
    const transactionRegex = /(\d{2}\/\d{2})\s+([^$]+?)\s+\$?([\d,]+\.?\d*)/g
    const transactions: ParsedTransaction[] = []
    let match

    while ((match = transactionRegex.exec(text)) !== null) {
      const [, date, description, amount] = match
      transactions.push({
        date: this.formatDate(date),
        description: description.trim(),
        amount: parseFloat(amount.replace(/,/g, '')),
        category: this.categorizeTransaction(description),
        tag: this.categorizeTransaction(description)
      })
    }

    return transactions
  }

  private categorizeTransaction(description: string): string {
    const categories = {
      'Food': /restaurant|food|dining|grubhub|uber eats|doordash|swiggy|zomato/i,
      'Travel': /uber|lyft|taxi|hotel|airline|flight|travel|gas|fuel/i,
      'Shopping': /amazon|walmart|target|store|shop|retail/i,
      'Utilities': /electric|water|gas|internet|cable|phone|utility/i,
      'Entertainment': /netflix|spotify|movie|theater|entertainment/i,
      'Healthcare': /pharmacy|medical|doctor|hospital|health/i,
      'Other': /.*/
    }

    for (const [category, pattern] of Object.entries(categories)) {
      if (pattern.test(description)) {
        return category
      }
    }

    return 'Other'
  }

  private formatDate(dateStr: string): string {
    // Convert MM/DD to YYYY-MM-DD format
    const [month, day] = dateStr.split('/')
    const currentYear = new Date().getFullYear()
    return `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  async cleanup() {
    if (this.worker) {
      await this.worker.terminate()
    }
  }
}
