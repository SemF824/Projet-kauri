import { Wallet, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

interface Transaction {
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
}

interface WalletWidgetProps {
  balance: number;
  transactions: Transaction[];
}

export function WalletWidget({ balance, transactions }: WalletWidgetProps) {
  return (
    <div className="bg-gradient-to-br from-[#0A2540] to-[#0F3554] rounded-xl p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5" />
        <h3>Digital Wallet</h3>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-300 mb-1">Available Balance</p>
        <p className="text-3xl">{balance.toLocaleString()}€</p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-300 mb-3">Recent Transactions</p>
        <div className="space-y-2">
          {transactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {transaction.type === 'deposit' ? (
                  <ArrowDownRight className="w-4 h-4 text-[#10B981]" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-[#F59E0B]" />
                )}
                <span className="text-gray-200">{transaction.description}</span>
              </div>
              <span className={transaction.type === 'deposit' ? 'text-[#10B981]' : 'text-[#F59E0B]'}>
                {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount}€
              </span>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
        <Plus className="w-4 h-4" />
        Add Funds
      </button>
    </div>
  );
}
