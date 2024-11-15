import React, { useState } from 'react';
import { CreditCard, CircleDollarSign, AlertTriangle } from 'lucide-react';
import { usePayPal } from '../../hooks/usePayPal';

interface PaymentProcessorProps {
  onSuccess: (amount: number, method: 'card' | 'paypal') => void;
  onError: (error: string) => void;
}

export default function PaymentProcessor({ onSuccess, onError }: PaymentProcessorProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'card' | 'paypal'>('card');
  const { processPayment, isProcessing, error } = usePayPal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount))) {
      onError('Please enter a valid amount');
      return;
    }

    try {
      if (method === 'paypal') {
        const result = await processPayment(Number(amount));
        if (result.success) {
          onSuccess(Number(amount), 'paypal');
        } else {
          onError('PayPal payment failed');
        }
      } else {
        // Simulate card payment
        await new Promise(resolve => setTimeout(resolve, 1000));
        onSuccess(Number(amount), 'card');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Process Payment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMethod('card')}
            className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors
              ${method === 'card'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <CreditCard className="w-5 h-5" />
            <span>Card</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('paypal')}
            className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors
              ${method === 'paypal'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <CircleDollarSign className="w-5 h-5" />
            <span>PayPal</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!amount || isNaN(Number(amount)) || isProcessing}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                   disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors
                   flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <>Process Payment</>
          )}
        </button>
      </form>
    </div>
  );
}