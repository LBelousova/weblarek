import './scss/styles.scss';
import { Buyer } from './components/base/models/Buyer.ts'; 
import { Cart } from './components/base/models/Cart.ts';
import { Catalogue } from './components/base/models/Catalogue.ts';
import { apiProducts } from './utils/data.ts';
import { ServerRequests } from './components/base/ServerRequests.ts';
import { Api } from './components/base/Api.ts';

// Создание тестовых экземпляров каждого из моделей классов и проверка их методов и свойств

const productsModel = new Catalogue([]);
productsModel.products = apiProducts.items;
console.log('Массив товаров из каталога: ', productsModel.products);
const productById = productsModel.getProductById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
console.log('Товар с указанным id: ', productById);

const cartModel = new Cart([]);
cartModel.addItemInCart(apiProducts.items[0]);
cartModel.addItemInCart(apiProducts.items[1]);
console.log('Товары в корзине: ', cartModel.itemsInCart);
console.log('Общая стоимость товаров в корзине: ', cartModel.getTotalPrice());
console.log('Количество товаров в корзине: ', cartModel.amountOfItemsInCart);
cartModel.removeItemFromCart(apiProducts.items[0]);
console.log('Товары в корзине после удаления одного товара: ', cartModel.itemsInCart);
cartModel.clearCart();
console.log('Товары в корзине после очистки: ', cartModel.itemsInCart);

const buyerModel = new Buyer({});
buyerModel.emailInfo = 'Ludmila@mail.ru';
buyerModel.phoneInfo = '+79261234567';
buyerModel.addressInfo = 'ул. Пушкина, д. Колотушкина';
console.log('Валидация данных покупателя:', buyerModel.isValid());
buyerModel.paymentMethod = 'card';
console.log('Информация о покупателе: ', buyerModel.buyerInfo);
buyerModel.clearBuyerInfo();
console.log('Информация о покупателе после очистки: ', buyerModel.buyerInfo);

const api = new Api('https://larek-api.nomoreparties.co/api/weblarek');
const serverRequests = new ServerRequests(api);
const newProductModele = new Catalogue([]);
newProductModele.products = serverRequests.getProducts()
console.log('Каталог товаров с сервера:', newProductModele.products)