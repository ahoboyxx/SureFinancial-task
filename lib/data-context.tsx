"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { StoredStatement } from './local-storage'
import { getStatements as getLocalStatements, saveStatement as saveLocalStatement } from './local-storage'

interface DataContextType {
  statements: StoredStatement[]
  addStatement: (statement: Omit<StoredStatement, 'id'>) => void
  isLoading: boolean
  useLocalStorage: boolean
  setUseLocalStorage: (use: boolean) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [statements, setStatements] = useState<StoredStatement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [useLocalStorage, setUseLocalStorage] = useState(true) // Default to local storage

  useEffect(() => {
    loadStatements()
  }, [useLocalStorage])

  const loadStatements = async () => {
    setIsLoading(true)
    try {
      if (useLocalStorage) {
        const localStatements = getLocalStatements()
        setStatements(localStatements)
      } else {
        // Firebase implementation would go here
        // For now, fallback to local storage
        const localStatements = getLocalStatements()
        setStatements(localStatements)
      }
    } catch (error) {
      console.error('Error loading statements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addStatement = (statement: Omit<StoredStatement, 'id'>) => {
    try {
      if (useLocalStorage) {
        const id = saveLocalStatement(statement)
        const newStatement = { ...statement, id }
        setStatements(prev => [...prev, newStatement])
      } else {
        // Firebase implementation would go here
        const id = saveLocalStatement(statement)
        const newStatement = { ...statement, id }
        setStatements(prev => [...prev, newStatement])
      }
    } catch (error) {
      console.error('Error saving statement:', error)
    }
  }

  return (
    <DataContext.Provider value={{
      statements,
      addStatement,
      isLoading,
      useLocalStorage,
      setUseLocalStorage
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    // Return default values instead of throwing error for better compatibility
    return {
      statements: [],
      addStatement: () => {},
      isLoading: false,
      useLocalStorage: true,
      setUseLocalStorage: () => {}
    }
  }
  return context
}
