/**
 * Dashboard Component
 * Displays financial summary and recent transactions
 */

function Dashboard({ summary }) {
  if (!summary) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard data...</p>
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
    <div className="dashboard">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card card-income">
          <div className="card-header">
            <span className="card-icon">=È</span>
            <h3>Total Income</h3>
          </div>
          <div className="card-body">
            <p className="amount text-success">{formatCurrency(total_income)}</p>
          </div>
        </div>

        <div className="card card-expense">
          <div className="card-header">
            <span className="card-icon">=É</span>
            <h3>Total Expense</h3>
          </div>
          <div className="card-body">
            <p className="amount text-danger">{formatCurrency(total_expense)}</p>
          </div>
        </div>

        <div className="card card-balance">
          <div className="card-header">
            <span className="card-icon">=µ</span>
            <h3>Balance</h3>
          </div>
          <div className="card-body">
            <p className={`amount ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions and Expenses by Category */}
      <div className="dashboard-details">
        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Transactions</h3>
          </div>
          <div className="card-body">
            {recent_transactions.length > 0 ? (
              <div className="transactions-list">
                {recent_transactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-info">
                      <p className="transaction-description">{transaction.description}</p>
                      <p className="transaction-meta">
                        {transaction.category} " {formatDate(transaction.transaction_date)}
                      </p>
                    </div>
                    <div className="transaction-amount">
                      <p
                        className={
                          transaction.type === 'income' ? 'text-success' : 'text-danger'
                        }
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No recent transactions</p>
            )}
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="card">
          <div className="card-header">
            <h3>Expenses by Category</h3>
          </div>
          <div className="card-body">
            {Object.keys(expenses_by_category).length > 0 ? (
              <div className="category-list">
                {Object.entries(expenses_by_category)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className="category-item">
                      <div className="category-info">
                        <span className="category-name">{category}</span>
                        <div className="category-bar">
                          <div
                            className="category-bar-fill"
                            style={{
                              width: `${(amount / total_expense) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="category-amount">{formatCurrency(amount)}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="empty-state">No expense data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
