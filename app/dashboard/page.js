'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Wallet, Plus, TrendingDown, TrendingUp, Calendar, Filter, Trash2, Edit2, X, Check, DollarSign, ShoppingBag, Home, Car, Utensils, Heart, Zap, MoreHorizontal, LogOut, User } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [initialBalance, setInitialBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [newBalance, setNewBalance] = useState('');
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { name: 'food', icon: Utensils, color: 'bg-orange-500' },
    { name: 'transport', icon: Car, color: 'bg-blue-500' },
    { name: 'shopping', icon: ShoppingBag, color: 'bg-pink-500' },
    { name: 'home', icon: Home, color: 'bg-green-500' },
    { name: 'health', icon: Heart, color: 'bg-red-500' },
    { name: 'utilities', icon: Zap, color: 'bg-yellow-500' },
    { name: 'other', icon: MoreHorizontal, color: 'bg-purple-500' }
  ];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesRes, incomeRes] = await Promise.all([
        fetch('/api/expenses'),
        fetch('/api/income')
      ]);
      
      const expensesData = await expensesRes.json();
      const incomeData = await incomeRes.json();
      
      if (expensesData.success) setExpenses(expensesData.data);
      if (incomeData.success) setIncome(incomeData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.amount || formData.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const endpoint = formData.type === 'expense' ? '/api/expenses' : '/api/income';
      const method = editingId ? 'PUT' : 'POST';
      
      const dataToSend = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
        ...(formData.type === 'expense' && { category: formData.category }),
        ...(editingId && { id: editingId })
      };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (result.success) {
        await fetchData();
        setShowModal(false);
        setEditingId(null);
        setEditingType(null);
        setFormData({
          type: 'expense',
          amount: '',
          category: 'food',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Error submitting transaction');
    }
  };

  const handleEdit = (entry, type) => {
    setFormData({
      type,
      amount: entry.amount.toString(),
      category: entry.category || 'food',
      description: entry.description || '',
      date: new Date(entry.date).toISOString().split('T')[0]
    });
    setEditingId(entry._id);
    setEditingType(type);
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const endpoint = type === 'expense' ? '/api/expenses' : '/api/income';
      const response = await fetch(`${endpoint}?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        await fetchData();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting transaction');
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = totalIncome - totalExpenses;

  const getFilteredTransactions = () => {
    const allTransactions = [
      ...expenses.map(e => ({ ...e, type: 'expense' })),
      ...income.map(i => ({ ...i, type: 'income', category: 'income' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filter === 'all') return allTransactions;
    return allTransactions.filter(t => t.type === 'expense' && t.category === filter);
  };

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    const Icon = category?.icon || MoreHorizontal;
    return { Icon, color: category?.color || 'bg-gray-500' };
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Wallet className="w-16 h-16 text-purple-600 animate-pulse mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <Wallet className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Expense Tracker</h1>
                <p className="text-indigo-100 text-sm">Welcome back, {session.user.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowModal(true);
                  setEditingId(null);
                  setEditingType(null);
                  setFormData({
                    type: 'expense',
                    amount: '',
                    category: 'food',
                    description: '',
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Transaction
              </button>
              <button
                onClick={handleSignOut}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-300" />
                <p className="text-indigo-100 text-sm font-medium">Total Income</p>
              </div>
              <p className="text-3xl font-bold">₹{totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-5 h-5 text-red-300" />
                <p className="text-indigo-100 text-sm font-medium">Total Expenses</p>
              </div>
              <p className="text-3xl font-bold">₹{totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-5 h-5 text-yellow-300" />
                <p className="text-indigo-100 text-sm font-medium">Balance</p>
              </div>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                ₹{balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setFilter(cat.name)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    filter === cat.name
                      ? `${cat.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Recent Transactions
          </h2>
          <div className="space-y-3">
            {getFilteredTransactions().length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Wallet className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No transactions yet</p>
                <p className="text-sm">Start by adding your first transaction</p>
              </div>
            ) : (
              getFilteredTransactions().map(transaction => {
                const { Icon, color } = getCategoryIcon(transaction.category);
                return (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${color} p-3 rounded-xl`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {transaction.description || transaction.category}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="capitalize">{transaction.category}</span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className={`text-xl font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(transaction, transaction.type)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction._id, transaction.type)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setEditingType(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`p-3 rounded-xl font-medium transition-all ${
                      formData.type === 'expense'
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <TrendingDown className="w-5 h-5 mx-auto mb-1" />
                    Expense
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`p-3 rounded-xl font-medium transition-all ${
                      formData.type === 'income'
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="0.00"
                />
              </div>

              {formData.type === 'expense' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="e.g., Lunch at restaurant"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                {editingId ? 'Update Transaction' : 'Add Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}