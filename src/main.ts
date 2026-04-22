import './scss/styles.scss';
import { API_URL } from './utils/constants.ts';
import { ServerRequests } from './components/api/ServerRequests.ts';

import { Buyer } from './components/models/Buyer.ts'; 
import { Cart } from './components/models/Cart.ts';
import { Catalogue } from './components/models/Catalogue.ts';

import { ensureElement, cloneTemplate } from './utils/utils.ts';
import { IProduct, TPayment } from './types/index.ts';
import { EventEmitter } from './components/base/Events.ts';

import { CardPreview } from './components/view/Card/CardPreview.ts';
import { CardBasket } from './components/view/Card/CardBasket.ts';
import { CardCatalog } from './components/view/Card/CardCatalog.ts';
import { FormContacts } from './components/view/Form/FormContacts.ts';
import { FormOrder } from './components/view/Form/FormOrder.ts';
import { Basket } from './components/view/Basket.ts';
import { Gallery } from './components/view/Gallery.ts';
import { Header } from './components/view/Header.ts';
import { Modal } from './components/view/Modal.ts';
import { OrderSuccess } from './components/view/OrderSuccess.ts';

const pageElements = ensureElement<HTMLElement>('.page');
const modalElement = ensureElement<HTMLElement>('#modal-container');
const orderSuccessElement = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogElement = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewElement = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketElement = ensureElement<HTMLTemplateElement>('#card-basket');
const basketElement = ensureElement<HTMLTemplateElement>('#basket');
const formOrderElement = ensureElement<HTMLTemplateElement>('#order');
const formContactsElement = ensureElement<HTMLTemplateElement>('#contacts');

const events = new EventEmitter();
const buyerModel = new Buyer(events);
const cartModel = new Cart(events);
const catalogueModel = new Catalogue(events);
const serverRequests = new ServerRequests(API_URL);

const headerView = new Header(pageElements, events);
const galleryView = new Gallery(pageElements, events);
const modalView = new Modal(modalElement, events);
const orderSuccessView = new OrderSuccess(cloneTemplate(orderSuccessElement), events);
const basketView = new Basket(cloneTemplate(basketElement), events);
const formOrderView = new FormOrder(cloneTemplate(formOrderElement), events);
const formContactsView = new FormContacts(cloneTemplate(formContactsElement), events);

events.on('catalogue:changed', () => {
  const gallary = catalogueModel.products.map(product => {
    const cardCatalogView = new CardCatalog(cloneTemplate(cardCatalogElement), 
      { onClick: () => events.emit('product:select', product)});
        return cardCatalogView.render(product);
  });

  galleryView.render({catalog: gallary});
});

events.on('product:select', (product: IProduct) => {
    catalogueModel.product = product;
});

events.on('product:preview', (product: IProduct) => {
    const cardPreviewView = new CardPreview(cloneTemplate(cardPreviewElement), 
        { onClick: () => {
            if (cartModel.checkById(product.id)) {
                events.emit('basket:delete-product', product);
                cardPreviewView.isInBasket(product.price, cartModel.checkById(product.id));
                modalView.close();
            } else {
                events.emit('basket:add-product', product);
                cardPreviewView.isInBasket(product.price, false);
                modalView.close();
            }
        } });
    cardPreviewView.isInBasket(product.price, cartModel.checkById(product.id))

    modalView.render({
        content: cardPreviewView.render(product)
    });
    modalView.open();
});

events.on('cart:changed', () => {
    headerView.render({
        counter: String(cartModel.amountOfItemsInCart())
    });

    basketView.render({
        list: cartModel.itemsInCart.flatMap((item) => {
            const cartItem = catalogueModel.getProductById(item.id);
            if (!cartItem) return [];
            const cardBasketView = new CardBasket(cloneTemplate(cardBasketElement), {
                onClick: () => {
                    events.emit('basket:delete-product', item)
                }
            })
            return cardBasketView.render({
                title: cartItem.title,
                price: cartItem.price,
                index: (cartModel.itemsInCart.indexOf(cartItem) + 1)
            }) 
        }),
        price: cartModel.getTotalPrice(),
    })
 });

events.on('basket:open', () => {
    modalView.render({
        content: basketView.render({
            list: cartModel.itemsInCart.flatMap((item) => {
                const cartItem = catalogueModel.getProductById(item.id);
                if (!cartItem) return [];
                const cardBasketView = new CardBasket(cloneTemplate(cardBasketElement), {
                    onClick: () => {
                        events.emit('basket:delete-product', cartItem)
                    }
                })
                return cardBasketView.render({
                    title: cartItem.title,
                    price: cartItem.price,
                    index: (cartModel.itemsInCart.indexOf(cartItem) + 1)
                }) 
            }), 
        price: cartModel.getTotalPrice()
        })
    });
    modalView.open();
})

events.on('basket:delete-product', (product: IProduct) => {
    cartModel.removeItemFromCart(product)
})

events.on('basket:add-product', (product: IProduct) => {
    cartModel.addItemToCart(product)
})


events.on('form-order:open', () => {
    modalView.render({
        content: formOrderView.render({
            address: '',
            payment: '',
            valid: false,
            errors: ''
        })
    })
})
 
events.on('payment:select', (data: { payment: TPayment }) => {
    buyerModel.paymentMethod = data.payment;
})

events.on('input:changed', (data: { field: keyof Buyer, value: string }) =>{
    buyerModel.inputInfo = data;
})



events.on('form-contact:open', () => {
    modalView.render({
        content: formContactsView.render({
            email: '',
            phone: '',
            valid: false,
            errors: ''
        })
    })
})

events.on('form-errors:validation', (errors) => {
    const orderErrors = Object.fromEntries(Object.entries(errors).filter(([key]) => key === 'payment' || key === 'address'));
    const contactErrors = Object.fromEntries(Object.entries(errors).filter(([key]) => key === 'email' || key === 'phone'));

    if (Object.keys(orderErrors).length === 0) {
        formOrderView.valid = true;
        formOrderView.errors = '';
    } else {
        formOrderView.render({
        valid: false,
        errors: Object.values(orderErrors).join(', '),
        address: buyerModel.buyerInfo.address,
        payment: buyerModel.buyerInfo.payment
    })}

    if (Object.keys(contactErrors).length === 0) {
        formContactsView.valid = true;
        formContactsView.errors = '';
    } else {
        formContactsView.render({
        valid: false,
        errors: Object.values(contactErrors).join(', '),
        email: buyerModel.buyerInfo.email,
        phone: buyerModel.buyerInfo.phone
    })}
})

events.on('form:submit', async () => {
    try {
        await serverRequests.createOrder({
            items: cartModel.cartItemsIds,
            total: cartModel.getTotalPrice(),
            ...buyerModel.buyerInfo
        })
        .then((data) => {
            events.emit('succeed-form:open', {total: data.total});
        })
    }

    catch (error) {
        console.error('Ошибка при создании заказа:', error);
    }
})

events.on('succeed-form:open', (data: { total: number }) => {
    modalView.render({
        content: orderSuccessView.render({
            price: data.total
        })
    });
    modalView.open();
});

events.on('order:succeed', () => {
    buyerModel.clearBuyerInfo();
    cartModel.clearCart();
    modalView.close();
});

await serverRequests.getProducts()
    .then((data) => {
        catalogueModel.products = data.items;
        console.log('Каталог товаров с сервера:', catalogueModel.products);
    })
    .catch((error) => {
        console.error('Ошибка при получении товаров с сервера:', error);
    });

