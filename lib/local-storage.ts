// Local storage utilities for saving data without any database
export interface StoredStatement {
  id: string
  issuer: string
  billingCycle: string
  totalDue: string
  cardLast4: string
  paymentDueDate?: string
  transactions: Array<{
    date: string
    description: string
    amount: number
    category: string
    tag: string
  }>
  uploadedAt: string
  fileName: string
}

const STORAGE_KEY = 'credit_card_statements'

export const saveStatement = (statement: Omit<StoredStatement, 'id'>): string => {
  const id = Date.now().toString()
  const statementWithId = { ...statement, id }
  
  const existing = getStatements()
  const updated = [...existing, statementWithId]
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return id
}

export const getStatements = (): StoredStatement[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const deleteStatement = (id: string): void => {
  const existing = getStatements()
  const updated = existing.filter(stmt => stmt.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export const clearAllStatements = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

export const exportData = (): string => {
  const statements = getStatements()
  return JSON.stringify(statements, null, 2)
}

export const importData = (jsonData: string): boolean => {
  try {
    const statements = JSON.parse(jsonData)
    if (Array.isArray(statements)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statements))
      return true
    }
    return false
  } catch {
    return false
  }
}
