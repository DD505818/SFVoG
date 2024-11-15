import { useState } from 'react';
import { PayPalService } from '../services/payment/PayPalService';
import type { PaymentResult } from '../services/payment/types';

export function usePayPal() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paypalService = new PayPalService();

  const processPayment = async (amount: number): Promise<PaymentResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      const orderId = await paypalService.createOrder(amount);
      const result = await paypalService.capturePayment(orderId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const processRefund = async (transactionId: string, amount: number): Promise<PaymentResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await paypalService.processRefund(transactionId, amount);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Refund failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    processRefund,
    isProcessing,
    error
  };
}