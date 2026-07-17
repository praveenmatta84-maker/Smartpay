import { ArrowLeft, IndianRupee, Wallet } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function AddMoney() {
  const navigate = useNavigate()

  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAddMoney(event) {
    event.preventDefault()

    const numericAmount = Number(amount)

    if (!numericAmount || numericAmount <= 0) {
      toast.error('Enter a valid positive amount.')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/wallets/add-money', {
        amount: numericAmount,
      })

      toast.success(
        `Money added successfully. New balance: ₹${Number(
          response.data.balance,
        ).toFixed(2)}`,
      )

      setAmount('')

      setTimeout(() => {
        navigate('/dashboard')
      }, 800)
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Unable to add money.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 font-semibold text-blue-700"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Wallet size={30} />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Add Money
          </h1>

          <p className="mt-2 text-slate-500">
            Deposit funds securely into your SmartPay wallet.
          </p>

          <form onSubmit={handleAddMoney} className="mt-7">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Amount
            </label>

            <div className="flex items-center rounded-xl border border-slate-300 px-4 focus-within:border-blue-600">
              <IndianRupee size={20} className="text-slate-400" />

              <input
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
                className="w-full bg-transparent px-3 py-3 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Adding Money...' : 'Add Money'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddMoney