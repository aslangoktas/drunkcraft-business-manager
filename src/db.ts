import Dexie, { type Table } from 'dexie';
import type { Account, Expense, Product, RecurringRule, Sale, Settings, Transfer, Workshop } from './types';

class DrunkCraftDB extends Dexie {
  sales!: Table<Sale, string>;
  expenses!: Table<Expense, string>;
  products!: Table<Product, string>;
  workshops!: Table<Workshop, string>;
  accounts!: Table<Account, string>;
  transfers!: Table<Transfer, string>;
  recurringRules!: Table<RecurringRule, string>;
  settings!: Table<{ key: string; value: Settings }, string>;
  constructor() {
    super('DrunkCraftBusinessManager');
    this.version(1).stores({
      sales: 'id,date,category,productName,createdAt',
      expenses: 'id,date,period,dueDate,category,recurringRuleId,cancelled,createdAt',
      products: 'id,name,category,active',
      workshops: 'id,date,name,createdAt',
      accounts: 'id,name,type',
      transfers: 'id,date,fromAccountId,toAccountId',
      recurringRules: 'id,active,startMonth,endMonth',
      settings: 'key',
    });
  }
}
export const db = new DrunkCraftDB();
export const defaultSettings: Settings = { businessName: 'DrunkCraft', setupComplete: false, currency: 'TRY' };
export const defaultAccounts: Account[] = [
  { id: 'cash', name: 'Nakit Kasa', type: 'cash', openingBalance: 0 },
  { id: 'bank', name: 'Banka Hesabı', type: 'bank', openingBalance: 0 },
  { id: 'pos', name: 'Kart / POS', type: 'pos', openingBalance: 0 },
];
export async function loadAppData() {
  const [sales, expenses, products, workshops, savedAccounts, transfers, recurringRules, settingRow] = await Promise.all([
    db.sales.toArray(), db.expenses.toArray(), db.products.toArray(), db.workshops.toArray(), db.accounts.toArray(), db.transfers.toArray(), db.recurringRules.toArray(), db.settings.get('main'),
  ]);
  let accounts = savedAccounts;
  if (!accounts.length) {
    accounts = defaultAccounts;
    await db.accounts.bulkPut(accounts);
  }
  return { sales, expenses, products, workshops, accounts, transfers, recurringRules, settings: settingRow?.value ?? defaultSettings };
}
export function newId(prefix = 'dc') { return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`; }
