"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import UploadSection from "@/components/upload-section"
import TransactionTable from "@/components/transaction-table"
import InsightsDashboard from "@/components/insights-dashboard"
import ExportSection from "@/components/export-section"
import AuthModal from "@/components/auth-modal"
import DatabaseToggle from "@/components/database-toggle"
import { ArrowRight, User } from "lucide-react"
import { onAuthChange } from "@/lib/auth"
import { useData } from "@/lib/data-context"
import type { User as FirebaseUser } from "firebase/auth"

export default function Home() {
  const [isDark, setIsDark] = useState(true)
  const [activeTab, setActiveTab] = useState("home")
  const [statements, setStatements] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { addStatement, useLocalStorage, setUseLocalStorage } = useData()

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleStatementUpload = (data: any) => {
    setStatements([...statements, data])
    setTransactions([...transactions, ...data.transactions])
    
    // Save to Firebase or local storage
    addStatement({
      issuer: data.issuer,
      billingCycle: data.billingCycle,
      totalDue: data.totalDue,
      cardLast4: data.cardLast4,
      paymentDueDate: data.paymentDueDate,
      transactions: data.transactions,
      uploadedAt: new Date().toISOString(),
      fileName: 'uploaded-statement.pdf'
    })
  }

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  // Show login screen if user is not authenticated
  if (!user) {
    return (
      <div className={isDark ? "dark" : ""}>
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center space-y-8 max-w-md mx-auto px-4">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Credit Card Parser
              </h1>
              <p className="text-xl text-muted-foreground">
                Parse and analyze your credit card statements with AI-powered insights
              </p>
            </div>
            
            <div className="space-y-4">
              <Button size="lg" onClick={() => setShowAuthModal(true)} className="w-full">
                <User className="w-5 h-5 mr-2" />
                Sign In to Continue
              </Button>
              <p className="text-sm text-muted-foreground">
                Secure access to your financial data
              </p>
            </div>
          </div>
        </div>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </div>
    )
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} toggleTheme={toggleTheme} />

        <main className="container mx-auto px-4 py-12">
          {activeTab === "home" && (
            <div className="space-y-12">
              <div className="text-center space-y-6 py-12">
                <div className="inline-block">
                  <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                    Smart Financial Analysis
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Analyze Your Spending
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Upload your credit card statements and gain deep insights into your spending patterns with interactive
                  visualizations and actionable analytics.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                  <Button size="lg" onClick={() => setActiveTab("dashboard")} className="hover-lift">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              <UploadSection onUpload={handleStatementUpload} />

              <DatabaseToggle />

              {transactions.length === 0 && (
                <div className="grid md:grid-cols-3 gap-6 py-12">
                  {[
                    { title: "Smart Categorization", desc: "Automatically categorize transactions" },
                    { title: "Visual Analytics", desc: "Beautiful charts and insights" },
                    { title: "Export Reports", desc: "Download detailed summaries" },
                  ].map((feature, i) => (
                    <div key={i} className="p-6 rounded-xl bg-card border border-border hover-lift gradient-emerald">
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "dashboard" && transactions.length > 0 && (
            <InsightsDashboard transactions={transactions} statements={statements} />
          )}

          {activeTab === "insights" && transactions.length > 0 && (
            <div className="space-y-8">
              <TransactionTable transactions={transactions} onUpdate={setTransactions} />
            </div>
          )}

          {activeTab === "export" && transactions.length > 0 && (
            <ExportSection transactions={transactions} statements={statements} />
          )}

          {transactions.length === 0 && activeTab !== "home" && (
            <div className="text-center py-20">
              <div className="inline-block p-12 rounded-2xl bg-card border border-border mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8 text-primary" />
                </div>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">No data available yet</p>
              <Button onClick={() => setActiveTab("home")} size="lg" className="hover-lift">
                Upload Your First Statement
              </Button>
            </div>
          )}
        </main>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </div>
    </div>
  )
}
