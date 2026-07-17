function WalletCard({
  title,
  value,
  subtitle,
  icon,
  iconClassName = 'bg-blue-100 text-blue-700',
  valueClassName = 'text-slate-900',
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className={`mt-3 text-3xl font-bold ${valueClassName}`}>
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div className={`rounded-xl p-3 ${iconClassName}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default WalletCard