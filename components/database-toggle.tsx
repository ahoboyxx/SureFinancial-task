"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Database, HardDrive } from "lucide-react"
import { useData } from "@/lib/data-context"

export default function DatabaseToggle() {
  const { useLocalStorage, setUseLocalStorage } = useData()
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    // Simulate a brief delay for UX
    setTimeout(() => {
      setUseLocalStorage(!useLocalStorage)
      setIsToggling(false)
    }, 500)
  }

  return (
    <Card className="p-4 bg-muted/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {useLocalStorage ? (
            <HardDrive className="w-5 h-5 text-blue-500" />
          ) : (
            <Database className="w-5 h-5 text-green-500" />
          )}
          <div>
            <p className="font-medium">
              {useLocalStorage ? "Local Storage" : "Firebase Database"}
            </p>
            <p className="text-sm text-muted-foreground">
              {useLocalStorage 
                ? "Data saved in browser" 
                : "Data saved in cloud"
              }
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleToggle}
          disabled={isToggling}
          variant="outline"
          size="sm"
        >
          {isToggling ? "Switching..." : "Switch"}
        </Button>
      </div>
    </Card>
  )
}
