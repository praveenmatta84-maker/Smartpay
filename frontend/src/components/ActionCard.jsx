function ActionCard({
  title,
  description,
  buttonText,
  onClick,
  icon,
  iconClassName = 'bg-blue-100 text-blue-700',
  buttonClassName = 'bg-blue-700 hover:bg-blue-800',
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className={`inline-flex rounded-xl p-3 ${iconClassName}`}>
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className={`mt-5 w-full rounded-lg px-4 py-3 font-semibold text-white transition ${buttonClassName}`}
      >
        {buttonText}
      </button>
    </div>
  )
}

export default ActionCard