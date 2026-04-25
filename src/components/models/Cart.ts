import { IProduct } from '../../types/index.ts';
import { IEvents } from '../base/Events';

export class Cart {
  private cartList: IProduct[];

  constructor(protected event: IEvents) {
    this.cartList = [];
  }

  get itemsInCart(): IProduct[] {
    return this.cartList;
  }
  
  get cartItemsIds(): string[] {
    return this.cartList.map(item => item.id);
  }

  addItemToCart(item: IProduct) {
    this.cartList.push(item);
    this.event.emit('cart:changed');
  }

  removeItemFromCart(item: IProduct) {
    this.cartList = this.cartList.filter(cartItem => cartItem !== item);
    this.event.emit('cart:changed');
  }

  clearCart() : void {
    this.cartList = [];
    this.event.emit('cart:changed');
  }

  getTotalPrice(): number {
    return this.cartList.reduce(
      (total, item) => total + (item.price || 0), 0);
  }

  amountOfItemsInCart(): number {
    return this.cartList.length;
  }

  checkById(itemId: string): boolean {
    return this.cartList.some(item => item.id == itemId);
  }
}