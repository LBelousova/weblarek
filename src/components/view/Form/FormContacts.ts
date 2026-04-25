import { Form } from './Form';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { IForm } from './Form';
import { ICardActions } from '../../../types';

interface IFormContacts extends IForm {
  email: string;
  phone: string;
}

export class FormContacts extends Form<IFormContacts> {
  constructor(container: HTMLElement, protected events: IEvents, actions?: ICardActions) {
    super(container);

    this.inputElements.forEach(input => {
      input.addEventListener('input', (event: Event) => {
        const field = (event.target as HTMLInputElement).name;
        const value = (event.target as HTMLInputElement).value;

        this.events.emit('buyerInfo:selected', { field, value });
      })
    });
    if(actions?.onClick) {
      this.submitButton.addEventListener('click', actions.onClick);
    };
  }

  set email(value: string) {
    ensureElement<HTMLInputElement>('input[name="email"]', this.container).value = value;
  }

  set phone(value: string) {
    ensureElement<HTMLInputElement>('input[name="phone"]', this.container).value = value;
  }
}