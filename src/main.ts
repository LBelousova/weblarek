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
const basketView = new Basket(cloneTemplate(basketElement), 
  { onClick: () => events.emit('form-order:open') });
const formOrderView = new FormOrder(cloneTemplate(formOrderElement), events, 
  { onClick: (event: Event) => {
      event.preventDefault();
      events.emit('form-contact:open')
    } 
  });
const formContactsView = new FormContacts(cloneTemplate(formContactsElement), events, 
  { onClick: (event: Event) => {
      event.preventDefault();
      events.emit('form-contact:submit')
    } 
  });
const cardPreviewView = new CardPreview(cloneTemplate(cardPreviewElement), 
  { onClick: () => {
      const product = catalogueModel.product;
      if (!product) return;
      if (cartModel.checkById(product.id)) {
        events.emit('basket:delete-product', product);
        modalView.close();
      } else {
        events.emit('basket:add-product', product);
        modalView.close();
      }
    }});
const orderSuccessView = new OrderSuccess(cloneTemplate(orderSuccessElement), 
  { onClick: () => {
      modalView.close();
    }
  });

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

events.on('product:preview', () => {
  const product = catalogueModel.product;
  if (!product) return;

  const isInBasket = (price: number | null, value: boolean) => {
    if(price === null) {
      cardPreviewView.buttonText = 'Недоступно';
      cardPreviewView.buttonDisabled = !value;
    } else if((price != null) && value) {
      cardPreviewView.buttonText = 'Удалить из корзины';
      cardPreviewView.buttonDisabled = !value;
    } else if((price != null) && !value) {
      cardPreviewView.buttonText = 'Купить';
      cardPreviewView.buttonDisabled = value;
    } 
  }
  
  modalView.render({
    content: cardPreviewView.render({
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
    }),
  });

  isInBasket(product.price, cartModel.checkById(product.id));
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
    content: basketView.render()
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
      address: buyerModel.buyerInfo.address,
      payment: buyerModel.buyerInfo.payment,
    })
  })
})

events.on('buyerInfo:selected', (data: { field: string, value: string | TPayment }) => {
  buyerModel.buyerInfo = data;
});

events.on('payment:changed', () => {
  const activeButton = formOrderElement.querySelector('.button_alt-active');
  activeButton?.classList.toggle('button_alt-active', false);
  formOrderView.payment = buyerModel.buyerInfo.payment;
});

events.on('buyerInfo:changed', () => {
  const errors = buyerModel.isValid();
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

});

events.on('form-contact:open', () => {
  modalView.render({
    content: formContactsView.render({
      email: buyerModel.buyerInfo.email,
      phone: buyerModel.buyerInfo.phone,
    })
  })
})

events.on('form-contact:submit', async () => {
  try {
    await serverRequests.createOrder({
      items: cartModel.cartItemsIds,
      total: cartModel.getTotalPrice(),
      ...buyerModel.buyerInfo
    })
    .then((data) => {
      buyerModel.clearBuyerInfo();
      cartModel.clearCart();
      modalView.render({
        content: orderSuccessView.render({
          price: data.total
        })
      });
    })
  }

  catch (error) {
    console.error('Ошибка при создании заказа:', error);
  }
})

await serverRequests.getProducts()
  .then((data) => {
      catalogueModel.products = data.items;
    console.log('Каталог товаров с сервера:', catalogueModel.products);
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });

