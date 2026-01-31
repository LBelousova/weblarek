import { IProduct } from '../../../types/index.ts';

export class Cart {
    constructor(protected cartList: IProduct[]) {
        this.cartList = cartList;
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
        let totalPrice: number | null = 0;
        for (const item of this.cartList) {
            totalPrice += item.price || 0;
        }
        return totalPrice;
    }

    get amountOfItemsInCart(): number {
        return this.cartList.length;
    }

    checkById(itemId: string): boolean {
        return this.cartList.some(item => item.id === itemId);
    }
}