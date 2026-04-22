import { Card } from '../Card/Card';
import { ICardActions, IProduct} from '../../../types/index.ts';
import { ensureElement } from '../../../utils/utils';

interface ICardBasket extends Partial<IProduct> {
  index: number;
}

export class CardBasket extends Card {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
  
    if(actions?.onClick) {
      this.deleteButton.addEventListener('click', actions.onClick);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  render(data?: ICardBasket | undefined): HTMLElement {
    
    return super.render(data);
  }
}