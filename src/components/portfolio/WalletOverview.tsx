import React, { useState } from 'react';
import { Wallet, CreditCard, TrendingUp, PieChart, ArrowRightLeft, Plus, X, CircleDollarSign } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { usePayPal } from '../../hooks/usePayPal';

export default function WalletOverview() {
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [transferType, setTransferType] = useState<'deposit' | 'withdraw'>('deposit');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | null>(null);
  
  const { wallet, addFunds, withdrawFunds, isLoading } = useWallet();
  const { processPayment, processRefund, isProcessing, error } = usePayPal();

  const handleTransfer = async () => {
    if (!amount || isNaN(Number(amount)) || !paymentMethod) return;
    
    try {
      if (transferType === 'deposit') {
        if (paymentMethod === 'paypal') {
          const result = await processPayment(Number(amount));
          if (result.success) {
            await addFunds(Number(amount), 'paypal');
          }
        } else {
          await addFunds(Number(amount), 'card');
        }
      } else {
        if (paymentMethod === 'paypal') {
          const result = await processRefund(wallet.id, Number(amount));
          if (result.success) {
            await withdrawFunds(Number(amount), 'paypal');
          }
        } else {
          await withdrawFunds(Number(amount), 'card');
        }
      }
      setShowFundsModal(false);
      setAmount('');
      setPaymentMethod(null);
    } catch (error) {
      console.error('Transfer failed:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Transfer Modal */}
      {showFundsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="tech-panel w-full max-w-md relative">
            <button 
              onClick={() => setShowFundsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-4">
              Transfer Funds
            </h3>

            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setTransferType('deposit')}
                  className={`flex-1 tech-button ${
                    transferType === 'deposit' ? '!bg-indigo-600' : ''
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Deposit
                </button>
                <button
                  onClick={() => setTransferType('withdraw')}
                  className={`flex-1 tech-button ${
                    transferType === 'withdraw' ? '!bg-indigo-600' : ''
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Withdraw
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
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
                    className="tech-input pl-8"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm text-gray-400 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`tech-button ${
                      paymentMethod === 'card' ? '!bg-indigo-600' : ''
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`tech-button ${
                      paymentMethod === 'paypal' ? '!bg-indigo-600' : ''
                    }`}
                  >
                    <CircleDollarSign className="w-5 h-5" />
                    <span>PayPal</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-900/30 p-2 rounded">
                  {error}
                </div>
              )}

              <button
                onClick={handleTransfer}
                disabled={!amount || isNaN(Number(amount)) || !paymentMethod || isLoading || isProcessing}
                className="w-full tech-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isLoading || isProcessing) ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    {transferType === 'deposit' ? (
                      <Plus className="w-4 h-4" />
                    ) : (
                      <ArrowRightLeft className="w-4 h-4" />
                    )}
                    {transferType === 'deposit' ? 'Add Funds' : 'Withdraw Funds'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          Wallet Overview
        </h2>
        <button 
          onClick={() => setShowFundsModal(true)}
          className="tech-button"
        >
          <CreditCard className="w-4 h-4" />
          Transfer Funds
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="tech-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-600/10 rounded-lg">
              <CreditCard className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-sm text-gray-400">Available Balance</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${wallet.balance.toLocaleString()}
          </p>
          <div className="mt-2 text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="tech-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-600/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-sm text-gray-400">24h Change</span>
          </div>
          <p className="text-2xl font-bold text-green-400">
            +{wallet.performance24h}%
          </p>
          <div className="mt-2 text-sm text-gray-400">
            +${(wallet.balance * wallet.performance24h / 100).toLocaleString()}
          </div>
        </div>

        <div className="tech-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-600/10 rounded-lg">
              <PieChart className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-sm text-gray-400">Asset Distribution</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Crypto</span>
              <span className="text-sm font-medium text-white">50%</span>
            </div>
            <div className="flex gap-2">
              <div className="h-2 rounded-full bg-blue-500 w-1/2"></div>
              <div className="h-2 rounded-full bg-green-500 w-1/4"></div>
              <div className="h-2 rounded-full bg-purple-500 w-1/4"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>BTC 30%</span>
              <span>ETH 15%</span>
              <span>Others 5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}