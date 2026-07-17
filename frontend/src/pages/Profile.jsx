import { useEffect, useState } from 'react'
import {
  ArrowLeftRight,
  BadgeCheck,
  History,
  IndianRupee,
  User,
  UserRound,
  Wallet,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ActionCard from '../components/ActionCard'
import Header from '../components/Header'
import RecentTransactions from '../components/RecentTransactions'
import WalletCard from '../components/WalletCard'
import api from '../services/api'

function Dashboard() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState({})
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    setLoading(true)
    setError('')

    try {
      const [
        profileResponse,
        balanceResponse,
        transactionsResponse,
      ] = await Promise.all([
        api.get('/users/profile'),
        api.get('/wallets/balance'),
        api.get('/transactions'),
      ])

      setProfile(profileResponse.data)
      setBalance(balanceResponse.data.balance)
      setTransactions(transactionsResponse.data)
    } catch (requestError) {
      console.error('Dashboard loading failed:', requestError)

      if (
        requestError.response?.status === 401 ||
        requestError.response?.status === 403
      ) {
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        navigate('/login')
        return
      }

      setError('Unable to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />

          <p className="mt-4 font-medium text-slate-600">
            Loading SmartPay dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header name={profile.name} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-800 to-indigo-700 p-7 text-white shadow-lg sm:p-10">
          <p className="text-sm font-medium text-blue-100">
            Welcome back
          </p>

          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Hello, {profile.name || 'SmartPay User'} 👋
          </h2>

          <p className="mt-3 max-w-2xl text-blue-100">
            Manage your wallet, transfer funds and review your
            transactions securely from one dashboard.
          </p>

          <div className="mt-7">
            <p className="text-sm text-blue-100">Available balance</p>

            <p className="mt-2 text-4xl font-bold sm:text-5xl">
              ₹{Number(balance).toFixed(2)}
            </p>
          </div>
        </section>

        {error && (
          <div className="mt-6 flex items-center justify-between rounded-xl bg-red-100 p-4 text-red-700">
            <p>{error}</p>

            <button
              type="button"
              onClick={loadDashboardData}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Account Overview
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <WalletCard
              title="Wallet Balance"
              value={`₹${Number(balance).toFixed(2)}`}
              subtitle="Available for transfer"
              valueClassName="text-green-600"
              icon={<IndianRupee size={24} />}
              iconClassName="bg-green-100 text-green-700"
            />

            <WalletCard
              title="SmartPay User ID"
              value={profile.id || '-'}
              subtitle="Your unique account ID"
              icon={<User size={24} />}
              iconClassName="bg-blue-100 text-blue-700"
            />

            <WalletCard
              title="Account Status"
              value="ACTIVE"
              subtitle="Your account is verified"
              valueClassName="text-blue-700"
              icon={<BadgeCheck size={24} />}
              iconClassName="bg-indigo-100 text-indigo-700"
            />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-2 text-slate-500">
            Select an action to manage your account.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <ActionCard
              title="Add Money"
              description="Deposit funds securely into your SmartPay wallet."
              buttonText="Add Money"
              icon={<Wallet size={24} />}
              iconClassName="bg-blue-100 text-blue-700"
              buttonClassName="bg-blue-700 hover:bg-blue-800"
              onClick={() => navigate('/add-money')}
            />

            <ActionCard
              title="Transfer Money"
              description="Send money instantly to another SmartPay user."
              buttonText="Transfer"
              icon={<ArrowLeftRight size={24} />}
              iconClassName="bg-green-100 text-green-700"
              buttonClassName="bg-green-600 hover:bg-green-700"
              onClick={() => navigate('/transfer')}
            />

            <ActionCard
              title="Transactions"
              description="View your complete credit and debit history."
              buttonText="View History"
              icon={<History size={24} />}
              iconClassName="bg-orange-100 text-orange-700"
              buttonClassName="bg-orange-600 hover:bg-orange-700"
              onClick={() => navigate('/transactions')}
            />

            <ActionCard
              title="Profile"
              description="View your personal account and wallet details."
              buttonText="View Profile"
              icon={<UserRound size={24} />}
              iconClassName="bg-purple-100 text-purple-700"
              buttonClassName="bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate('/profile')}
            />
          </div>
        </section>

        <div className="mt-10">
          <RecentTransactions
            transactions={transactions}
            onViewAll={() => navigate('/transactions')}
          />
        </div>
      </main>
    </div>
  )
}

export default Dashboard