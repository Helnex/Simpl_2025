import { Component, OnInit, ViewChild, ElementRef, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './services/databaseService';
import { StoreName } from './types/types';
import { ChartComponent } from './components/charts/charts';
import { ModalWindow } from './components/modal-window/modal-window';
import { ITransaction } from './types/types';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalWindow, CommonModule, ChartComponent, ButtonModule, TableModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  @ViewChild('startDateInput') protected startDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') protected endDateInput!: ElementRef<HTMLInputElement>;

  public modalTitle = signal('')
  public appModalState = signal(false);
  public transactionData = signal<ITransaction>({
  category: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0]
  });
  protected currentModalType = signal<StoreName>('income');
  protected incomeTransactions = signal<ITransaction[]>([]);
  protected expenseTransactions = signal<ITransaction[]>([]);
  
  constructor(private dbService: DatabaseService) {};

  async ngOnInit(): Promise<void>  {
      try {
        await this.dbService.initialize();
        await this.loadTransactions();
      } catch (error) {
        console.error('Initialization failed:', error);
      }
  }

  protected initNewTransaction(type: StoreName): void {
    this.transactionData.set({
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    });
    const typeName = type === 'income' ? 'доход' : 'расход';
    this.modalTitle.set(`Добавить ${typeName}`);

    this.currentModalType.set(type);
    this.appModalState.set(true);
  }

  protected async loadTransactions(): Promise<void> {
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

  async onModalSubmit(transaction: ITransaction): Promise<void>  {
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
      this.appModalState.set(false);
    }
  }

  protected editTransaction(transaction: ITransaction, storeName: StoreName): void {
    const typeName = storeName === 'income' ? 'доход' : 'расход';
    this.modalTitle.set(`Изменить ${typeName}`);
    this.transactionData.set( { ...transaction } );
    this.currentModalType.set(storeName);
    this.appModalState.set(true);
  }

  async deleteTransaction(storeName: StoreName, id?: number): Promise<void>  {
    if (!id || !confirm('Вы уверены, что хотите удалить эту запись?')) return;
    console.log(storeName);
    
    try {
      await this.dbService.deleteTransaction(storeName, id);
      await this.loadTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }

  protected clearDate (): void {
    this.startDateInput.nativeElement.value = '';
    this.endDateInput.nativeElement.value = '';
    this.loadTransactions();
  }
}