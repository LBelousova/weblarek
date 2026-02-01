import { IProduct } from '../../types/index.ts';

export class Catalogue {
  private item: IProduct | null = null;
  private itemsList: IProduct[];

  constructor() {
    this.item = null;
    this.itemsList = [];
  }

  get products(): IProduct[] {
    return this.itemsList;
  }

  set products (prods: IProduct[]) {
    this.itemsList = prods;
  }

  get product(): IProduct | null {
    return this.item;
  }

  set product (prod: IProduct) {
    this.item = prod;
  }

  getProductById(id: string) : IProduct | null {
    return (this.itemsList.find(item => item.id === id) || null);
  }
}
