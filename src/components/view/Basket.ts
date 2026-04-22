import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasket {
  list: HTMLElement[] | null;
  price: number;
}

export class Basket extends Component<IBasket> {
  protected basketList: HTMLElement;
  protected basketPrice: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit('form-order:open');
    })
  }

  protected buttonState(state: boolean) {
    this.basketButton.disabled = state;
  }

  set list(content: HTMLElement[]) {
    if(!content.length) {
      this.buttonState(true);
      this.basketList.replaceChildren();
    } else {
      this.buttonState(false);
      this.basketList.replaceChildren();
      content.forEach(item => {
        this.basketList.appendChild(item);
      })
    };
  }

  set price(value: number) {
    this.basketPrice.textContent = `${value} синапсов`;
  }
}
