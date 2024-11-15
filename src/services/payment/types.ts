export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal';
  details: CardDetails | PayPalDetails;
}

export interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface PayPalDetails {
  email: string;
  orderId?: string;
}