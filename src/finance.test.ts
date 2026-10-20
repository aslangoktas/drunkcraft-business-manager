import { describe, expect, it } from 'vitest';
import { accountBalances, expenseGrossTotal, expenseOutstanding, expensePaid, expenseVatAmount, saleGross, saleNetRevenue, saleNetWithTax, saleVat, summarize, workshopNet } from './finance';
import type { Account, Expense, Sale, Workshop } from './types';

const payment = (amount: number, date = '2026-10-20', accountId = 'cash') => ({ id: `p${amount}`, date, amount, method: 'Nakit' as const, accountId });
const sale: Sale = { id:'s1', date:'2026-10-20', category:'Kahve', productName:'Filtre kahve', quantity:2, unitPrice:100, discount:10, vatRate:10, vatIncluded:true, costTotal:40, notes:'', payments:[payment(100)], refunds:[{id:'r1',date:'2026-10-20',amount:20}], createdAt:'2026-10-20T08:00:00Z' };
const expense: Expense = { id:'e1', date:'2026-10-01', period:'2026-10-01', dueDate:'2026-10-05', name:'Kira', category:'Kira', vendor:'', invoiceNumber:'', amount:20000, vatRate:0, vatIncluded:true, notes:'', payments:[payment(5000,'2026-10-20')], createdAt:'2026-10-01T08:00:00Z' };
const workshop: Workshop = { id:'w1',name:'Kartlık workshop',date:'2026-10-20',startTime:'18:00',endTime:'22:00',capacity:8,attendees:2,pricePerPerson:1000,discount:100,refunds:[],materialCost:300,cateringCost:100,otherCost:0,notes:'',payments:[payment(900,'2026-10-20','bank')],createdAt:'2026-10-20T08:00:00Z' };

describe('finansal hesaplamalar', () => {
  it('satış brüt, indirim, iade ve KDV hariç net geliri doğru hesaplar', () => {
    expect(saleNetWithTax(sale)).toBe(170);
    expect(saleNetRevenue(sale)).toBeCloseTo(154.54545, 3);
  });
  it('kısmi gider ödemesinden kalan borcu hesaplar', () => {
    expect(expensePaid(expense)).toBe(5000);
    expect(expenseOutstanding(expense)).toBe(15000);
  });
  it('KDV dâhil ve hariç tutarları tutarlı hesaplar', () => {
    expect(expenseVatAmount({ ...expense, amount: 110, vatRate: 10, vatIncluded: true, payments: [] })).toBeCloseTo(10, 6);
    expect(expenseGrossTotal({ ...expense, amount: 100, vatRate: 20, vatIncluded: false, payments: [] })).toBeCloseTo(120, 6);
    const exclusiveSale = { ...sale, quantity: 1, unitPrice: 100, discount: 0, vatRate: 20, vatIncluded: false, refunds: [] };
    expect(saleGross(exclusiveSale)).toBeCloseTo(120, 6);
    expect(saleNetRevenue(exclusiveSale)).toBeCloseTo(100, 6);
    expect(saleVat(exclusiveSale)).toBeCloseTo(20, 6);
  });
  it('workshop indirimlerini net katılım gelirinden düşer', () => {
    expect(workshopNet(workshop)).toBe(1900);
  });
  it('tahakkuk eden giderle nakit ödemesini ayırır', () => {
    const result = summarize([sale],[expense],[workshop],'2026-10-01','2026-10-31');
    expect(result.accruedExpenses).toBe(20000);
    expect(result.paidExpensesByExpenseDate).toBe(5000);
    expect(result.receivables).toBeGreaterThan(0);
  });
  it('hesap bakiyesine yalnızca tahsilatı ekler, ödenen gideri düşer', () => {
    const accounts: Account[] = [{id:'cash',name:'Nakit Kasa',type:'cash',openingBalance:500}];
    const balances = accountBalances(accounts,[sale],[expense],[],[]);
    expect(balances[0].balance).toBe(500 + 100 - 5000);
  });
});
