import { IProduct } from '../../types/index.ts';

export class Cart {
    private cartList: IProduct[];

    constructor() {
        this.cartList = [];
  }

    get itemsInCart(): IProduct[] {
        return this.cartList;
    }

    addItemInCart(item: IProduct) {
        this.cartList.push(item);
    }

    removeItemFromCart(item: IProduct) {
        this.cartList = this.cartList.filter(cartItem => cartItem !== item);
    }

    clearCart() : void {
        this.cartList = [];
    }

    getTotalPrice(): number {
        return this.cartList.reduce(
            (total, item) => total + (item.price || 0), 0);
    }

    get amountOfItemsInCart(): number {
        return this.cartList.length;
    }

    checkById(itemId: string): boolean {
        return this.cartList.some(item => item.id == itemId);
    }
}