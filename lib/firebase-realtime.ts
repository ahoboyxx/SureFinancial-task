import { initializeApp, getApps } from 'firebase/app'
import { getDatabase, ref, set, get, push, remove, onValue, off } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // Add databaseURL for Realtime Database
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const database = getDatabase(app)
export const auth = getAuth(app)

export interface StoredStatement {
  id: string
  userId: string
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

// Save statement to Realtime Database
export const saveStatement = async (statement: Omit<StoredStatement, 'id'>, userId: string): Promise<string> => {
  const statementsRef = ref(database, `statements/${userId}`)
  const newStatementRef = push(statementsRef)
  const id = newStatementRef.key!
  
  const statementWithId = { ...statement, id, userId }
  await set(newStatementRef, statementWithId)
  
  return id
}

// Get statements for a user
export const getStatements = async (userId: string): Promise<StoredStatement[]> => {
  const statementsRef = ref(database, `statements/${userId}`)
  const snapshot = await get(statementsRef)
  
  if (snapshot.exists()) {
    const data = snapshot.val()
    return Object.values(data) as StoredStatement[]
  }
  
  return []
}

// Delete statement
export const deleteStatement = async (statementId: string, userId: string): Promise<void> => {
  const statementRef = ref(database, `statements/${userId}/${statementId}`)
  await remove(statementRef)
}

// Listen to real-time changes
export const listenToStatements = (userId: string, callback: (statements: StoredStatement[]) => void) => {
  const statementsRef = ref(database, `statements/${userId}`)
  
  const unsubscribe = onValue(statementsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val()
      const statements = Object.values(data) as StoredStatement[]
      callback(statements)
    } else {
      callback([])
    }
  })
  
  return () => off(statementsRef, 'value', unsubscribe)
}

export default app
