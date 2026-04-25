import { ensureAllElements, ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';

export interface IForm {
  errors: string;
  valid: boolean;
}

export class Form<T> extends Component<IForm&T> {
  protected inputElements: HTMLElement[];
  protected submitButton: HTMLButtonElement;
  protected formErrors: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.inputElements = ensureAllElements<HTMLElement>('.form__input', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('.button[type="submit"]', this.container);
    this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.formErrors.textContent = value;
  }
}