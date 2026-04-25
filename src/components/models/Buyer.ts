import { IBuyer, TPayment, TError} from '../../types/index.ts';
import { IEvents } from '../base/Events';


export class Buyer{
  private payment: TPayment = '';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  constructor(protected event: IEvents) {}

  set buyerInfo(data: {field: string, value: string | TPayment}) {
    switch (data.field) {
      case 'payment':
        this.payment = data.value as TPayment;
        this.event.emit('payment:changed');
        break;
      case 'address':
        this.address = data.value as string;
        break;
      case 'email':
        this.email = data.value as string;
        break;
      case 'phone':
        this.phone = data.value as string;
        break;
    }
    this.event.emit('buyerInfo:changed', { field: data.field, value: data.value });
  }

  get buyerInfo(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  clearBuyerInfo(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';

    this.event.emit('buyerInfo:changed');
  }

  isValid(): TError {
    const errors: TError = {};

    if (!this.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }
    if (!this.email) {
      errors.email = 'Укажите email';
    }
    if (!this.phone) {
      errors.phone = 'Укажите телефон';
    }
    if (!this.address) {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }
}

