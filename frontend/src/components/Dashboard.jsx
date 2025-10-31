/**
 * Dashboard Component
 * Displays financial summary and recent transactions
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

function Dashboard({ summary }) {
  if (!summary) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  const {
    total_income = 0,
    total_expense = 0,
    balance = 0,
    recent_transactions = [],
    expenses_by_category = {},
  } = summary;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Income Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(total_income)}
            </div>
          </CardContent>
        </Card>

        {/* Total Expense Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(total_expense)}
            </div>
          </CardContent>
        </Card>

        {/* Balance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions and Expenses by Category */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recent_transactions.length > 0 ? (
              <div className="space-y-4">
                {recent_transactions.map((transaction, index) => (
                  <div key={transaction.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {transaction.type === 'income' ? (
                            <ArrowUpCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4 text-red-600" />
                          )}
                          <p className="font-medium">{transaction.description}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(transaction.transaction_date)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </p>
                      </div>
                    </div>
                    {index < recent_transactions.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent transactions
              </p>
            )}
          </CardContent>
        </Card>

        {/* Expenses by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(expenses_by_category).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(expenses_by_category)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{category}</span>
                        <span className="font-semibold">{formatCurrency(amount)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${(amount / total_expense) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No expense data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
