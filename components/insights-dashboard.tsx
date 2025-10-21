"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, TooltipProps } from "recharts"

type ValueType = number | string
type NameType = string

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
}: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length) {
    return (
      <div className={`bg-card border border-border rounded-lg p-3 shadow-lg ${className || ''}`}>
        <p className="font-medium">{`${label}`}</p>
        <p className="text-sm text-muted-foreground">{`${payload[0].name}: ₹${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

interface Transaction {
  date: string
  description: string
  amount: number
  category: string
  tag: string
}

interface Statement {
  issuer: string
  billingCycle: string
  totalDue: string
  cardLast4: string
  paymentDueDate?: string
}

interface InsightsDashboardProps {
  transactions: Transaction[]
  statements: Statement[]
}

export default function InsightsDashboard({ transactions, statements }: InsightsDashboardProps) {
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)
  const categories = ["Food", "Travel", "Shopping", "Utilities", "Entertainment", "Healthcare", "Other"]

  const categoryData = categories
    .map((cat) => ({
      name: cat,
      value: transactions.filter((t) => t.category === cat).reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((d) => d.value > 0)

  const topCategory = categoryData.reduce(
    (max, curr) => (curr.value > max.value ? curr : max),
    categoryData[0] || { name: "N/A", value: 0 },
  )

  const merchantSpending = transactions.reduce((acc: Record<string, number>, t) => {
    const merchant = t.description.split("-")[0].trim()
    acc[merchant] = (acc[merchant] || 0) + t.amount
    return acc
  }, {})

  const topMerchants = Object.entries(merchantSpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, amount]) => ({ name, amount }))

  const COLORS = ["#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  // Calculate days until payment due
  const getDaysUntilDue = () => {
    if (!statements[0]?.paymentDueDate) return null
    const dueDate = new Date(statements[0].paymentDueDate)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDue = getDaysUntilDue()

  // Calculate spending trends
  const getSpendingTrend = () => {
    if (transactions.length < 2) return 'stable'
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const firstHalf = sortedTransactions.slice(0, Math.floor(sortedTransactions.length / 2))
    const secondHalf = sortedTransactions.slice(Math.floor(sortedTransactions.length / 2))
    
    const firstHalfTotal = firstHalf.reduce((sum, t) => sum + t.amount, 0)
    const secondHalfTotal = secondHalf.reduce((sum, t) => sum + t.amount, 0)
    
    if (secondHalfTotal > firstHalfTotal * 1.1) return 'increasing'
    if (secondHalfTotal < firstHalfTotal * 0.9) return 'decreasing'
    return 'stable'
  }

  const spendingTrend = getSpendingTrend()

  const insights = [
    {
      type: "positive",
      title: "Top Spending Category",
      description: `${topCategory.name} accounts for ₹${topCategory.value} (${((topCategory.value / totalSpent) * 100).toFixed(1)}% of total)`,
      icon: TrendingUp,
    },
    {
      type: daysUntilDue && daysUntilDue <= 7 ? "warning" : "positive",
      title: "Payment Due",
      description: daysUntilDue 
        ? `Your payment is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}.`
        : "Payment due date not available.",
      icon: AlertCircle,
    },
    {
      type: spendingTrend === 'increasing' ? "warning" : "positive",
      title: "Spending Trend",
      description: spendingTrend === 'increasing' 
        ? "Your spending has increased recently. Consider reviewing your budget."
        : spendingTrend === 'decreasing'
        ? "Great! Your spending has decreased recently."
        : "Your spending has been stable recently.",
      icon: CheckCircle,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Spent</p>
          <p className="text-3xl font-bold">₹{totalSpent.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Transactions</p>
          <p className="text-3xl font-bold">{transactions.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Top Category</p>
          <p className="text-3xl font-bold">{topCategory.name}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Payment Due</p>
          <p className="text-3xl font-bold">
            {daysUntilDue !== null ? `${daysUntilDue} days` : 'N/A'}
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }: { name: string; value: number }) => `${name}: ₹${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Top Merchants</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topMerchants}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="amount" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, idx) => {
          const Icon = insight.icon
          const bgColor =
            insight.type === "positive"
              ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
              : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900"
          const iconColor =
            insight.type === "positive" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"

          return (
            <Card key={idx} className={`p-4 border ${bgColor}`}>
              <div className="flex gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
