import { Form } from './Form';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { IBuyer } from '../../../types';
import { IForm } from './Form';

interface IFormContacts extends IForm, Partial<IBuyer> {
  email: string;
  phone: string;
}

export class FormContacts extends Form implements IFormContacts {
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.inputElements.forEach(input => {
      input.addEventListener('input', (event: Event) => {
        const field = (event.target as HTMLInputElement).name;
        const value = (event.target as HTMLInputElement).value;

        this.events.emit('input:changed', { field, value });
      })
    });

    this.submitButton.addEventListener('click', (event: Event) => {
      event.preventDefault();
      this.events.emit('form:submit');
    })
  }

  set email(value: string) {
    ensureElement<HTMLInputElement>('input[name="email"]', this.container).value = value;
  }

  set phone(value: string) {
    ensureElement<HTMLInputElement>('input[name="phone"]', this.container).value = value;
  }

  render(data?: IFormContacts | undefined): HTMLElement {
    data?.errors !== undefined && (this.errors = data.errors);
    data?.email !== undefined && (this.email = data.email);
    data?.phone !== undefined && (this.phone = data.phone);
    return super.render(data);
  }
}