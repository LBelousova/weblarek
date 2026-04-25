import { ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface IOrderSuccess {
  price: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected successDescription: HTMLElement;
  protected successCloseButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);

    this.successDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.successCloseButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    if (actions?.onClick) {
      this.successCloseButton.addEventListener('click', actions.onClick);
    }
  }

  set price(value: number) {
    this.successDescription.textContent = `Списано ${value} синапсов`;
  }
}