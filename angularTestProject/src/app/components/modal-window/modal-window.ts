import { Component, input, output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ITransaction} from '../../services/constants'

type ModalType = 'income' | 'expense';

@Component({
  selector: 'app-modal-window',
  imports: [FormsModule],
  templateUrl: './modal-window.html',
  styleUrl: './modal-window.scss',
  standalone:true
})
export class ModalWindow {
  isModalActive = input(false);
  modalType = input<ModalType>('income');
  transactionData = input<ITransaction>({ id:undefined, category: '', amount: 0, date: '' });

  modalClosed = output<void>();
  transactionSubmitted = output<ITransaction>();
 
  closeModal() {
    this.modalClosed.emit();
  }

  getModalTitle(): string {
    const isEdit = this.transactionData()?.id;
    const type = this.modalType() === 'income' ? 'доход' : 'расход';
    return `${isEdit ? 'Изменить' : 'Добавить'} ${type}`;
  }

  handleSubmit() {
    const currentDate = new Date().toISOString().split('T')[0];
    const data = this.transactionData() ?? {
      category: '',
      amount: 0,
      date: currentDate
    };  
    
    this.transactionSubmitted.emit({
      ...data
    });
    this.closeModal();
  }
}
