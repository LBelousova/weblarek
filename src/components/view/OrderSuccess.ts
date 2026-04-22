import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IOrderSuccess {
  price: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected successDescription: HTMLElement;
  protected successCloseButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.successDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.successCloseButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
  
    this.successCloseButton.addEventListener('click', () => {
      this.events.emit('order:succeed');
    });
  }

  set price(value: number) {
    this.successDescription.textContent = `Списано ${value} синапсов`;
  }
}