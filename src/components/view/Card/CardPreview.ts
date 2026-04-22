import { ICardActions } from '../../../types/index.ts';
import { ensureElement } from '../../../utils/utils';
import { Card } from './Card.ts';
import { categoryMap, CDN_URL } from '../../../utils/constants';

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card {

  protected cardButton: HTMLButtonElement;
  protected descriptionElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    if(actions?.onClick) {
      this.cardButton.addEventListener('click', actions.onClick);
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set image(value: string) {
      this.setImage(this.imageElement,
        `${CDN_URL}${value.replace('svg', 'png')}`, 
        this.title);
    }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      )
    }
  }

  isInBasket(price: number | null, value: boolean,): void {
    if(price === null) {
      this.cardButton.textContent = 'Недоступно';
      this.cardButton.disabled = true;
    } else if((price != null) && value) {
      this.cardButton.textContent = 'Удалить из корзины';
    } else if((price != null) && !value) {
      this.cardButton.textContent = 'Купить';
    }
  }
}