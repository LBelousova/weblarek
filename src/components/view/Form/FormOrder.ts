import { Form, IForm } from './Form';
import { IEvents } from '../../base/Events';
import { ensureAllElements, ensureElement } from '../../../utils/utils';
import { IBuyer, TPayment } from '../../../types';

interface IFormOrder extends IForm, Partial<IBuyer> {
  address: string;
  payment: TPayment;
}

export class FormOrder extends Form {
  protected paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.inputElements.forEach(input => {
      input.addEventListener('input', (event: Event) => {
        const field = (event.target as HTMLInputElement).name;
        const value = (event.target as HTMLInputElement).value;

        this.events.emit('input:changed', { field, value });
      })
    });

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
    
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        events.emit('payment:select', {payment: button.name });
        const activeButton = this.container.querySelector('.button_alt-active');
        activeButton?.classList.toggle('button_alt-active', false);
        button.classList.toggle('button_alt-active', true)
      })
    })

    this.submitButton.addEventListener('click', (event: Event) => {
      event.preventDefault();
      this.events.emit('form-contact:open');
    })
  }

  set address(value: string) {
    ensureElement<HTMLInputElement>('input[name="address"]', this.container).value = value;
  }

  set payment(value: TPayment) {
    this.paymentButtons.forEach((button) => {
      const activeButton = button.name === value;
      button.classList.toggle('button_alt-active', activeButton)
    })
  }

  render(data?: IFormOrder | undefined): HTMLElement {
    if (data?.errors !== undefined) {
        this.errors = data.errors;
      } 
    data?.address !== undefined && (this.address = data.address);
    data?.payment !== undefined && (this.payment = data.payment);
    return super.render(data);
  }
}