import { IBuyer, TPayment} from '../../../types/index.ts';

export class Buyer{
    protected payment: TPayment;
    protected email: string;
    protected phone: string;
    protected address: string;

    constructor({payment, email, phone, address}: IBuyer) {
        this.payment = payment;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    set paymentMethod(method: TPayment){
        this.payment = method;
    }

    set emailInfo(email: string){
        this.email = email;
    }

    set phoneInfo(phone: string) {
        this.phone = phone;
    }

    set addressInfo(address: string) {
        this.address = address;
    }

    get buyerInfo(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clearBuyerInfo(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    isValid(): Record<string, string> {
        const errors: Record<string, string> = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.email) {
            errors.email = 'Укажите email';
        }
        if (!this.phone) {
            errors.phone = 'Укажите телефон';
        }
        if (!this.address) {
            errors.address = 'Укажите адрес';
        }
        return errors;
    }
}

