import { IApi, IProductsResponse, IOrderRequest, IOrderResponse} from "../../types/index.ts";

export class ServerRequests {
  constructor(protected api : IApi) {}

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/');
  }

  createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}