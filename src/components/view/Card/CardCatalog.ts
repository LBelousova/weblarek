import { Card } from '../Card/Card';
import { ICardActions, IProduct} from '../../../types/index.ts';
import { ensureElement } from '../../../utils/utils';
import { categoryMap, CDN_URL } from '../../../utils/constants';

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card<Partial<IProduct>> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    
    if(actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
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
}
