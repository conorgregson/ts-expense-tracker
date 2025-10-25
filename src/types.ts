export type Category =
  | "food"
  | "rent"
  | "utilities"
  | "travel"
  | "entertainment"
  | "other";

export type PaymentMethod =
  | "cash"
  | "credit"
  | "debit"
  | "bank"
  | "mobile"
  | "check"
  | "other";

export interface Expense {
  id: string;
  expense: string;
  amount: number;
  category: Category;
  paymentMethod: PaymentMethod;
  paidTo?: string;
  note?: string;
  dateISO: string; // YYYY-MM-DD
  createdAt: number;
}

export interface Filters {
  category: Category | "all";
  monthISO?: string; // YYYY-MM
}
