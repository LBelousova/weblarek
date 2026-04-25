import { ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface IBasket {
  list: HTMLElement[] | null;
  price: number;
}

export class Basket extends Component<IBasket> {
  protected basketList: HTMLElement;
  protected basketPrice: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    if(actions?.onClick) {
      this.basketButton.addEventListener('click', actions.onClick);
    }
  }

  set list(content: HTMLElement[]) {
    this.basketList.replaceChildren(...content);
    this.basketButton.disabled = !content.length;
  }

  set price(value: number) {
    this.basketPrice.textContent = `${value} синапсов`;
  }

  render(data?: Partial<IBasket>): HTMLElement {
    this.basketButton.disabled = !this.basketList.children.length;
    return super.render(data);
  }
}
