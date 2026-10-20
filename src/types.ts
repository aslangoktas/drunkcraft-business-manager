export type Category = 'Kahve' | 'Çay' | 'Diğer içecekler' | 'Deri ürünleri' | 'Workshop' | 'Özel sipariş' | 'Diğer gelirler';
export type PaymentMethod = 'Nakit' | 'Kart' | 'Banka' | 'Diğer';
export type Payment = { id: string; date: string; amount: number; method: PaymentMethod; accountId: string };
export type Refund = { id: string; date: string; amount: number; reason?: string };
export type Sale = {
  id: string; date: string; category: Category; productName: string; quantity: number; unitPrice: number;
  discount: number; vatRate: number; vatIncluded: boolean; costTotal: number; notes: string;
  payments: Payment[]; refunds: Refund[]; createdAt: string;
};
export type Expense = {
  id: string; date: string; period: string; dueDate: string; name: string; category: string; vendor: string;
  invoiceNumber: string; amount: number; vatRate: number; vatIncluded: boolean; notes: string;
  payments: Payment[]; recurringRuleId?: string; cancelled?: boolean; createdAt: string;
};
export type Product = { id: string; name: string; category: Category; price: number; cost: number; trackStock: boolean; stock: number; vatRate: number; active: boolean; unit: string };
export type Workshop = {
  id: string; name: string; date: string; startTime: string; endTime: string; capacity: number; attendees: number;
  pricePerPerson: number; discount: number; refunds: Refund[]; materialCost: number; cateringCost: number; otherCost: number;
  notes: string; payments: Payment[]; createdAt: string;
};
export type Account = { id: string; name: string; type: 'cash' | 'bank' | 'pos' | 'other'; openingBalance: number };
export type Transfer = { id: string; date: string; fromAccountId: string; toAccountId: string; amount: number; note: string };
export type RecurringRule = { id: string; name: string; category: string; vendor: string; amount: number; vatRate: number; vatIncluded: boolean; dayOfMonth: number; dueDay: number; startMonth: string; endMonth?: string; notes: string; active: boolean };
export type Settings = { businessName: string; setupComplete: boolean; lastBackupAt?: string; currency: string };
export type AppData = { sales: Sale[]; expenses: Expense[]; products: Product[]; workshops: Workshop[]; accounts: Account[]; transfers: Transfer[]; recurringRules: RecurringRule[]; settings: Settings };
export type PageKey = 'dashboard' | 'cash' | 'sales' | 'products' | 'workshops' | 'expenses' | 'accounts' | 'reports' | 'analytics' | 'settings';
