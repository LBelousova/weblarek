import { IBuyer, TPayment, TError} from '../../types/index.ts';

export class Buyer{
    private payment: TPayment;
    private email: string;
    private phone: string;
    private address: string;

    constructor() {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
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

    isValid(): TError {
        const errors: TError = {};

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

