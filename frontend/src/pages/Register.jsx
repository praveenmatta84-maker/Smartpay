import {
  LockKeyhole,
  Mail,
  User,
  UserPlus,
  WalletCards,
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)

    try {
      await api.post('/users/register', formData)

      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Registration failed. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-700 to-blue-600 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white">
            <WalletCards size={34} />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Create SmartPay Account
          </h1>

          <p className="mt-2 text-slate-500">
            Start managing your money securely
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name
            </label>

            <div className="flex items-center rounded-xl border border-slate-300 px-4 focus-within:border-blue-600">
              <User size={20} className="text-slate-400" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full bg-transparent px-3 py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <div className="flex items-center rounded-xl border border-slate-300 px-4 focus-within:border-blue-600">
              <Mail size={20} className="text-slate-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full bg-transparent px-3 py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <div className="flex items-center rounded-xl border border-slate-300 px-4 focus-within:border-blue-600">
              <LockKeyhole size={20} className="text-slate-400" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
                className="w-full bg-transparent px-3 py-3 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus size={20} />
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register