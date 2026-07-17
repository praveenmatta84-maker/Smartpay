import {
  AlertTriangle,
  ArrowLeft,
  IndianRupee,
  Send,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function TransferMoney() {
  const navigate = useNavigate()

  const [receiverUserId, setReceiverUserId] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  function handleInitialSubmit(event) {
    event.preventDefault()

    const receiverId = Number(receiverUserId)
    const numericAmount = Number(amount)

    if (!receiverId || receiverId <= 0) {
      toast.error('Enter a valid receiver user ID.')
      return
    }

    if (!numericAmount || numericAmount <= 0) {
      toast.error('Enter a valid transfer amount.')
      return
    }

    setShowConfirmation(true)
  }

  async function confirmTransfer() {
    setLoading(true)

    try {
      await api.post('/wallets/transfer', {
        receiverUserId: Number(receiverUserId),
        amount: Number(amount),
      })

      toast.success('Money transferred successfully!')

      setShowConfirmation(false)
      setReceiverUserId('')
      setAmount('')

      setTimeout(() => {
        navigate('/dashboard')
      }, 800)
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Money transfer failed. Please try again.',
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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <Send size={29} />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Transfer Money
          </h1>

          <p className="mt-2 text-slate-500">
            Send money securely to another SmartPay user.
          </p>

          <form onSubmit={handleInitialSubmit} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Receiver User ID
              </label>

              <div className="flex items-center rounded-xl border border-slate-300 px-4 focus-within:border-green-600">
                <UserRound size={20} className="text-slate-400" />

                <input
                  type="number"
                  value={receiverUserId}
                  onChange={(event) =>
                    setReceiverUserId(event.target.value)
                  }
                  placeholder="Enter receiver ID"
                  min="1"
                  required
                  className="w-full bg-transparent px-3 py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Amount
              </label>

              <div className="flex items-center rounded-xl border border-slate-300 px-4 focus-within:border-green-600">
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
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Continue
            </button>
          </form>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <AlertTriangle size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              Confirm Transfer
            </h2>

            <p className="mt-2 text-slate-500">
              Please verify the transfer details before continuing.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-5">
              <div className="flex justify-between">
                <span className="text-slate-500">Receiver ID</span>

                <span className="font-semibold text-slate-900">
                  {receiverUserId}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Amount</span>

                <span className="font-bold text-green-700">
                  ₹{Number(amount).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 py-3 font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmTransfer}
                disabled={loading}
                className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? 'Transferring...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransferMoney