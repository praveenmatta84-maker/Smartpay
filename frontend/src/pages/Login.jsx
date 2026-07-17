import { LockKeyhole, Mail, WalletCards } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
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
      const response = await api.post('/users/login', formData)

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userName', response.data.name)
      localStorage.setItem('role', response.data.role)

      toast.success('Login successful!')

      if (response.data.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Login failed. Please check your details.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-700 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white">
            <WalletCards size={34} />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Welcome to SmartPay
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                placeholder="Enter your password"
                required
                className="w-full bg-transparent px-3 py-3 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-700">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login