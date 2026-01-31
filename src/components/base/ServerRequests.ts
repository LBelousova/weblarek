import { IApi, TProductRequest, TOrderRequest } from "../../types/index.ts";

export class ServerRequests {
  constructor(protected api : IApi) {
    this.api = api;
  }

  getProducts(): Promise<TProductRequest> {
    return this.api.get<TProductRequest>('/product');
  }

  createOrder(order: TOrderRequest): Promise<TOrderRequest> {
    return this.api.post<TOrderRequest>('/order', order);
  }
}