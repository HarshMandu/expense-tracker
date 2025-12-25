import Link from 'next/link';
import { Wallet, TrendingUp, PieChart, Shield, Zap, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Expense Tracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 font-medium hover:text-purple-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl mb-6 animate-pulse">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Take Control of Your
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Financial Future
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track expenses, manage income, and gain insights into your spending habits with our beautiful and intuitive expense tracker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Free Today
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold text-lg hover:shadow-xl transition-all border-2 border-gray-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Everything You Need to Manage Your Money
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="bg-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Track Everything</h3>
            <p className="text-gray-600">
              Monitor all your income and expenses in one place. Categorize transactions for better insights.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <PieChart className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Visual Insights</h3>
            <p className="text-gray-600">
              Beautiful charts and graphs help you understand your spending patterns at a glance.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="bg-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              Your financial data is encrypted and secure. Only you have access to your information.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Lightning Fast</h3>
            <p className="text-gray-600">
              Add transactions in seconds. Our optimized interface makes tracking effortless.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Personal Dashboard</h3>
            <p className="text-gray-600">
              Get a personalized overview of your finances with real-time balance updates.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Wallet className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Category Filters</h3>
            <p className="text-gray-600">
              Filter by food, transport, shopping, and more to see where your money goes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Tracking?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of users who have taken control of their finances
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2024 Expense Tracker. Built with Next.js and MongoDB.</p>
        </div>
      </footer>
    </div>
  );
}