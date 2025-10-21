"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, TrendingUp } from "lucide-react"

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isDark: boolean
  toggleTheme: () => void
}

export default function Navigation({ activeTab, setActiveTab, isDark, toggleTheme }: NavigationProps) {
  const tabs = ["home", "dashboard", "insights", "export"]
  const tabLabels: Record<string, string> = {
    home: "Home",
    dashboard: "Dashboard",
    insights: "Insights",
    export: "Export",
  }

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                SpendSmart
              </h1>
              <p className="text-xs text-muted-foreground">Financial Analytics</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover-lift">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ease-out whitespace-nowrap relative group ${
                activeTab === tab ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground hover:bg-muted/50"
              }`}
            >
              {tabLabels[tab]}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary-foreground to-primary/0 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
