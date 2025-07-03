import { Component, input, output, EventEmitter, model } from '@angular/core';
import { FormsModule, } from '@angular/forms';
import {ITransaction, ModalType} from '../../types/types'
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-modal-window',
  imports: [FormsModule, InputTextModule, ButtonModule, DialogModule, InputNumberModule],
  templateUrl: './modal-window.html',
  styleUrl: './modal-window.scss',
  standalone:true
})
export class ModalWindow {
  public isModalActive = model(false);
  public modalType = input<ModalType>('income');
  public transactionData = input<ITransaction>({ id:undefined, category: '', amount: 0, date: '' });
  public modalTitle = input<string>('');
  public modalClosed = output<void>();
  public transactionSubmitted = output<ITransaction>();
 
  protected closeModal(): void  {
    this.modalClosed.emit();
  }

  protected handleSubmit(): void  {
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
