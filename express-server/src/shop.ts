import express, { Request, Response } from 'express';
import sql from './db';
import { Order, OrderItem, Product } from './interfaces';
const router = express.Router();

// Error handler for database queries
const handleQueryError = (err: any, res: Response) => {
  console.error('Error executing query:', err);
  res.status(500).json({ error: 'An error occurred while executing the query.' });
};

// Get all products
router.get('/products', async (req: Request, res: Response) => {
  try {
    const rows = await sql<Product[]>`SELECT * FROM products;`;
    res.json(rows);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Get a single product by ID
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rows = await sql<Product[]>`SELECT * FROM products WHERE id = ${id};`;
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Create a new order with multiple products and a user email
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const { email, products } = req.body;
    const order = await sql.begin(async (sql) => {
      const [order] = await sql<Order[]>`
        INSERT INTO orders (customer_email) VALUES (${email}) RETURNING *;
      `;
      // Get every product price
      const productPrices = await Promise.all(
        products.map(async (orderItem: OrderItem) => {
          const [product] = await sql<Product[]>`SELECT product_price FROM products WHERE id = ${orderItem.product_id};`;
          return product.product_price;
        })
      );

      const orderProducts = await Promise.all(
        products.map(async (orderItem: OrderItem, index: number) => {
          const [orderProduct] = await sql<OrderItem[]>`
            INSERT INTO order_items (order_id, product_id, quantity, total)
            VALUES (${order.id}, ${orderItem.product_id}, ${orderItem.quantity}, ${productPrices[index] * orderItem.quantity})
            RETURNING *;
          `;
          return orderProduct;
        })
      );

      // Update the total price of the order
      const total = orderProducts.reduce((acc: number, curr: OrderItem) => {
        return acc + parseFloat(curr.total);
      }, 0);

      const [updatedOrder] = await sql<Order[]>`
        UPDATE orders SET total = ${total} WHERE id = ${order.id} RETURNING *;
      `;
      return { ...updatedOrder, products: orderProducts };
    });
    res.json(order);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Write a route to get all orders
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const rows = await sql`
    SELECT
    o.id AS order_id,
    o.order_date,
    o.customer_email,
    o.total AS order_total,
    JSON_AGG(
      JSON_BUILD_OBJECT('product_name', p.product_name, 'quantity', oi.quantity)
    ) AS products
  FROM
    orders o
  INNER JOIN
    order_items oi ON o.id = oi.order_id
  INNER JOIN
    products p ON oi.product_id = p.id
  GROUP BY
    o.id, o.order_date, o.customer_email, o.total;
    `;
    res.json(Object.values(rows));
  } catch (err) {
    handleQueryError(err, res);
  }
});

router.get('/orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rows = await sql`
    SELECT
    o.id AS order_id,
    o.order_date,
    o.customer_email,
    o.total AS order_total,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'product_id', p.id,
        'product_name', p.product_name,
        'product_category', p.product_category,
        'product_description', p.product_description,
        'product_price', p.product_price,
        'quantity', oi.quantity,
        'order_item_total', oi.total
      )
    ) AS order_items
  FROM
    orders o
  INNER JOIN
    order_items oi ON o.id = oi.order_id
  INNER JOIN
    products p ON oi.product_id = p.id
  WHERE
    o.id = ${id}
  GROUP BY
    o.id, o.order_date, o.customer_email, o.total;
  
    `;
    res.json(Object.values(rows));
  } catch (err) {
    handleQueryError(err, res);
  }
});

export default router;
