import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events';

export class Catalogue {
  private item: IProduct | null = null;
  private itemsList: IProduct[];

  constructor(protected event: IEvents) {
    this.item = null;
    this.itemsList = [];
  }

  get products(): IProduct[] {
    return this.itemsList;
  }

  set products (prods: IProduct[]) {
    this.itemsList = prods;
    this.event.emit('catalogue:changed');
  }

  get product(): IProduct | null {
    return this.item;
  }

  set product (prod: IProduct) {
    this.item = prod;
    this.event.emit('product:preview');
  }

  getProductById(id: string) : IProduct | null {
    return (this.itemsList.find(item => item.id === id) || null);
  }
}
