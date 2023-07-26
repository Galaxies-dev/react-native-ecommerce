export interface Product {
  id: number;
  product_name: string;
  product_category: string;
  product_description: string;
  product_price: number;
  product_stock: number;
  product_image: string;
}

export interface Order {
  id: number;
  order_date: Date;
  customer_email: string;
  total: number;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  quantity: number;
  total: string;
}
