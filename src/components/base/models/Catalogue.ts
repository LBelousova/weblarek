import { IProduct } from '../../../types/index.ts';

export class Catalogue {
  protected item!: IProduct

  constructor(protected itemsList: IProduct[]) {
    this.itemsList = itemsList;
  }

  get products(): IProduct[] {
    return this.itemsList;
  }

  set products (prods: IProduct[]) {
    this.itemsList = prods;
  }

  get product(): IProduct {
    return this.item;
  }

  set product (prod: IProduct) {
    this.item = prod;
  }

  getProductById(id: string) : IProduct | string {
    return (this.itemsList.find(item => item.id === id) || `Товар с id ${id} не найден`);
  }
}
