export interface ITransaction {
  id?: number;
  category: string;
  amount: number;
  date: string;
}
export type StoreName = 'income' | 'expense';
export type ModalType = 'income' | 'expense';