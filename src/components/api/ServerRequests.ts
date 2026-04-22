import { IApi, IProductsResponse, IOrderRequest, IOrderResponse} from "../../types/index.ts";
import { Api } from "../base/Api.ts";

export class ServerRequests extends Api implements IApi {

  constructor(baseUrl: string, options?: RequestInit) {
    super(baseUrl, options)
  }

  getProducts(): Promise<IProductsResponse> {
    return this.get<IProductsResponse>('/product/');
  }

  createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.post<IOrderResponse>('/order/', order);
  }
}