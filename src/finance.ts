import type { Account, Expense, Payment, Sale, Transfer, Workshop } from './types';

export const money = (value: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 }).format(Number.isFinite(value) ? value : 0);
export const numberTR = (value: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(Number.isFinite(value) ? value : 0);
export const todayISO = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`; };
export const monthISO = (date = todayISO()) => date.slice(0, 7);
export const monthStart = (month: string) => `${month}-01`;
export const monthEnd = (month: string) => { const [y,m] = month.split('-').map(Number); return `${y}-${String(m).padStart(2,'0')}-${String(new Date(y,m,0).getDate()).padStart(2,'0')}`; };
export const inRange = (date: string, start: string, end: string) => date >= start && date <= end;
export const startOfWeek = (iso: string) => { const d = new Date(`${iso}T12:00:00`); const monday = (d.getDay()+6)%7; d.setDate(d.getDate()-monday); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export const addDays = (iso: string, amount: number) => { const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate()+amount); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export const formatDate = (iso: string) => iso ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${iso.slice(0,10)}T12:00:00`)) : '—';
export const saleBaseGross = (s: Sale) => Math.max(0, s.quantity * s.unitPrice);
export const saleGross = (s: Sale) => saleBaseGross(s) * (s.vatIncluded ? 1 : 1 + Math.max(0, s.vatRate) / 100);
export const saleDiscountAmount = (s: Sale) => Math.max(0, s.discount) * (s.vatIncluded ? 1 : 1 + Math.max(0, s.vatRate) / 100);
export const saleAfterDiscount = (s: Sale) => Math.max(0, saleGross(s) - saleDiscountAmount(s));
export const saleRefunds = (s: Sale) => (s.refunds ?? []).reduce((sum, r) => sum + r.amount, 0);
export const saleNetWithTax = (s: Sale) => Math.max(0, saleAfterDiscount(s) - saleRefunds(s));
export const saleNetRevenue = (s: Sale) => saleNetWithTax(s) / (1 + Math.max(0, s.vatRate) / 100);
export const saleVat = (s: Sale) => saleNetWithTax(s) - saleNetRevenue(s);
export const paidAmount = (payments: Payment[]) => payments.reduce((sum, p) => sum + p.amount, 0);
export const saleReceivable = (s: Sale) => Math.max(0, saleNetWithTax(s) - paidAmount(s.payments ?? []));
export const workshopGross = (w: Workshop) => Math.max(0, w.attendees * w.pricePerPerson);
export const workshopNet = (w: Workshop) => Math.max(0, workshopGross(w) - w.discount - (w.refunds ?? []).reduce((s,r)=>s+r.amount,0));
export const workshopReceivable = (w: Workshop) => Math.max(0, workshopNet(w) - paidAmount(w.payments ?? []));
export const expensePaid = (e: Expense) => paidAmount(e.payments ?? []);
export const expenseGrossTotal = (e: Expense) => Math.max(0, e.amount) * (e.vatIncluded ? 1 : 1 + Math.max(0, e.vatRate) / 100);
export const expenseNetAmount = (e: Expense) => e.vatIncluded ? Math.max(0, e.amount) / (1 + Math.max(0, e.vatRate) / 100) : Math.max(0, e.amount);
export const expenseVatAmount = (e: Expense) => expenseGrossTotal(e) - expenseNetAmount(e);
export const expenseOutstanding = (e: Expense) => Math.max(0, expenseGrossTotal(e) - paidAmount(e.payments ?? []));
export const expenseActive = (e: Expense) => !e.cancelled;
export function summarize(sales: Sale[], expenses: Expense[], workshops: Workshop[], start: string, end: string) {
  const ss = sales.filter(s => inRange(s.date, start, end));
  const ws = workshops.filter(w => inRange(w.date, start, end));
  const es = expenses.filter(e => !e.cancelled && inRange(e.period || e.date, start, end));
  const grossSales = ss.reduce((a,s)=>a+saleGross(s),0) + ws.reduce((a,w)=>a+workshopGross(w),0);
  const discounts = ss.reduce((a,s)=>a+saleDiscountAmount(s),0) + ws.reduce((a,w)=>a+w.discount,0);
  const refunds = ss.reduce((a,s)=>a+saleRefunds(s),0) + ws.reduce((a,w)=>a+(w.refunds??[]).reduce((n,r)=>n+r.amount,0),0);
  const netWithTax = ss.reduce((a,s)=>a+saleNetWithTax(s),0) + ws.reduce((a,w)=>a+workshopNet(w),0);
  const netRevenue = ss.reduce((a,s)=>a+saleNetRevenue(s),0) + ws.reduce((a,w)=>a+workshopNet(w),0);
  const vat = ss.reduce((a,s)=>a+saleVat(s),0);
  const expenseVat = es.reduce((a,e)=>a+expenseVatAmount(e),0);
  const costOfGoods = ss.reduce((a,s)=>a+(s.costTotal || 0),0) + ws.reduce((a,w)=>a+w.materialCost+w.cateringCost+w.otherCost,0);
  const accruedExpenses = es.reduce((a,e)=>a+expenseGrossTotal(e),0);
  const paidExpensesByExpenseDate = es.reduce((a,e)=>a+paidAmount(e.payments.filter(p=>inRange(p.date,start,end))),0);
  const paidSales = ss.reduce((a,s)=>a+paidAmount(s.payments.filter(p=>inRange(p.date,start,end))),0) + ws.reduce((a,w)=>a+paidAmount(w.payments.filter(p=>inRange(p.date,start,end))),0);
  const receivables = ss.reduce((a,s)=>a+saleReceivable(s),0) + ws.reduce((a,w)=>a+workshopReceivable(w),0);
  const outstandingExpenses = es.reduce((a,e)=>a+expenseOutstanding(e),0);
  const operatingResult = netRevenue - costOfGoods - accruedExpenses;
  return { count: ss.length + ws.length, grossSales, discounts, refunds, netWithTax, netRevenue, vat, costOfGoods, accruedExpenses, paidExpensesByExpenseDate, paidSales, receivables, outstandingExpenses, operatingResult, expenseVat, sales: ss, workshops: ws, expenses: es };
}
export function accountBalances(accounts: Account[], sales: Sale[], expenses: Expense[], workshops: Workshop[], transfers: Transfer[]) {
  return accounts.map(account => {
    const incomeSales = sales.reduce((total, s) => total + s.payments.filter(p=>p.accountId===account.id).reduce((sum,p)=>sum+p.amount,0),0);
    const incomeWorkshops = workshops.reduce((total, w) => total + w.payments.filter(p=>p.accountId===account.id).reduce((sum,p)=>sum+p.amount,0),0);
    const outExpenses = expenses.filter(e=>!e.cancelled).reduce((total,e)=>total+e.payments.filter(p=>p.accountId===account.id).reduce((sum,p)=>sum+p.amount,0),0);
    const transferIn = transfers.filter(t=>t.toAccountId===account.id).reduce((s,t)=>s+t.amount,0);
    const transferOut = transfers.filter(t=>t.fromAccountId===account.id).reduce((s,t)=>s+t.amount,0);
    return { ...account, balance: account.openingBalance + incomeSales + incomeWorkshops - outExpenses + transferIn - transferOut };
  });
}
export function byCategory(sales: Sale[], workshops: Workshop[], start: string, end: string) {
  const totals = new Map<string, number>();
  sales.filter(s=>inRange(s.date,start,end)).forEach(s=>totals.set(s.category,(totals.get(s.category)||0)+saleNetRevenue(s)));
  workshops.filter(w=>inRange(w.date,start,end)).forEach(w=>totals.set('Workshop',(totals.get('Workshop')||0)+workshopNet(w)));
  return [...totals.entries()].map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
}
