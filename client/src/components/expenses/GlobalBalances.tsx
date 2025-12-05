import React, { useMemo } from 'react';
import { CheckCircle } from 'lucide-react';

interface Expense {
    _id: string;
    description: string;
    amount: number;
    date: string;
    payer: {
        _id: string;
        name: string;
        avatar?: string;
    };
    shares: Array<{
        user: {
            _id: string;
            name: string;
            avatar?: string;
        };
        amount: number;
    }>;
}

interface GlobalBalancesProps {
    expenses: Expense[];
    currentUserId: string;
}

const GlobalBalances: React.FC<GlobalBalancesProps> = ({ expenses, currentUserId }) => {
    const balances = useMemo(() => {
        const balanceMap: Record<string, { amount: number; user: any }> = {};

        expenses.forEach(expense => {
            const isPayer = expense.payer._id === currentUserId;

            if (isPayer) {
                // You paid, so others owe you
                expense.shares.forEach(share => {
                    if (share.user._id !== currentUserId) {
                        const otherId = share.user._id;
                        if (!balanceMap[otherId]) {
                            balanceMap[otherId] = { amount: 0, user: share.user };
                        }
                        balanceMap[otherId].amount += share.amount;
                    }
                });
            } else {
                // Someone else paid
                const yourShare = expense.shares.find(s => s.user._id === currentUserId);
                if (yourShare) {
                    // You owe the payer
                    const payerId = expense.payer._id;
                    if (!balanceMap[payerId]) {
                        balanceMap[payerId] = { amount: 0, user: expense.payer };
                    }
                    balanceMap[payerId].amount -= yourShare.amount;
                }
            }
        });

        return Object.values(balanceMap).sort((a, b) => b.amount - a.amount);
    }, [expenses, currentUserId]);

    const totalNetBalance = balances.reduce((sum, b) => sum + b.amount, 0);

    return (
        <div className="space-y-6">
            {/* Total Balance Card */}
            <div className={`p-6 rounded-2xl shadow-sm border ${totalNetBalance >= 0
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
                : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100'
                }`}>
                <p className="text-gray-600 font-medium mb-1">Total Net Balance</p>
                <h2 className={`text-4xl font-bold ${totalNetBalance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {totalNetBalance >= 0 ? '+' : ''}${totalNetBalance.toFixed(2)}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                    {totalNetBalance >= 0
                        ? "You are owed in total"
                        : "You owe in total"}
                </p>
            </div>

            {/* Friends List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* You are owed */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        You are owed
                    </h3>
                    <div className="space-y-4">
                        {balances.filter(b => b.amount > 0.01).length > 0 ? (
                            balances.filter(b => b.amount > 0.01).map((balance) => (
                                <div key={balance.user._id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={balance.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(balance.user.name)}&background=random`}
                                            alt={balance.user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{balance.user.name}</p>
                                            <p className="text-xs text-green-600 font-medium">owes you</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-green-600">${balance.amount.toFixed(2)}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p>No one owes you anything</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* You owe */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        You owe
                    </h3>
                    <div className="space-y-4">
                        {balances.filter(b => b.amount < -0.01).length > 0 ? (
                            balances.filter(b => b.amount < -0.01).map((balance) => (
                                <div key={balance.user._id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={balance.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(balance.user.name)}&background=random`}
                                            alt={balance.user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{balance.user.name}</p>
                                            <p className="text-xs text-red-600 font-medium">you owe</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-red-600">${Math.abs(balance.amount).toFixed(2)}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p>You don't owe anything</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalBalances;
