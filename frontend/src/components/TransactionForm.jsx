/**
 * TransactionForm Component
 * Form for creating and editing transactions
 */
import { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';

// Categories constant matching backend
const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Personal Care',
  'Travel',
  'Income',
  'Other',
];

function TransactionForm({ editingTransaction, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    type: 'expense',
    category: 'Other',
    transaction_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: Math.abs(editingTransaction.amount).toString(),
        description: editingTransaction.description,
        type: editingTransaction.type,
        category: editingTransaction.category,
        transaction_date: editingTransaction.transaction_date,
      });
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear messages when user types
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);

    try {
      const transactionData = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        type: formData.type,
        category: formData.category,
        transaction_date: formData.transaction_date,
      };

      if (editingTransaction) {
        // Update existing transaction
        await transactionsAPI.update(editingTransaction.id, transactionData);
        setSuccess('Transaction updated successfully!');
      } else {
        // Create new transaction
        await transactionsAPI.create(transactionData);
        setSuccess('Transaction created successfully!');
        // Reset form
        setFormData({
          amount: '',
          description: '',
          type: 'expense',
          category: 'Other',
          transaction_date: new Date().toISOString().split('T')[0],
        });
      }

      // Notify parent component
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err) {
      console.error('Transaction error:', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to save transaction. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      amount: '',
      description: '',
      type: 'expense',
      category: 'Other',
      transaction_date: new Date().toISOString().split('T')[0],
    });
    setError('');
    setSuccess('');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="transaction-form-container">
      <h3>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="transaction_date">Date</label>
            <input
              type="date"
              id="transaction_date"
              name="transaction_date"
              value={formData.transaction_date}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter transaction description"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Expense</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Income</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
            required
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : editingTransaction ? 'Update Transaction' : 'Add Transaction'}
          </button>
          {editingTransaction && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;
