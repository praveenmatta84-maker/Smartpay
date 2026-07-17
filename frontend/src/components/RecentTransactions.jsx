import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

function RecentTransactions({ transactions = [], onViewAll }) {
  const recentTransactions = [...transactions]
    .sort(
      (first, second) =>
        new Date(second.transactionTime) -
        new Date(first.transactionTime),
    )
    .slice(0, 5)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">
            Recent Transactions
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Your latest wallet activity
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          View all
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {recentTransactions.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-500">
              No transactions available yet.
            </p>
          </div>
        ) : (
          recentTransactions.map((transaction) => {
            const isCredit = transaction.type === 'CREDIT'

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
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
                      <ArrowDownLeft size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      {isCredit ? 'Money Received' : 'Money Sent'}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(
                        transaction.transactionTime,
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <p
                  className={`text-lg font-bold ${
                    isCredit ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isCredit ? '+' : '-'}₹
                  {Number(transaction.amount).toFixed(2)}
                </p>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}

export default RecentTransactions