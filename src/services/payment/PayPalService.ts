import type { PaymentResult } from './types';

export class PayPalService {
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = 'AYKixN6k2CJQnTKS1FtJT0vrZfI2Ih1MJsbsmJWUKcQTH_XgTIFrFFuIadK5WvVURPBfvZjX3cCmpRCn';
    this.clientSecret = 'EKmgSh4ftiTnGQs-neSodTPyQZlebBUJ3nFsfXtYvYUOM0Qx61aHynpy-zIsn4VdZER7MaQrnl1fimxG';
  }

  async createOrder(amount: number): Promise<string> {
    try {
      const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: amount.toFixed(2)
            }
          }]
        })
      });

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('PayPal order creation failed:', error);
      throw new Error('Failed to create PayPal order');
    }
  }

  async capturePayment(orderId: string): Promise<PaymentResult> {
    try {
      const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
        }
      });

      const data = await response.json();
      
      return {
        success: data.status === 'COMPLETED',
        transactionId: data.purchase_units[0].payments.captures[0].id,
        amount: parseFloat(data.purchase_units[0].payments.captures[0].amount.value),
        currency: data.purchase_units[0].payments.captures[0].amount.currency_code,
        status: data.status,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('PayPal payment capture failed:', error);
      throw new Error('Failed to capture PayPal payment');
    }
  }

  async processRefund(transactionId: string, amount: number): Promise<PaymentResult> {
    try {
      const response = await fetch(`https://api-m.sandbox.paypal.com/v2/payments/captures/${transactionId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
        },
        body: JSON.stringify({
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2)
          }
        })
      });

      const data = await response.json();
      
      return {
        success: data.status === 'COMPLETED',
        transactionId: data.id,
        amount: parseFloat(data.amount.value),
        currency: data.amount.currency_code,
        status: data.status,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('PayPal refund failed:', error);
      throw new Error('Failed to process PayPal refund');
    }
  }
}