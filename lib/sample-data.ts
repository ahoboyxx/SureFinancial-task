import { ParsedStatement, ParsedTransaction } from './pdf-parser'

export const generateSampleData = (issuer: string = 'HDFC Bank'): ParsedStatement => {
  const sampleTransactions: ParsedTransaction[] = [
    { date: '2024-10-01', description: 'Swiggy - Food Delivery', amount: 450, category: 'Food', tag: 'Food' },
    { date: '2024-10-02', description: 'Uber - Ride', amount: 320, category: 'Travel', tag: 'Travel' },
    { date: '2024-10-03', description: 'Amazon - Shopping', amount: 1200, category: 'Shopping', tag: 'Shopping' },
    { date: '2024-10-04', description: 'Netflix - Subscription', amount: 199, category: 'Utilities', tag: 'Utilities' },
    { date: '2024-10-05', description: 'Zomato - Food', amount: 380, category: 'Food', tag: 'Food' },
    { date: '2024-10-06', description: 'Flipkart - Shopping', amount: 890, category: 'Shopping', tag: 'Shopping' },
    { date: '2024-10-07', description: 'Electricity Bill', amount: 2100, category: 'Utilities', tag: 'Utilities' },
    { date: '2024-10-08', description: 'Ola - Ride', amount: 280, category: 'Travel', tag: 'Travel' },
    { date: '2024-10-09', description: 'Cafe Coffee Day', amount: 150, category: 'Food', tag: 'Food' },
    { date: '2024-10-10', description: 'Spotify - Music', amount: 99, category: 'Entertainment', tag: 'Entertainment' },
    { date: '2024-10-11', description: 'Apollo Pharmacy', amount: 350, category: 'Healthcare', tag: 'Healthcare' },
    { date: '2024-10-12', description: 'PVR Cinemas', amount: 400, category: 'Entertainment', tag: 'Entertainment' },
    { date: '2024-10-13', description: 'Petrol Pump', amount: 1800, category: 'Travel', tag: 'Travel' },
    { date: '2024-10-14', description: 'Big Bazaar', amount: 1200, category: 'Food', tag: 'Food' },
    { date: '2024-10-15', description: 'Myntra - Shopping', amount: 750, category: 'Shopping', tag: 'Shopping' },
  ]

  const totalAmount = sampleTransactions.reduce((sum, t) => sum + t.amount, 0)
  const isIndianBank = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank'].includes(issuer)

  return {
    issuer,
    billingCycle: 'Oct 1 - Oct 31, 2024',
    totalDue: isIndianBank ? `₹${totalAmount.toFixed(2)}` : `$${totalAmount.toFixed(2)}`,
    cardLast4: '4242',
    paymentDueDate: '2024-11-15',
    transactions: sampleTransactions
  }
}

export const sampleIssuers = [
  'HDFC Bank',
  'ICICI Bank',
  'State Bank of India',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Chase',
  'American Express', 
  'Capital One',
  'Citi',
  'Discover'
]
