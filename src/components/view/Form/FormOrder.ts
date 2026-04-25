import { Form, IForm } from './Form';
import { IEvents } from '../../base/Events';
import { ensureAllElements, ensureElement } from '../../../utils/utils';
import { TPayment, ICardActions} from '../../../types';


interface IFormOrder extends IForm {
  address: string;
  payment: TPayment;
}

export class FormOrder extends Form<IFormOrder> {
  protected paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLElement, protected events: IEvents, actions?: ICardActions) {
    super(container);

    this.inputElements.forEach(input => {
      input.addEventListener('input', (event: Event) => {
        const field = (event.target as HTMLInputElement).name;
        const value = (event.target as HTMLInputElement).value;

        this.events.emit('buyerInfo:selected', { field, value });
      })
    });

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
    
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        events.emit('buyerInfo:selected', { field: 'payment', value: button.name });
      })
    })

    if(actions?.onClick) {
      this.submitButton.addEventListener('click', actions.onClick);
    };
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
}