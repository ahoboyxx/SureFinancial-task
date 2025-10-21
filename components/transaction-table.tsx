"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Transaction {
  date: string
  description: string
  amount: number
  category: string
  tag: string
}

interface TransactionTableProps {
  transactions: Transaction[]
  onUpdate: (transactions: Transaction[]) => void
}

const CATEGORIES = ["Food", "Travel", "Shopping", "Utilities", "Entertainment", "Healthcare", "Other"]

export default function TransactionTable({ transactions, onUpdate }: TransactionTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 5000])
  const [editingId, setEditingId] = useState<number | null>(null)

  const filteredTransactions = transactions.filter((t) => {
    if (selectedCategory && t.category !== selectedCategory) return false
    if (t.amount < amountRange[0] || t.amount > amountRange[1]) return false
    return true
  })

  const handleTagChange = (index: number, newTag: string) => {
    const updated = [...transactions]
    updated[index].tag = newTag
    onUpdate(updated)
    setEditingId(null)
  }

  const categorySpending = CATEGORIES.map((cat) => ({
    category: cat,
    amount: transactions.filter((t) => t.category === cat).reduce((sum, t) => sum + t.amount, 0),
    count: transactions.filter((t) => t.category === cat).length,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Filters */}
      <div className="lg:col-span-1">
        <Card className="p-4 sticky top-4">
          <h3 className="font-semibold mb-4">Filters</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Category</label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === null ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Amount Range</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={amountRange[1]}
                  onChange={(e) => setAmountRange([amountRange[0], Number.parseInt(e.target.value)])}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">₹0 - ₹{amountRange[1]}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-3">Spending by Category</h4>
              <div className="space-y-2">
                {categorySpending.map(({ category, amount, count }) => (
                  <div key={category} className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span>{category}</span>
                      <span className="font-semibold">₹{amount}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${(amount / Math.max(...categorySpending.map((c) => c.amount))) * 100}%` }}
                      />
                    </div>
                    <p className="text-muted-foreground mt-0.5">{count} transactions</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <div className="lg:col-span-3">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tag</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm">{transaction.date}</td>
                    <td className="px-4 py-3 text-sm">{transaction.description}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">₹{transaction.amount}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="relative">
                        <button
                          onClick={() => setEditingId(editingId === idx ? null : idx)}
                          className="px-2 py-1 rounded-lg bg-muted hover:bg-muted/80 text-xs font-medium flex items-center gap-1"
                        >
                          {transaction.tag}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        {editingId === idx && (
                          <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-lg shadow-lg z-10 min-w-max">
                            {CATEGORIES.map((cat) => (
                              <button
                                key={cat}
                                onClick={() => handleTagChange(idx, cat)}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-muted first:rounded-t-lg last:rounded-b-lg"
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
