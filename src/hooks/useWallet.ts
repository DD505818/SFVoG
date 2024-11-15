import { useState, useEffect } from 'react';
import type { Wallet, WalletTransaction } from '../types/trading';

interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet>({
    id: '1',
    name: 'Main Trading Wallet',
    balance: 158942.67,
    performance24h: 2.45,
    assets: [],
    transactions: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const processPayment = async (
    amount: number,
    method: 'card' | 'paypal'
  ): Promise<PaymentResponse> => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      transactionId: crypto.randomUUID(),
      message: 'Payment processed successfully'
    };
  };

  const addFunds = async (amount: number, method: 'card' | 'paypal'): Promise<void> => {
    setIsLoading(true);
    try {
      const payment = await processPayment(amount, method);
      
      if (payment.success) {
        const transaction: WalletTransaction = {
          id: payment.transactionId,
          type: 'deposit',
          amount,
          timestamp: new Date(),
          status: 'completed',
          description: `Deposit via ${method}`
        };

        setWallet(prev => ({
          ...prev,
          balance: prev.balance + amount,
          transactions: [...(prev.transactions || []), transaction]
        }));
      } else {
        throw new Error(payment.message);
      }
    } catch (error) {
      console.error('Failed to add funds:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawFunds = async (amount: number, method: 'card' | 'paypal'): Promise<void> => {
    setIsLoading(true);
    try {
      if (amount > wallet.balance) {
        throw new Error('Insufficient funds');
      }

      const payment = await processPayment(amount, method);
      
      if (payment.success) {
        const transaction: WalletTransaction = {
          id: payment.transactionId,
          type: 'withdraw',
          amount,
          timestamp: new Date(),
          status: 'completed',
          description: `Withdrawal via ${method}`
        };

        setWallet(prev => ({
          ...prev,
          balance: prev.balance - amount,
          transactions: [...(prev.transactions || []), transaction]
        }));
      } else {
        throw new Error(payment.message);
      }
    } catch (error) {
      console.error('Failed to withdraw funds:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionHistory = () => {
    return wallet.transactions || [];
  };

  return {
    wallet,
    isLoading,
    addFunds,
    withdrawFunds,
    getTransactionHistory
  };
}