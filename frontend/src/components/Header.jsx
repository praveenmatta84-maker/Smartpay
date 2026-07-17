import { Bell, LogOut, WalletCards } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Header({ name }) {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3"
        >
          <div className="rounded-xl bg-blue-700 p-2 text-white">
            <WalletCards size={25} />
          </div>

          <div className="text-left">
            <h1 className="text-xl font-bold text-slate-900">SmartPay</h1>
            <p className="text-xs text-slate-500">Secure Digital Wallet</p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 sm:block"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-slate-800">
              {name || 'SmartPay User'}
            </p>
            <p className="text-xs text-green-600">Account active</p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header