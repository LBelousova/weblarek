import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IHeader {
  counter: string;
}

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected busketButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.busketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    this.busketButton.addEventListener('click', () => {
        this.events.emit('basket:open');
    })
  }

    set counter(value: number) {
      this.counterElement.textContent = String(value);
    }
}