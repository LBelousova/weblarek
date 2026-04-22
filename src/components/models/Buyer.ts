import { IBuyer, TPayment, TError} from '../../types/index.ts';
import { IEvents } from '../base/Events';


export class Buyer{
  private payment: TPayment = '';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  constructor(protected event: IEvents) {}

  set paymentMethod(value: TPayment){
    this.payment = value;
    this.isValid();
  }

  set inputInfo(data: {field: keyof Buyer, value: string} ) {
    this[data.field] = data.value;
    this.isValid();
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

    this.event.emit('form:cleared');
  }

  protected isValid(): TError {
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
    this.event.emit('form-errors:validation', errors);

    return errors;
  }
}

