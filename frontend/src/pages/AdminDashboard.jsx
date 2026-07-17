import {
  ArrowLeftRight,
  Banknote,
  CircleDollarSign,
  LogOut,
  RefreshCw,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import AdminStatCard from '../components/AdminStatCard'
import AdminUserTable from '../components/AdminUserTable'
import api from '../services/api'

function AdminDashboard() {
  const navigate = useNavigate()

  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalWalletBalance: 0,
    totalCredits: 0,
    totalDebits: 0,
  })

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingUserId, setDeletingUserId] = useState(null)

  useEffect(() => {
    loadAdminData()
  }, [])

  async function loadAdminData() {
    setLoading(true)

    try {
      const [statisticsResponse, usersResponse] = await Promise.all([
        api.get('/admin/statistics'),
        api.get('/admin/users'),
      ])

      setStatistics(statisticsResponse.data)
      setUsers(usersResponse.data)
    } catch (error) {
      console.error('Admin dashboard loading failed:', error)

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        toast.error('Admin access required.')
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        navigate('/login')
        return
      }

      toast.error('Unable to load admin dashboard.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteUser(user) {
    const confirmed = window.confirm(
      `Delete user "${user.name}" with email ${user.email}?`,
    )

    if (!confirmed) {
      return
    }

    setDeletingUserId(user.id)

    try {
      await api.delete(`/admin/users/${user.id}`)

      toast.success('User deleted successfully.')
      await loadAdminData()
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Unable to delete user.',
      )
    } finally {
      setDeletingUserId(null)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700" />

          <p className="mt-4 font-medium text-slate-600">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold text-purple-700">
              SmartPay Admin
            </h1>

            <p className="text-sm text-slate-500">
              Manage users and monitor wallet activity
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadAdminData}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <section className="rounded-3xl bg-gradient-to-r from-purple-800 to-indigo-700 p-8 text-white shadow-lg">
          <p className="text-sm font-medium text-purple-100">
            Administrator Panel
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            SmartPay System Overview
          </h2>

          <p className="mt-3 max-w-2xl text-purple-100">
            Monitor users, wallet balances, credits, debits and overall
            platform activity.
          </p>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          <AdminStatCard
            title="Total Users"
            value={statistics.totalUsers}
            subtitle="Registered accounts"
            icon={<Users size={24} />}
            iconClassName="bg-blue-100 text-blue-700"
          />

          <AdminStatCard
            title="Wallet Balance"
            value={`₹${Number(
              statistics.totalWalletBalance,
            ).toFixed(2)}`}
            subtitle="Combined wallets"
            valueClassName="text-green-700"
            icon={<Banknote size={24} />}
            iconClassName="bg-green-100 text-green-700"
          />

          <AdminStatCard
            title="Transactions"
            value={statistics.totalTransactions}
            subtitle="All platform activity"
            icon={<ArrowLeftRight size={24} />}
            iconClassName="bg-orange-100 text-orange-700"
          />

          <AdminStatCard
            title="Total Credits"
            value={`₹${Number(statistics.totalCredits).toFixed(2)}`}
            subtitle="Money credited"
            valueClassName="text-blue-700"
            icon={<CircleDollarSign size={24} />}
            iconClassName="bg-blue-100 text-blue-700"
          />

          <AdminStatCard
            title="Total Debits"
            value={`₹${Number(statistics.totalDebits).toFixed(2)}`}
            subtitle="Money debited"
            valueClassName="text-red-700"
            icon={<CircleDollarSign size={24} />}
            iconClassName="bg-red-100 text-red-700"
          />
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              User Management
            </h2>

            <p className="mt-1 text-slate-500">
              View user details, roles and wallet balances.
            </p>
          </div>

          <AdminUserTable
            users={users}
            onDeleteUser={handleDeleteUser}
            deletingUserId={deletingUserId}
          />
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard
