import { Component, OnInit, ViewChild, ElementRef, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Database } from './database/database';
import { StoreName } from './services/constants';
import { ChartComponent } from './components/charts/charts';
import { ModalWindow } from './components/modal-window/modal-window';
import { ITransaction } from './services/constants'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalWindow, CommonModule, ChartComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  async ngOnInit() {
      try {
        await this.dbService.initialize();
        await this.loadTransactions();
      } catch (error) {
        console.error('Initialization failed:', error);
      }
  }

  @ViewChild('startDateInput') startDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput!: ElementRef<HTMLInputElement>;

  appModalState = signal(false)
  currentModalType = signal<StoreName>('income')
  incomeTransactions = signal<ITransaction[]>([])
  expenseTransactions = signal<ITransaction[]>([])

  constructor(private dbService: Database) {}

  transactionData = signal<ITransaction>({
  category: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0]
  });

  protected initNewTransaction(type: StoreName) {
    this.transactionData.set({
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    });
    this.currentModalType.set(type)
    this.appModalState.set(true);
  }

  protected async loadTransactions() {
    try {
       this.incomeTransactions.set(await this.loadStoreTransactions('income')) ,
       this.expenseTransactions.set(await this.loadStoreTransactions('expense')) 
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }

  private async loadStoreTransactions(storeName: StoreName): Promise<ITransaction[]> {
    try {
      const transactions = await this.dbService.getAllTransactions(storeName);
      return this.filterTransactionsByDate(transactions)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error(`Error loading ${storeName} transactions:`, error);
      return [];
    }
  }

  private filterTransactionsByDate(transactions: ITransaction[]): ITransaction[] {
    const startDate = this.startDateInput?.nativeElement.value;
    const endDate = this.endDateInput?.nativeElement.value;

    if (startDate && endDate) {
      return transactions.filter(t => {
        const transDate = new Date(t.date).toISOString();
        const start = new Date(startDate).toISOString();
        const end = new Date(endDate).toISOString();
        return transDate >= start && transDate <= end;
      });
    }
    return transactions;
  }

  protected formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    } catch (e) {
      console.error('Invalid date format:', dateString);
      return dateString;
    }
  }

  async onModalSubmit(transaction: ITransaction) {
    try {
      if (transaction.id !== undefined) {
        await this.dbService.updateTransaction(this.currentModalType(), transaction);
      } else {
        await this.dbService.addTransaction(this.currentModalType(), transaction);
      }
      await this.loadTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      this.appModalState.set(false)
    }
  }

  protected editTransaction(transaction: ITransaction, storeName: StoreName) {
    this.transactionData.set( { ...transaction } );
    this.currentModalType.set(storeName)
    this.appModalState.set(true)
  }

  async deleteTransaction(storeName: StoreName, id?: number) {
    if (!id || !confirm('Вы уверены, что хотите удалить эту запись?')) return;

    try {
      await this.dbService.deleteTransaction(storeName, id);
      await this.loadTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }

}