import React, { useEffect } from 'react';
import { User } from 'lucide-react';

interface Traveler {
    _id: string;
    name: string;
    avatar?: string;
}

interface SplitShare {
    user: string;
    amount: number;
    share: number;
}

interface ExpenseSplitProps {
    amount: number;
    travelers: Traveler[];
    splitMode: 'EVENLY' | 'BY_SHARES' | 'BY_PERCENTAGE' | 'BY_AMOUNT';
    shares: SplitShare[];
    onSharesChange: (shares: SplitShare[]) => void;
}

const ExpenseSplit: React.FC<ExpenseSplitProps> = ({
    amount,
    travelers,
    splitMode,
    shares,
    onSharesChange
}) => {
    // Initialize shares if empty
    useEffect(() => {
        if (shares.length === 0 && travelers.length > 0) {
            const initialShares = travelers.map(t => ({
                user: t._id,
                amount: amount / travelers.length,
                share: 1
            }));
            onSharesChange(initialShares);
        }
    }, [travelers, amount, shares.length, onSharesChange]);

    // Recalculate amounts when total amount changes (for EVENLY and BY_SHARES)
    useEffect(() => {
        if (splitMode === 'EVENLY') {
            const newShares = travelers.map(t => ({
                user: t._id,
                amount: amount / travelers.length,
                share: 1
            }));
            onSharesChange(newShares);
        }
    }, [amount, splitMode]);

    const handleShareChange = (userId: string, value: number) => {
        const newShares = shares.map(s => {
            if (s.user === userId) {
                if (splitMode === 'BY_AMOUNT') {
                    return { ...s, amount: value, share: value };
                } else if (splitMode === 'BY_PERCENTAGE') {
                    return { ...s, share: value, amount: (amount * value) / 100 };
                } else if (splitMode === 'BY_SHARES') {
                    return { ...s, share: value };
                }
            }
            return s;
        });

        // For BY_SHARES, recalculate all amounts based on total shares
        if (splitMode === 'BY_SHARES') {
            const totalShares = newShares.reduce((sum, s) => sum + s.share, 0);
            if (totalShares > 0) {
                newShares.forEach(s => {
                    s.amount = (amount * s.share) / totalShares;
                });
            }
        }

        onSharesChange(newShares);
    };

    return (
        <div className="space-y-3">
            {travelers.map(traveler => {
                const share = shares.find(s => s.user === traveler._id);
                if (!share) return null;

                return (
                    <div key={traveler._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            {traveler.avatar ? (
                                <img src={traveler.avatar} alt={traveler.name} className="w-8 h-8 rounded-full" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-500" />
                                </div>
                            )}
                            <span className="font-medium text-gray-700">{traveler.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {splitMode === 'EVENLY' && (
                                <span className="text-gray-900 font-bold">${share.amount.toFixed(2)}</span>
                            )}

                            {splitMode === 'BY_AMOUNT' && (
                                <div className="relative w-24">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={share.amount}
                                        onChange={(e) => handleShareChange(traveler._id, parseFloat(e.target.value) || 0)}
                                        className="w-full pl-6 pr-2 py-1 rounded-lg border border-gray-200 text-right outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            )}

                            {splitMode === 'BY_PERCENTAGE' && (
                                <div className="flex items-center gap-2">
                                    <div className="relative w-20">
                                        <input
                                            type="number"
                                            value={share.share}
                                            onChange={(e) => handleShareChange(traveler._id, parseFloat(e.target.value) || 0)}
                                            className="w-full pl-2 pr-6 py-1 rounded-lg border border-gray-200 text-right outline-none focus:ring-2 focus:ring-blue-200"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                    </div>
                                    <span className="text-sm text-gray-500 w-16 text-right">${share.amount.toFixed(2)}</span>
                                </div>
                            )}

                            {splitMode === 'BY_SHARES' && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={share.share}
                                        onChange={(e) => handleShareChange(traveler._id, parseFloat(e.target.value) || 0)}
                                        className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-center outline-none focus:ring-2 focus:ring-blue-200"
                                        min="0"
                                    />
                                    <span className="text-sm text-gray-500 w-16 text-right">${share.amount.toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {splitMode !== 'EVENLY' && (
                <div className="flex justify-between text-sm font-medium px-3 pt-2 border-t border-gray-100">
                    <span className="text-gray-500">Total</span>
                    <span className={`${Math.abs(shares.reduce((sum, s) => sum + s.amount, 0) - amount) > 0.01
                            ? 'text-red-500'
                            : 'text-green-600'
                        }`}>
                        ${shares.reduce((sum, s) => sum + s.amount, 0).toFixed(2)} / ${amount.toFixed(2)}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ExpenseSplit;
