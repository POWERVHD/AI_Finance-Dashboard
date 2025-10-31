/**
 * TransactionList Component
 * Displays list of transactions with edit/delete functionality
 */
import { useState } from 'react';
import { transactionsAPI } from '../services/api';

function TransactionList({ transactions, onEdit, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount) || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDeleteClick = (transaction) => {
    setConfirmDelete(transaction);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;

    try {
      setDeletingId(confirmDelete.id);
      await transactionsAPI.delete(confirmDelete.id);

      // Notify parent to refresh list
      if (onDelete) {
        onDelete();
      }

      setConfirmDelete(null);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      alert('Failed to delete transaction. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="transaction-list-container">
        <h3>All Transactions</h3>
        <div className="empty-state">
          <p>No transactions yet. Add your first transaction above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list-container">
      <h3>All Transactions ({transactions.length})</h3>

      {/* Desktop Table View */}
      <div className="table-container desktop-only">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{formatDate(transaction.transaction_date)}</td>
                <td>{transaction.description}</td>
                <td>
                  <span className="badge">{transaction.category}</span>
                </td>
                <td>
                  <span className={`badge badge-${transaction.type}`}>
                    {transaction.type}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      transaction.type === 'income' ? 'text-success' : 'text-danger'
                    }
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="btn btn-sm btn-secondary"
                      disabled={deletingId === transaction.id}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(transaction)}
                      className="btn btn-sm btn-danger"
                      disabled={deletingId === transaction.id}
                    >
                      {deletingId === transaction.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="transaction-cards mobile-only">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-card">
            <div className="transaction-card-header">
              <span className="transaction-date">
                {formatDate(transaction.transaction_date)}
              </span>
              <span className={`badge badge-${transaction.type}`}>
                {transaction.type}
              </span>
            </div>
            <div className="transaction-card-body">
              <h4>{transaction.description}</h4>
              <p className="transaction-category">{transaction.category}</p>
              <p
                className={`transaction-amount ${
                  transaction.type === 'income' ? 'text-success' : 'text-danger'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
            <div className="transaction-card-footer">
              <button
                onClick={() => onEdit(transaction)}
                className="btn btn-sm btn-secondary"
                disabled={deletingId === transaction.id}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(transaction)}
                className="btn btn-sm btn-danger"
                disabled={deletingId === transaction.id}
              >
                {deletingId === transaction.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this transaction?</p>
              <div className="delete-preview">
                <p><strong>{confirmDelete.description}</strong></p>
                <p>{formatCurrency(confirmDelete.amount)} - {confirmDelete.category}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleDeleteCancel}
                className="btn btn-secondary"
                disabled={deletingId === confirmDelete.id}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn btn-danger"
                disabled={deletingId === confirmDelete.id}
              >
                {deletingId === confirmDelete.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
