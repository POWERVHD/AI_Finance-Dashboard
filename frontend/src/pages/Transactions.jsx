/**
 * Transactions Page Component
 * Manages all transactions with create, edit, and delete functionality
 */
import { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { transactionsAPI } from '../services/api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await transactionsAPI.getAll();
      setTransactions(response.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    // Refresh transactions list after create/update
    fetchTransactions();
    // Clear editing mode
    setEditingTransaction(null);
  };

  const handleEdit = (transaction) => {
    // Scroll to top to show form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleDelete = () => {
    // Refresh transactions list after delete
    fetchTransactions();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Transactions</h1>
      </div>

      {/* Transaction Form */}
      <div className="card">
        <TransactionForm
          editingTransaction={editingTransaction}
          onSuccess={handleFormSuccess}
          onCancel={handleCancelEdit}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading transactions...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-container">
          <div className="alert alert-error">
            {error}
          </div>
          <button onClick={fetchTransactions} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}

      {/* Transaction List */}
      {!loading && !error && (
        <div className="card">
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}

export default Transactions;
