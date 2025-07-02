import { Injectable } from '@angular/core';
import { ITransaction, StoreName } from '../services/constants'

@Injectable({ providedIn: 'root' })
export class Database {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'FinanceTrackerDB';
  private readonly DB_VERSION = 1;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createObjectStore(db, 'income');
        this.createObjectStore(db, 'expense');
      };

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event: Event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  private createObjectStore(db: IDBDatabase, name: StoreName): void {
    if (!db.objectStoreNames.contains(name)) {
      db.createObjectStore(name, {
        keyPath: 'id',
        autoIncrement: true
      });
    }
  }

  async getAllTransactions(storeName: StoreName): Promise<ITransaction[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as ITransaction[]);
      request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
  }

  async addTransaction(storeName: StoreName, transaction: Omit<ITransaction, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }
      
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.add(transaction);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
  }

  async updateTransaction(storeName: StoreName, transaction: ITransaction): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(transaction);

      request.onsuccess = () => resolve();
      request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
  }

  async deleteTransaction(storeName: StoreName, id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
  }

  isInitialized(): boolean {
    return this.db !== null;
  }
}