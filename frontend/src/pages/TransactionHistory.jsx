import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Search,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function TransactionHistory() {
  const navigate = useNavigate()

  const [transactions, setTransactions] = useState([])
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    setLoading(true)

    try {
      const response = await api.get('/transactions')
      setTransactions(response.data)
    } catch (error) {
      console.error('Transaction loading failed:', error)
      toast.error('Unable to load transaction history.')
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .sort(
        (first, second) =>
          new Date(second.transactionTime) -
          new Date(first.transactionTime),
      )
      .filter((transaction) => {
        const matchesType =
          typeFilter === 'ALL' || transaction.type === typeFilter

        const searchableText = `${transaction.type} ${transaction.amount} ${transaction.transactionTime}`.toLowerCase()

        const matchesSearch = searchableText.includes(
          searchText.toLowerCase(),
        )

        return matchesType && matchesSearch
      })
  }, [transactions, searchText, typeFilter])

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 font-semibold text-blue-700"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Transaction History
              </h1>

              <p className="mt-2 text-slate-500">
                View and filter your complete wallet activity.
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 px-5 py-3 text-blue-700">
              <p className="text-sm">Total Transactions</p>

              <p className="text-2xl font-bold">
                {transactions.length}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-1 items-center rounded-xl border border-slate-300 px-4 focus-within:border-blue-600">
              <Search size={20} className="text-slate-400" />

              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by type, amount or date"
                className="w-full bg-transparent px-3 py-3 outline-none"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            >
              <option value="ALL">All Transactions</option>
              <option value="CREDIT">Credits Only</option>
              <option value="DEBIT">Debits Only</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
              <p className="text-lg font-semibold text-slate-700">
                No transactions found
              </p>

              <p className="mt-2 text-slate-500">
                Try changing your search or transaction filter.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {filteredTransactions.map((transaction) => {
                const isCredit = transaction.type === 'CREDIT'

                return (
                  <div
                    key={transaction.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-full p-3 ${
                          isCredit
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {isCredit ? (
                          <ArrowDownLeft size={22} />
                        ) : (
                          <ArrowUpRight size={22} />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {isCredit
                            ? 'Money Received'
                            : 'Money Sent'}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {new Date(
                            transaction.transactionTime,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p
                        className={`text-xl font-bold ${
                          isCredit
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {isCredit ? '+' : '-'}₹
                        {Number(transaction.amount).toFixed(2)}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {transaction.type}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory