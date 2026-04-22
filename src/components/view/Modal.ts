import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    
    this.closeButton.addEventListener('click', () => this.close());
    }


  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  protected outsideClick(event: MouseEvent) {
    if (event.target === this.container) {
      this.close();
    }
  }

  open(state: boolean = true) {
    this.container.classList.toggle('modal_active', state);
    document.addEventListener('click', (event: MouseEvent) => this.outsideClick(event));
  }

  close() {
    this.open(false);
    this.contentElement.replaceChildren();
  }
}